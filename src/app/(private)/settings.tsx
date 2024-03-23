import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableNativeFeedback, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import AppBlurView from '@/components/AppBlurView';
import ErrorChip from '@/components/ErrorChip';
import ProfilePicture from '@/components/Home/ProfilePicture';
import AppFooter from '@/components/Settings/AppFooter';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';
import LanguageBottomSheet from '@/components/Settings/LanguageBottomSheet';
import LogoutBottomSheet from '@/components/Settings/LogoutBottomSheet';
import PresenceBottomSheet from '@/components/Settings/PresenceBottomSheet';
import PresenceGraph from '@/components/Settings/PresenceGraph';
import ServiceRow from '@/components/Settings/ServiceRow';
import ThemeBottomSheet from '@/components/Settings/ThemeBottomSheet';
import ThemePicker from '@/components/Settings/ThemePicker';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { SYSTEM_LANGUAGE, getLanguageLabel } from '@/i18n';
import {
  getMemberActivity,
  getMemberProfile,
  type ApiMemberActivity,
} from '@/services/api/members';
import { IS_DEV } from '@/services/updates';
import useAuthStore from '@/stores/auth';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const NAVIGATION_HEIGHT = 48;
const HEADER_HEIGHT = 192;
const INTERPOLATE_INPUT = [-1, 0, HEADER_HEIGHT, HEADER_HEIGHT];

const Settings = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const authStore = useAuthStore();
  const chosenLanguage = useSettingsStore((state) => state.language);
  const verticalScrollProgress = useSharedValue(0);

  const [selectedPresence, setSelectedPresence] = useState<ApiMemberActivity | null>(null);
  const [isPickingLanguage, setPickingLanguage] = useState(false);
  const [isPickingTheme, setPickingTheme] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isContacting, setContacting] = useState(false);

  const {
    data: activity,
    isFetching: isFetchingActivity,
    error: activityError,
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'activity'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberActivity(userId);
      }
      throw new Error('Missing user id');
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  const {
    data: profile,
    isFetching: isFetchingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['members', authStore.user?.id],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId);
      }
      throw new Error('Missing user id');
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  /* this is a hell of a hack */
  const [footerHeight, setFooterHeight] = useState(0);
  const [footerWidth, setFooterWidth] = useState(0);

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
            <ProfilePicture attending={profile?.attending} style={tw`h-24 w-24`} />

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
            <View style={tw`flex flex-row gap-2 justify-between items-center min-h-6 mx-6`}>
              <Text style={tw`text-sm font-normal uppercase text-slate-500`}>
                {t('settings.profile.presence.title')}
              </Text>
              {activityError && !isSilentError(activityError) ? (
                <ErrorChip
                  error={activityError}
                  label={t('settings.profile.presence.onFetch.fail')}
                />
              ) : profileError && !isSilentError(profileError) ? (
                <ErrorChip error={profileError} label={t('home.profile.onFetch.fail')} />
              ) : (
                profile?.attending && (
                  <Animated.View
                    entering={FadeInRight.duration(300).delay(300)}
                    style={[
                      tw`flex flex-row items-center gap-1.5 px-2 py-1 rounded-full border-[0.5px] border-gray-300 dark:border-gray-700`,
                    ]}>
                    <View style={tw`h-2 w-2 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
                    <Text
                      numberOfLines={1}
                      style={tw`text-xs font-normal shrink text-gray-900 dark:text-gray-200`}>
                      {t('settings.profile.presence.attending')}
                    </Text>
                  </Animated.View>
                )
              )}
            </View>

            <PresenceGraph
              activity={activity}
              loading={isFetchingActivity || isFetchingProfile}
              nonCompliantDates={nonCompliantDates}
              selectedDate={selectedPresence?.date}
              onDateSelect={onDateSelect}
            />

            <Text style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
              {t('settings.general.title')}
            </Text>
            {IS_DEV ? (
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
            ) : null}
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

            <Text style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
              {t('settings.support.title')}
            </Text>
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
                withBottomDivider
                label={t('settings.support.signal.label')}
                prefixIcon="chat-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="open-in-new"
              />
            </Link>
            <ServiceRow
              label={t('settings.support.contact.title')}
              prefixIcon="help-circle-outline"
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right"
              onPress={() => setContacting(true)}
            />

            <ServiceRow
              label={t('actions.logout')}
              prefixIcon="logout"
              style={tw`px-3 mx-3 mt-6`}
              suffixIcon="chevron-right"
              onPress={() => setLoggingOut(true)}
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
            <AppBlurView
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
      {isLoggingOut && <LogoutBottomSheet onClose={() => setLoggingOut(false)} />}
      {isContacting && <ContactBottomSheet onClose={() => setContacting(false)} />}
    </View>
  );
};

export default Settings;
