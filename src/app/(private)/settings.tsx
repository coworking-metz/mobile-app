import { MaterialCommunityIcons } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import { dismissAuthSession } from 'expo-web-browser';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableNativeFeedback, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  FadeInLeft,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastPresets } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import ProfilePicture from '@/components/Home/ProfilePicture';
import AppFooter from '@/components/Settings/AppFooter';
import LanguageBottomSheet from '@/components/Settings/LanguageBottomSheet';
import LogoutBottomSheet from '@/components/Settings/LogoutBottomSheet';
import PresenceBottomSheet from '@/components/Settings/PresenceBottomSheet';
import PresenceGraph from '@/components/Settings/PresenceGraph';
import ServiceRow from '@/components/Settings/ServiceRow';
import ThemeBottomSheet from '@/components/Settings/ThemeBottomSheet';
import ThemePicker from '@/components/Settings/ThemePicker';
import { theme } from '@/helpers/colors';
import { isSilentError, parseErrorText, useErrorNotification } from '@/helpers/error';
import { SYSTEM_LANGUAGE, getLanguageLabel } from '@/i18n';
import {
  type ApiMemberActivity,
  getMemberActivity,
  getMemberProfile,
} from '@/services/api/members';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';
import useToastStore from '@/stores/toast';

const NAVIGATION_HEIGHT = 48;
const HEADER_HEIGHT = 192;
const INTERPOLATE_INPUT = [-1, 0, HEADER_HEIGHT, HEADER_HEIGHT];
const IS_PROD = Constants.releaseChannel === 'production';

const Settings = () => {
  useDeviceContext(tw);
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const notifyError = useErrorNotification();
  const router = useRouter();
  const authStore = useAuthStore();
  const chosenLanguage = useSettingsStore((state) => state.language);
  const verticalScrollProgress = useSharedValue(0);

  const [shouldRenderAllPresences, setRenderAllPresences] = useState<boolean>(false);
  const [selectedPresence, setSelectedPresence] = useState<ApiMemberActivity | null>(null);
  const [isPickingLanguage, setPickingLanguage] = useState(false);
  const [isPickingTheme, setPickingTheme] = useState(false);
  const [isContactingTeam, setContactingTeam] = useState(false);
  const [wantsToLogout, setWantsToLogout] = useState(false);

  const {
    data: activity,
    isFetching: isFetchingActivity,
    error: activityError,
  } = useQuery({
    queryKey: ['activity', authStore.user?.id],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberActivity(userId);
      }
      throw new Error('Missing user id');
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!authStore.user,
  });

  const {
    data: profile,
    isFetching: isFetchingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', authStore.user?.id],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId);
      }
      throw new Error('Missing user id');
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!authStore.user,
  });

  useEffect(() => {
    if (activityError && !isSilentError(activityError)) {
      notifyError(t('settings.profile.presence.onFetch.fail'), activityError);
    }
  }, [activityError]);

  useEffect(() => {
    if (profileError && !isSilentError(profileError)) {
      notifyError(t('home.profile.onFetch.fail'), profileError);
    }
  }, [profileError]);

  /* this is a hell of a hack */
  const [footerHeight, setFooterHeight] = useState(0);
  const [footerWidth, setFooterWidth] = useState(0);

  const onContactTeamByEmail = useCallback(() => {
    setContactingTeam(true);
    Linking.openURL('mailto:contact@coworking-metz.fr')
      .catch(async (error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('settings.support.contact.mail.onOpen.fail'),
          description,
          type: 'error',
        });
      })
      .finally(() => setContactingTeam(false));
  }, []);

  const onVerticalScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      verticalScrollProgress.value = contentOffset.y;
    },
  });

  const navigationBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      verticalScrollProgress.value,
      [-1, 0, HEADER_HEIGHT - 16, HEADER_HEIGHT],
      [0, 0, 0, 1],
    );

    return {
      opacity,
    };
  }, [verticalScrollProgress, insets]);

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT, [1, 1, 0, 0]);
    const scale = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT, [1, 1, 0.9]);

    return {
      opacity,
      transform: [{ scale }],
    };
  }, [verticalScrollProgress]);

  const nonCompliantDates = useMemo(() => {
    const balance = profile?.balance || 0;
    if (balance < 0 && activity) {
      return activity
        .filter(({ type }) => type === 'ticket')
        .sort((a, b) => dayjs(b.date).diff(a.date))
        .reduce((acc, item) => {
          const sum = acc.reduce((s, { value }) => s + value, 0);
          if (sum < Math.abs(balance)) {
            return [...acc, item];
          }
          return acc;
        }, [] as ApiMemberActivity[])
        .map(({ date }) => date);
    }

    return [];
  }, [activity, profile]);

  const onDateSelect = useCallback(
    (selectedDate: string) => {
      const activityFound = activity?.find(({ date }) => selectedDate === date);
      if (activityFound) {
        impactAsync(ImpactFeedbackStyle.Light);
        setSelectedPresence(activityFound?.date === selectedPresence?.date ? null : activityFound);
      }
    },
    [setSelectedPresence, activity],
  );

  return (
    <View style={[{ flex: 1 }, tw`bg-gray-100 dark:bg-black`]}>
      <View style={tw`flex flex-col grow relative`}>
        <Animated.View
          style={[
            tw`absolute flex flex-col items-start gap-4 pb-6`,
            {
              top: NAVIGATION_HEIGHT + insets.top,
              left: insets.left,
              right: insets.right,
            },
            headerStyle,
          ]}>
          <View style={tw`flex flex-col items-start gap-4 px-4`}>
            <ProfilePicture style={tw`h-24 w-24`} />

            <View style={tw`flex flex-col ml-2`}>
              <Animated.Text
                entering={FadeInLeft.duration(500)}
                numberOfLines={1}
                style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {authStore.user?.name}
              </Animated.Text>
              <Animated.Text
                entering={FadeInLeft.duration(500).delay(150)}
                style={tw`text-xl font-normal text-slate-500 dark:text-slate-400`}>
                {authStore.user?.email}
              </Animated.Text>
            </View>
          </View>
        </Animated.View>

        {/* this is the footer below the scrollview */}
        <AppFooter
          style={[tw`absolute bottom-0 self-center py-6 px-3`, { marginBottom: insets.bottom }]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            setFooterHeight(nativeEvent.layout.height);
            setFooterWidth(nativeEvent.layout.width);
          }}
        />

        <Animated.ScrollView
          contentContainerStyle={[
            tw`flex flex-col relative`,
            {
              paddingTop: NAVIGATION_HEIGHT + HEADER_HEIGHT + insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
          horizontal={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={[{ flex: 1 }, tw`z-10 grow shrink`]}
          onScroll={onVerticalScroll}>
          <View
            style={[
              tw`flex flex-col w-full grow py-6 bg-gray-50 dark:bg-zinc-900`,
              {
                paddingLeft: insets.left,
                paddingRight: insets.right,
              },
            ]}>
            <Animated.Text
              entering={FadeInLeft.duration(300)}
              style={tw`text-sm font-normal uppercase text-slate-500 mx-6`}>
              {t('settings.profile.presence.title')}
            </Animated.Text>
            <PresenceGraph
              activity={activity}
              loading={isFetchingActivity || isFetchingProfile}
              nonCompliantDates={nonCompliantDates}
              selectedDate={selectedPresence?.date}
              startDate={
                shouldRenderAllPresences ? null : dayjs().subtract(6, 'month').format('YYYY-MM-DD')
              }
              onDateSelect={onDateSelect}
            />
            <SegmentedControl
              fontStyle={tw`font-normal`}
              selectedIndex={shouldRenderAllPresences ? 0 : 1}
              style={tw`mx-6 mt-3`}
              values={[
                t(`settings.profile.presence.period.all`),
                t(`settings.profile.presence.period.last6Months`),
              ]}
              onChange={(event) => {
                setRenderAllPresences(event.nativeEvent.selectedSegmentIndex === 0);
              }}
            />

            <Animated.Text
              entering={FadeInLeft.duration(300)}
              style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
              {t('settings.general.title')}
            </Animated.Text>
            {!IS_PROD ? (
              <Link asChild href="/advanced/">
                <ServiceRow
                  withBottomDivider
                  label={t('advanced.title')}
                  prefixIcon="cog-outline"
                  style={tw`px-3 mx-3`}
                  suffixIcon="chevron-right">
                  <View style={tw`bg-gray-300 dark:bg-gray-700 py-1 px-2 rounded`}>
                    <Text style={tw`text-xs text-slate-900 dark:text-gray-200 font-medium`}>
                      DEV
                    </Text>
                  </View>
                </ServiceRow>
              </Link>
            ) : (
              <></>
            )}
            <Link asChild href="/onboarding">
              <ServiceRow
                withBottomDivider
                label={t('settings.general.onboarding.label')}
                prefixIcon="handshake-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="chevron-right"
              />
            </Link>
            <ServiceRow
              withBottomDivider
              label={t('settings.general.language.label')}
              prefixIcon="web"
              style={tw`px-3 mx-3`}
              onPress={() => setPickingLanguage(true)}>
              <Text style={tw`text-base font-normal text-amber-500 grow text-right`}>
                {getLanguageLabel(
                  !chosenLanguage || chosenLanguage === SYSTEM_OPTION
                    ? SYSTEM_LANGUAGE
                    : chosenLanguage,
                )}
              </Text>
            </ServiceRow>
            <ThemePicker style={tw`px-3 mx-3`} onPress={() => setPickingTheme(true)} />

            <Animated.Text
              entering={FadeInLeft.duration(300)}
              style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
              {t('settings.support.title')}
            </Animated.Text>
            {/* <Link asChild href="/help">
              <ServiceRow
                withBottomDivider
                label={t('settings.support.help.label')}
                prefixIcon="help-circle-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="chevron-right"
              />
            </Link> */}
            <Link asChild href="https://www.coworking-metz.fr/mon-compte/">
              <ServiceRow
                withBottomDivider
                label={t('settings.support.account.label')}
                prefixIcon="account-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="open-in-new"
              />
            </Link>
            <Link asChild href="https://www.coworking-metz.fr/la-boutique/">
              <ServiceRow
                withBottomDivider
                label={t('settings.support.store.label')}
                prefixIcon="cart-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="open-in-new"
              />
            </Link>
            <Link
              asChild
              href="https://signal.group/#CjQKICGvCmD9n9SJSW6z_g5FmRg5rRUj4hWpC1X5XxOexGwrEhDxUfX0r6UQ_blpMGz938M9">
              <ServiceRow
                label={t('settings.support.signal.label')}
                prefixIcon="chat-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="open-in-new"
              />
            </Link>

            <Animated.Text
              entering={FadeInLeft.duration(300)}
              style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
              {t('settings.support.contact.label')}
            </Animated.Text>
            <Link
              asChild
              href="https://conversations-widget.brevo.com/?hostId=65324d6bf96d92531b4091f8">
              <ServiceRow
                withBottomDivider
                label={t('settings.support.contact.conversations.label')}
                prefixIcon="chat-question-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="open-in-new"
              />
            </Link>
            <ServiceRow
              label={t('settings.support.contact.mail.label')}
              loading={isContactingTeam}
              prefixIcon="email-outline"
              style={tw`px-3 mx-3`}
              suffixIcon="open-in-new"
              onPress={onContactTeamByEmail}
            />

            <ServiceRow
              label={t('actions.logout')}
              prefixIcon="logout"
              style={tw`px-3 mx-3 mt-6`}
              onPress={() => setWantsToLogout(true)}
            />
          </View>

          {/* transparent view to fake a touch on the footer link, should mimic as much as possible the footer */}
          <Link asChild href="/about">
            <TouchableNativeFeedback>
              <View style={[tw`self-center`, { height: footerHeight, width: footerWidth }]} />
            </TouchableNativeFeedback>
          </Link>
        </Animated.ScrollView>

        <Animated.View
          style={[
            tw`absolute top-0 left-0 right-0 z-10 flex flex-row pb-2`,
            {
              paddingTop: insets.top,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}>
          <Animated.View
            style={[
              tw`absolute top-0 left-0 bottom-0 right-0 border-b-gray-300 dark:border-b-gray-700 border-b-[0.5px]`,
              navigationBackgroundStyle,
            ]}>
            <BlurView
              intensity={64}
              style={tw`h-full w-full`}
              tint={tw.prefixMatch('dark') ? 'dark' : 'default'}
            />
          </Animated.View>
          <View style={tw`ml-4`}>
            <MaterialCommunityIcons.Button
              backgroundColor="transparent"
              borderRadius={24}
              color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
              iconStyle={{ marginRight: 0 }}
              name="arrow-left"
              size={32}
              style={tw`p-1 shrink-0`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
          </View>
        </Animated.View>
      </View>

      {isPickingLanguage && <LanguageBottomSheet onClose={() => setPickingLanguage(false)} />}
      {isPickingTheme && <ThemeBottomSheet onClose={() => setPickingTheme(false)} />}
      {selectedPresence && (
        <PresenceBottomSheet
          activity={selectedPresence}
          nonCompliant={nonCompliantDates.includes(selectedPresence.date)}
          onClose={() => setSelectedPresence(null)}
        />
      )}
      {wantsToLogout && <LogoutBottomSheet onClose={() => setWantsToLogout(false)} />}
    </View>
  );
};

export default Settings;
