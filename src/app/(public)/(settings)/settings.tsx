import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { Link, usePathname, useRouter } from 'expo-router';
import { compact } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  StyleProp,
  TouchableNativeFeedback,
  View,
  ViewStyle,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  BounceIn,
  BounceOut,
  FadeInLeft,
  FadeInRight,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import AppText from '@/components/AppText';
import ErrorBadge from '@/components/ErrorBadge';
import ProfilePicture from '@/components/Home/ProfilePicture';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import ServiceRowLink from '@/components/Layout/ServiceRowLink';
import LoadingProgressBar from '@/components/LoadingProgressBar';
import PresenceGraph from '@/components/Settings/PresenceGraph';
import ThemePicker from '@/components/Settings/ThemePicker';
import { useAppAuth } from '@/context/auth';
import { useAppContact } from '@/context/contact';
import { useAppI18n } from '@/context/i18n';
import { useAppOnboarding } from '@/context/onboarding';
import { useAppPresence } from '@/context/presence';
import { useAppReview } from '@/context/review';
import { useAppSocials } from '@/context/socials';
import { useAppTheme } from '@/context/theme';
import { useAppUpcomingEvents } from '@/context/upcoming-events';
import { isSilentError } from '@/helpers/error';
import useAppScreen from '@/helpers/screen';
import { SYSTEM_LANGUAGE, getLanguageLabel } from '@/i18n';
import { getHelloActivity, getMemberActivity, getMemberProfile } from '@/services/api/members';
import { IS_DEV, WORDPRESS_BASE_URL } from '@/services/environment';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const NAVIGATION_HEIGHT = 48;
const PICTURE_SIZE = 96;

const Settings = ({ style, from }: { from?: string; style?: StyleProp<ViewStyle> }) => {
  useDeviceContext(tw);
  const { login } = useAppAuth();
  const contact = useAppContact();
  const onboard = useAppOnboarding();
  const { selectLanguage } = useAppI18n();
  const { selectTheme } = useAppTheme();
  const { socialise } = useAppSocials();
  const { selectUpcomingEventsPeriod } = useAppUpcomingEvents();
  const { selectedActivity, selectActivity } = useAppPresence();
  const { isWide } = useAppScreen();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const authStore = useAuthStore();
  const review = useAppReview();
  const chosenLanguage = useSettingsStore((state) => state.language);
  const upcomingEventsPeriod = useSettingsStore((state) => state.upcomingEventsPeriod);
  const verticalScrollProgress = useSharedValue(0);
  const pathname = usePathname();

  const upcomingEventsPeriodValue = useMemo(() => {
    if (upcomingEventsPeriod.unit === 'day' && upcomingEventsPeriod.count === 1) {
      const [firstWord] = dayjs().calendar().split(' ');
      if (firstWord) return firstWord;
    }

    return [
      upcomingEventsPeriod.count,
      t(`settings.home.upcomingEventsPeriod.options.${upcomingEventsPeriod.unit}`, {
        count: upcomingEventsPeriod.count,
      }),
    ].join(' ');
  }, [upcomingEventsPeriod.count, upcomingEventsPeriod.unit, t]);

  const {
    isPending: isPendingActivity,
    isFetching: isFetchingActivity,
    data: activity,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery({
    queryKey: membersQueryKeys.activityById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberActivity(userId);
      }
      return getHelloActivity();
    },
    refetchOnMount: false,
  });

  const {
    isFetching: isFetchingProfile,
    data: profile,
    error: profileError,
    refetch: refetchProfile,
    isEnabled: isProfileEnabled,
  } = useQuery({
    queryKey: membersQueryKeys.profileById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  const [headerHeight, setHeaderHeight] = useState(0);
  /* this is a hell of a hack */
  const [footerHeight, setFooterHeight] = useState(0);
  const [footerWidth, setFooterWidth] = useState(0);

  const onVerticalScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      verticalScrollProgress.value = contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      verticalScrollProgress.value,
      [-1, 0, headerHeight, headerHeight],
      [1, 1, 0, 0],
    );
    const scale = interpolate(
      verticalScrollProgress.value,
      [-1, 0, headerHeight, headerHeight],
      [1, 1, 0.9],
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  }, [verticalScrollProgress, headerHeight]);

  const headerTouchableStyle = useAnimatedStyle(() => {
    const pointerEvents = interpolate(
      verticalScrollProgress.value,
      [-1, 0, (headerHeight - PICTURE_SIZE) / 2, (headerHeight - PICTURE_SIZE) / 2],
      [1, 1, 0, 0],
    );

    return {
      pointerEvents: pointerEvents > 0 ? 'auto' : 'none',
    };
  }, [verticalScrollProgress, headerHeight]);

  // https://github.com/facebook/react-native/issues/54183#issuecomment-3467125323
  const [progressViewOffset, setProgressViewOffset] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressViewOffset(20 + headerHeight + insets.top);
    }, 300);

    return () => clearTimeout(timeout);
  }, [headerHeight, insets.top]);

  const onDateSelect = useCallback(
    (selectedDate: string) => {
      const activityFound = activity?.find(({ date }) => selectedDate === date);
      if (activityFound) {
        impactAsync(ImpactFeedbackStyle.Light);
        selectActivity(activityFound);
      }
    },
    [selectActivity, activity],
  );

  return (
    <View style={[tw`flex-1 bg-gray-100 dark:bg-black relative`, style]}>
      <View
        style={[
          tw`absolute flex flex-col items-stretch`,
          {
            top: NAVIGATION_HEIGHT + insets.top,
            left: insets.left,
            right: insets.right,
            bottom: insets.bottom,
          },
        ]}>
        <Animated.View
          style={[tw`grow-0 shrink-0 w-full`, headerStyle]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            setHeaderHeight(nativeEvent.layout.height);
          }}>
          <View style={tw`flex flex-col items-start gap-4 px-4 pb-6`}>
            <ProfilePicture
              initialsStyle={tw`text-4xl pt-2`}
              name={authStore.user?.name}
              pending={!authStore.user && authStore.isFetchingToken}
              style={{ width: PICTURE_SIZE, height: PICTURE_SIZE }}
              url={authStore.user?.picture}>
              {profile?.attending && (
                <Animated.View
                  entering={BounceIn.duration(1000).delay(300)}
                  exiting={BounceOut.duration(1000)}
                  style={tw`z-20 h-5 w-5 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -bottom-0.5 -right-0.5`}>
                  <View style={tw`h-3 w-3 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
                </Animated.View>
              )}
            </ProfilePicture>
            <View style={tw`flex flex-row justify-between w-full`}>
              <View style={tw`flex flex-col ml-2 shrink basis-0 grow`}>
                <AppText
                  entering={FadeInLeft.duration(500)}
                  style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                  {authStore.user ? authStore.user.name : t('account.title')}
                </AppText>
                <AppText
                  ellipsizeMode={'tail'}
                  entering={FadeInLeft.duration(500).delay(150)}
                  numberOfLines={!authStore.user ? 2 : 1}
                  style={tw`text-xl font-normal text-slate-500 dark:text-neutral-500`}>
                  {authStore.user ? authStore.user.email : t('auth.login.headline')}
                </AppText>

                {authStore.user?.roles.length ? (
                  <Animated.View
                    entering={FadeInLeft.duration(500).delay(300)}
                    style={tw`flex flex-row flex-wrap gap-2 mt-2`}>
                    {authStore.user?.roles.map((role) => (
                      <AppText
                        key={`role-${role}`}
                        style={tw`flex items-center rounded-md overflow-hidden bg-amber-200/50 dark:bg-orange-50/10 px-2.5 py-0.5 text-sm font-medium text-amber-800 dark:text-yellow-700`}>
                        {t(`settings.roles.value.${role}`)}
                      </AppText>
                    ))}
                  </Animated.View>
                ) : null}
              </View>

              <MaterialCommunityIcons
                color={tw.prefixMatch('dark') ? tw.color('stone-400') : tw.color('gray-700')}
                iconStyle={{ height: 32, width: 32, marginRight: 0 }}
                name="chevron-right"
                size={32}
                style={tw`shrink-0 my-auto`}
              />
            </View>
          </View>
        </Animated.View>

        {/* this is the footer below the scrollview */}
        <View
          style={tw`mt-auto flex flex-col gap-1 self-center py-6 px-3`}
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            setFooterHeight(nativeEvent.layout.height);
            setFooterWidth(nativeEvent.layout.width);
          }}>
          <AppText style={tw`font-normal text-slate-500 text-center`}>
            {t('footer.copyright', { year: dayjs().year() })}
          </AppText>
          <AppText style={tw`font-normal text-slate-500 text-center`}>
            {t('footer.madeWith')}
          </AppText>

          <Link asChild href="/about">
            <AppText style={tw`font-normal text-amber-500 text-center`}>
              {t('footer.about')}
            </AppText>
          </Link>
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={[
          tw`flex flex-col relative grow`,
          {
            paddingTop: NAVIGATION_HEIGHT + insets.top + PICTURE_SIZE,
            paddingBottom: insets.bottom,
          },
        ]}
        horizontal={false}
        refreshControl={
          <RefreshControl
            progressViewOffset={progressViewOffset}
            refreshing={isFetchingActivity}
            onRefresh={() =>
              Promise.all(compact([refetchActivity(), isProfileEnabled && refetchProfile()]))
            }
          />
        }
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
                { height: headerHeight - PICTURE_SIZE },
                headerTouchableStyle,
              ]}
            />
          </TouchableNativeFeedback>
        }

        <View
          style={[
            tw`flex flex-col w-full py-6 bg-gray-50 dark:bg-zinc-900 relative`,
            {
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}>
          {(isFetchingActivity || isFetchingProfile) && (
            <LoadingProgressBar style={tw`absolute top-0 inset-x-0`} />
          )}
          <SectionTitle
            loading={isFetchingActivity || isFetchingProfile}
            style={tw`mx-6`}
            title={t('settings.profile.presence.title')}>
            {activityError && !isSilentError(activityError) && !isFetchingActivity ? (
              <ErrorBadge
                error={activityError}
                title={t('settings.profile.presence.onFetch.fail')}
                onRetry={refetchActivity}
              />
            ) : profileError && !isSilentError(profileError) && !isFetchingProfile ? (
              <ErrorBadge
                error={profileError}
                title={t('home.profile.onFetch.fail')}
                onRetry={refetchProfile}
              />
            ) : null}

            {profile?.balance && profile.balance < 0 ? (
              <Animated.View
                entering={FadeInRight.duration(600).delay(500)}
                style={tw`ml-auto flex flex-row items-center justify-end gap-1.5`}>
                <View style={tw`h-2.5 w-2.5 bg-red-600 dark:bg-red-700 rounded-full`} />
                <AppText
                  numberOfLines={1}
                  style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}>
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
            loading={isPendingActivity}
            minimumSquares={!!authStore.user?.id ? 45 : 144}
            selectedDate={selectedActivity?.date}
            style={tw`grow-0`}
            withDescription={!!profile}
            onDateSelect={onDateSelect}
          />

          <SectionTitle style={tw`mx-6 mt-6`} title={t('settings.title')} />
          <ServiceRow
            withBottomDivider
            label={t('settings.language.label')}
            prefixIcon="translate"
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
          <ThemePicker withBottomDivider style={tw`px-3 mx-3`} onPress={selectTheme} />
          <ServiceRow
            withBottomDivider
            description={t('settings.home.upcomingEventsPeriod.hint')}
            label={t('settings.home.upcomingEventsPeriod.label')}
            prefixIcon="calendar-blank-multiple"
            style={tw`px-3 mx-3`}
            onPress={selectUpcomingEventsPeriod}>
            <AppText style={tw`text-base font-normal text-amber-500 text-right`}>
              {upcomingEventsPeriodValue}
            </AppText>
          </ServiceRow>
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
              prefixIcon="shield-account-variant-outline"
              selected={isWide && pathname.startsWith('/privacy')}
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right"
            />
          </Link>
          <Link asChild href="/advanced/">
            <ServiceRow
              label={t('advanced.title')}
              prefixIcon="cog-outline"
              selected={isWide && pathname === '/advanced'}
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right"
            />
          </Link>

          <SectionTitle style={tw`mx-6 mt-6`} title={t('settings.title')} />
          {authStore.user && (
            <>
              <ServiceRowLink
                withBottomDivider
                href={`${WORDPRESS_BASE_URL}/la-boutique/`}
                label={t('settings.store.label')}
                prefixIcon="cart-outline"
                style={tw`px-3 mx-3`}
              />

              {IS_DEV && !authStore.user.onboarding && (
                <ServiceRow
                  withBottomDivider
                  label={t('settings.onboarding.label')}
                  prefixIcon="handshake-outline"
                  selected={isWide && pathname === '/onboarding'}
                  style={tw`px-3 mx-3`}
                  suffixIcon="chevron-right"
                  onPress={onboard}
                />
              )}
            </>
          )}
          <ServiceRow
            withBottomDivider
            label={t('settings.socials.label')}
            prefixIcon="heart-outline"
            style={tw`px-3 mx-3`}
            suffixIcon="chevron-right"
            onPress={socialise}
          />
          <ServiceRow
            withBottomDivider
            label={t('settings.contact.title')}
            prefixIcon="chat-question-outline"
            style={tw`px-3 mx-3`}
            suffixIcon="chevron-right"
            onPress={contact}
          />
          <ServiceRow
            withBottomDivider
            label={t('settings.review.label')}
            prefixIcon="star-outline"
            style={tw`px-3 mx-3`}
            suffixIcon="chevron-right"
            onPress={review}
          />
          <Link asChild href="/introduction">
            <ServiceRow
              label={t('settings.introduction.label')}
              prefix={<View style={tw`w-6 shrink-0 min-h-10`} />}
              selected={isWide && pathname === '/introduction'}
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right"
            />
          </Link>
        </View>

        {/* transparent view to fake a touch on the footer link, should mimic as much as possible the footer */}
        <Link asChild href="/about">
          <TouchableNativeFeedback>
            <View style={[tw`mt-auto self-center`, { height: footerHeight, width: footerWidth }]} />
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
        <AppTopFader style={tw`absolute inset-x-0 top-0`} />

        <AppIconButton
          icon="arrow-left"
          radius={8}
          style={tw`ml-4`}
          onPress={() =>
            from ? router.dismissTo(from) : router.canGoBack() ? router.back() : router.replace('/')
          }
        />
      </Animated.View>
    </View>
  );
};

export default Settings;
