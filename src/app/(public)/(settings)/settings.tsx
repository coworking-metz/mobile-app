import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { Link, usePathname, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  TouchableNativeFeedback,
  View,
  ViewStyle,
  type LayoutChangeEvent,
} from 'react-native';
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
import AppText from '@/components/AppText';
import ErrorBadge from '@/components/ErrorBagde';
import ErrorChip from '@/components/ErrorChip';
import ProfilePicture from '@/components/Home/ProfilePicture';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import AppFooter from '@/components/Settings/AppFooter';
import PresenceGraph from '@/components/Settings/PresenceGraph';
import ThemePicker from '@/components/Settings/ThemePicker';
import { useAppAuth } from '@/context/auth';
import { useAppContact } from '@/context/contact';
import { useAppI18n } from '@/context/i18n';
import { useAppPresence } from '@/context/presence';
import { useAppReview } from '@/context/review';
import { useAppSocials } from '@/context/socials';
import { useAppTheme } from '@/context/theme';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import useAppScreen from '@/helpers/screen';
import { SYSTEM_LANGUAGE, getLanguageLabel } from '@/i18n';
import { getHelloActivity, getMemberActivity, getMemberProfile } from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import useAuthStore from '@/stores/auth';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const NAVIGATION_HEIGHT = 48;
const PICTURE_SIZE = 96;
const HEADER_HEIGHT = 240;
const INTERPOLATE_INPUT = [-1, 0, HEADER_HEIGHT, HEADER_HEIGHT];

const Settings = ({ style, from }: { from?: string; style?: StyleProp<ViewStyle> }) => {
  useDeviceContext(tw);
  const { login } = useAppAuth();
  const contact = useAppContact();
  const { selectLanguage } = useAppI18n();
  const { selectTheme } = useAppTheme();
  const { socialise } = useAppSocials();
  const { selectedActivity, selectActivity } = useAppPresence();
  const { isWide } = useAppScreen();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const authStore = useAuthStore();
  const review = useAppReview();
  const chosenLanguage = useSettingsStore((state) => state.language);
  const verticalScrollProgress = useSharedValue(0);
  const pathname = usePathname();

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
      return getHelloActivity();
    },
    retry: false,
    refetchOnMount: false,
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
      throw new Error(t('account.profile.onFetch.missing'));
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

  const headerTouchableStyle = useAnimatedStyle(() => {
    const pointerEvents = interpolate(
      verticalScrollProgress.value,
      [-1, 0, (HEADER_HEIGHT - PICTURE_SIZE) / 2, (HEADER_HEIGHT - PICTURE_SIZE) / 2],
      [1, 1, 0, 0],
    );

    return {
      pointerEvents: pointerEvents > 0 ? 'auto' : 'none',
    };
  }, [verticalScrollProgress]);

  const nonCompliantActivity = useMemo(() => {
    const balance = profile?.balance || 0;
    if (balance < 0 && activity?.length) {
      const ticketActivities = activity
        .filter(({ type }) => type === 'ticket')
        .sort((a, b) => dayjs(b.date).diff(a.date));

      let remainingDebt = Math.abs(balance);
      const nonCompliantAttendance = [];
      for (const { date, value, type } of ticketActivities) {
        if (remainingDebt <= 0) {
          break;
        }

        const debt = value > remainingDebt ? remainingDebt : value;
        nonCompliantAttendance.push({
          date,
          value: debt,
          type,
        });
        remainingDebt -= debt;
      }

      return nonCompliantAttendance;
    }

    return [];
  }, [activity, profile]);

  const onDateSelect = useCallback(
    (selectedDate: string) => {
      const activityFound = activity?.find(({ date }) => selectedDate === date);
      if (activityFound) {
        impactAsync(ImpactFeedbackStyle.Light);
        selectActivity(
          activityFound,
          nonCompliantActivity.find(({ date }) => dayjs(date).isSame(activityFound.date)),
        );
      }
    },
    [selectActivity, activity],
  );

  return (
    <View style={[tw`flex-1 bg-gray-100 dark:bg-black`, style]}>
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
            <ProfilePicture
              attending={profile?.attending}
              pending={!authStore.user && authStore.isFetchingToken}
              style={{ width: PICTURE_SIZE, height: PICTURE_SIZE }}
              url={authStore.user?.picture}
            />
            <View style={tw`flex flex-row justify-between w-full`}>
              <View style={tw`flex flex-col ml-2 shrink basis-0 grow`}>
                <AppText
                  entering={FadeInLeft.duration(500)}
                  numberOfLines={1}
                  style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                  {authStore.user ? authStore.user.name : t('account.title')}
                </AppText>
                <AppText
                  ellipsizeMode={'tail'}
                  entering={FadeInLeft.duration(500).delay(150)}
                  numberOfLines={authStore.user ? 1 : 2}
                  style={tw`text-xl font-normal text-slate-500 dark:text-slate-400`}>
                  {authStore.user ? authStore.user.email : t('auth.login.headline')}
                </AppText>

                <Animated.View
                  entering={FadeInLeft.duration(500).delay(300)}
                  style={tw`flex flex-row gap-2 mt-2`}>
                  {authStore.user?.roles.map((role) => (
                    <AppText
                      key={`role-${role}`}
                      style={tw`flex items-center rounded-md overflow-hidden bg-amber-200/50 dark:bg-amber-100/80 px-2.5 py-0.5 text-sm font-medium text-amber-800 dark:text-amber-900`}>
                      {t(`settings.roles.value.${role}`)}
                    </AppText>
                  ))}
                </Animated.View>
              </View>

              <MaterialCommunityIcons
                color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                iconStyle={{ height: 32, width: 32, marginRight: 0 }}
                name="chevron-right"
                size={32}
                style={tw`shrink-0 mt-6`}
              />
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
            tw`flex flex-col relative grow`,
            {
              paddingTop: NAVIGATION_HEIGHT + PICTURE_SIZE + insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
          horizontal={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={tw`flex-1 z-10 grow shrink`}
          onScroll={onVerticalScroll}>
          {
            /* transparent view to fake a touch on the header link, should mimic as much as possible the header */
            <TouchableNativeFeedback
              onPress={() => (authStore.user ? router.push('/account') : login?.())}>
              <Animated.View
                style={[
                  tw`self-center w-full`,
                  { height: HEADER_HEIGHT - PICTURE_SIZE },
                  headerTouchableStyle,
                ]}
              />
            </TouchableNativeFeedback>
          }

          <View
            style={[
              tw`flex flex-col w-full py-6 bg-gray-50 dark:bg-zinc-900`,
              {
                paddingLeft: insets.left,
                paddingRight: insets.right,
              },
            ]}>
            <SectionTitle style={tw`mx-6`} title={t('settings.profile.presence.title')}>
              {activityError && !isSilentError(activityError) ? (
                <ErrorBadge
                  error={activityError}
                  title={t('settings.profile.presence.onFetch.fail')}
                />
              ) : profileError && !isSilentError(profileError) ? (
                <ErrorBadge error={profileError} title={t('home.profile.onFetch.fail')} />
              ) : null}

              {profile?.balance && profile.balance < 0 ? (
                <Animated.View
                  entering={FadeInRight.duration(600).delay(500)}
                  style={tw`ml-auto flex flex-row items-center justify-end gap-1.5`}>
                  <View style={tw`h-2.5 w-2.5 bg-red-600 dark:bg-red-700 rounded-full`} />
                  <AppText
                    numberOfLines={1}
                    style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
                    {t('settings.profile.presence.selected.coverage.value.ticket', {
                      count: Math.abs(profile.balance),
                      suffix: t(`settings.profile.presence.selected.debt.unit.ticket`, {
                        count: Math.abs(profile.balance),
                      }),
                    })}
                  </AppText>
                </Animated.View>
              ) : null}
            </SectionTitle>

            <PresenceGraph
              activity={activity}
              activityCount={profile?.totalActivity}
              loading={isFetchingActivity || isFetchingProfile}
              minimumSquares={!!authStore.user?.id ? 45 : 144}
              nonCompliantActivity={nonCompliantActivity}
              selectedDate={selectedActivity?.date}
              style={tw`grow-0`}
              withDescription={!!profile}
              onDateSelect={onDateSelect}
            />

            <SectionTitle style={tw`mx-6 mt-6`} title={t('settings.general.title')} />

            <Link asChild href="/advanced/">
              <ServiceRow
                withBottomDivider
                label={t('advanced.title')}
                prefixIcon="cog-outline"
                selected={isWide && pathname === '/advanced'}
                style={tw`px-3 mx-3`}
                suffixIcon="chevron-right"
              />
            </Link>
            {authStore.user?.id && (
              <Link asChild href="/devices/">
                <ServiceRow
                  withBottomDivider
                  label={t('devices.title')}
                  prefixIcon="devices"
                  selected={isWide && pathname.startsWith('/devices')}
                  style={tw`px-3 mx-3`}
                  suffixIcon="chevron-right"
                />
              </Link>
            )}
            <Link asChild href="/privacy/">
              <ServiceRow
                withBottomDivider
                label={t('privacy.title')}
                prefixIcon="hand-back-left-outline"
                selected={isWide && pathname.startsWith('/privacy')}
                style={tw`px-3 mx-3`}
                suffixIcon="chevron-right"
              />
            </Link>
            <Link asChild href="/onboarding">
              <ServiceRow
                withBottomDivider
                label={t('settings.general.onboarding.label')}
                prefixIcon="handshake-outline"
                selected={isWide && pathname === '/onboarding'}
                style={tw`px-3 mx-3`}
                suffixIcon="chevron-right"
              />
            </Link>
            <ServiceRow
              withBottomDivider
              label={t('settings.general.language.label')}
              prefixIcon="web"
              style={tw`px-3 mx-3`}
              onPress={selectLanguage}>
              <AppText style={tw`text-base font-normal text-amber-500 text-right`}>
                {getLanguageLabel(
                  !chosenLanguage || chosenLanguage === SYSTEM_OPTION
                    ? SYSTEM_LANGUAGE
                    : chosenLanguage,
                )}
              </AppText>
            </ServiceRow>
            <ThemePicker style={tw`px-3 mx-3`} onPress={selectTheme} />

            <SectionTitle style={tw`mx-6 mt-6`} title={t('settings.support.title')} />
            {authStore.user && (
              <Link asChild href={`${WORDPRESS_BASE_URL}/la-boutique/`}>
                <ServiceRow
                  withBottomDivider
                  label={t('settings.support.store.label')}
                  prefixIcon="cart-outline"
                  style={tw`px-3 mx-3`}
                  suffixIcon="open-in-new"
                />
              </Link>
            )}
            <ServiceRow
              withBottomDivider
              label={t('settings.support.socials.label')}
              prefixIcon="message-badge-outline"
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right"
              onPress={socialise}
            />
            <ServiceRow
              withBottomDivider
              label={t('settings.support.contact.title')}
              prefixIcon="help-circle-outline"
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right"
              onPress={contact}
            />
            <ServiceRow
              label={t('settings.support.review.label')}
              prefixIcon="star-outline"
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right"
              onPress={review}
            />
          </View>

          {/* transparent view to fake a touch on the footer link, should mimic as much as possible the footer */}
          <Link asChild href="/about">
            <TouchableNativeFeedback>
              <View
                style={[tw`mt-auto self-center`, { height: footerHeight, width: footerWidth }]}
              />
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
              color={tw.prefixMatch('dark') ? tw.color('gray-400') : theme.charlestonGreen}
              iconStyle={{ marginRight: 0 }}
              name="arrow-left"
              size={32}
              style={tw`p-1 shrink-0`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
              onPress={() =>
                from
                  ? router.dismissTo(from)
                  : router.canGoBack()
                    ? router.back()
                    : router.replace('/')
              }
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default Settings;
