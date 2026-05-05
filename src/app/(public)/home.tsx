import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { NetworkStateType, useNetworkState } from 'expo-network';
import { Link } from 'expo-router';
import { compact, includes, isNil, sample } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import Animated, {
  BounceIn,
  BounceOut,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import { toast } from 'sonner-native';
import tw, { useDeviceContext } from 'twrnc';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import AppIconButton from '@/components/AppIconButton';
import AppPressable from '@/components/AppPressable';
import AppText from '@/components/AppText';
import ErrorBadge from '@/components/ErrorBadge';
import AttendanceCount from '@/components/Home/AttendanceCount';
import BalanceBottomSheet from '@/components/Home/BalanceBottomSheet';
import BalanceCard from '@/components/Home/BalanceCard';
import BirthdayBottomSheet from '@/components/Home/BirthdayBottomSheet';
import BirthdayCard from '@/components/Home/BirthdayCard';
import CalendarEventCard from '@/components/Home/CalendarEventCard';
import DevicesCard from '@/components/Home/DevicesCard';
import HomeCalendarEmptyState from '@/components/Home/HomeCalendarEmptyState';
import HomeLayout from '@/components/Home/HomeLayout';
import MembershipBottomSheet from '@/components/Home/MembershipBottomSheet';
import MembershipCard from '@/components/Home/MembershipCard';
import OnPremiseCard from '@/components/Home/OnPremiseCard';
import OnboardingCard from '@/components/Home/OnboardingCard';
import OpenParkingCard from '@/components/Home/OpenParkingCard';
import ProfilePicture from '@/components/Home/ProfilePicture';
import StaleDataText, { STALE_PERIOD_IN_SECONDS } from '@/components/Home/StaleDataText';
import SubscriptionBottomSheet from '@/components/Home/SubscriptionBottomSheet';
import SubscriptionCard from '@/components/Home/SubscriptionCard';
import UnauthenticatedState from '@/components/Home/UnauthenticatedState';
import UnlockGateCard from '@/components/Home/UnlockGateCard';
import SectionTitle from '@/components/Layout/SectionTitle';
import { useAppContact } from '@/context/contact';
import { useAppOnboarding } from '@/context/onboarding';
import useAppState from '@/helpers/app-state';
import { isSilentError } from '@/helpers/error';
import useAppScreen, { WIDE_SCREEN_WIDTH } from '@/helpers/screen';
import { getCalendarEvents } from '@/services/api/calendar';
import {
  getCurrentMembers,
  getMemberDevices,
  getMemberMessages,
  getMemberProfile,
  getMemberSubscriptions,
  isMemberBalanceInsufficient,
} from '@/services/api/members';
import { IS_DEV } from '@/services/environment';
import { eventsQueryKeys, membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

export default function HomeScreen() {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();
  const toastStore = useToastStore();
  const activeSince = useAppState();
  const { isWide, width } = useAppScreen();
  const networkState = useNetworkState();
  const isFocus = useIsFocused();

  const subscriptionBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const balanceBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const membershipBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const birthdayBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const contact = useAppContact();
  const onboard = useAppOnboarding();

  const {
    isFetching: isFetchingCurrentMembers,
    refetch: refetchCurrentMembers,
    dataUpdatedAt: currentMembersUpdatedAt,
  } = useQuery({
    queryKey: membersQueryKeys.attending(),
    queryFn: getCurrentMembers,
  });

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
    refetch: refetchProfile,
    error: profileError,
    isEnabled: isProfileEnabled,
  } = useQuery({
    queryKey: membersQueryKeys.profileById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const {
    data: devices,
    isPending: isPendingDevices,
    isFetching: isFetchingDevices,
    refetch: refetchDevices,
    isEnabled: areDevicesEnabled,
  } = useQuery({
    queryKey: membersQueryKeys.devicesById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberDevices(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const {
    isFetching: isFetchingMessages,
    data: messages,
    refetch: refetchMessages,
    isEnabled: areMessagesEnabled,
  } = useQuery({
    queryKey: membersQueryKeys.allMessagesById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberMessages(userId);
      }
      throw new Error(t('messages.onFetch.missing'));
    },
    enabled: IS_DEV && !!authStore.user?.id,
  });

  const isTodayBirthday = useMemo(() => {
    return false; // currently disabled
    // profile?.birthDate && dayjs(profile.birthDate).isSame(dayjs(), 'day');
  }, [profile]);

  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    isFetching: isFetchingSubscriptions,
    refetch: refetchSubscriptions,
    error: subscriptionsError,
    isEnabled: areSubscriptionsEnabled,
  } = useQuery({
    queryKey: membersQueryKeys.subscriptionsById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberSubscriptions(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const currentSubscription = useMemo(() => {
    // retrieve ongoing subscription
    const ongoingSubscription = subscriptions?.find(({ current }) => current);
    if (ongoingSubscription) return ongoingSubscription;

    // or the next one
    const nextSubscription = subscriptions?.findLast(({ started }) => dayjs().isBefore(started));
    if (nextSubscription) return nextSubscription;

    // or the most recent one
    const [lastSubscription] = subscriptions || [];
    return lastSubscription ?? null;
  }, [subscriptions]);

  const {
    data: calendarEvents,
    isLoading: isLoadingCalendarEvents,
    isFetching: isFetchingCalendarEvents,
    dataUpdatedAt: calendarEventsUpdatedAt,
    refetch: refetchCalendarEvents,
    error: calendarEventsError,
  } = useQuery({
    queryKey: eventsQueryKeys.all(),
    queryFn: getCalendarEvents,
  });

  const upcomingEvents = useMemo(() => {
    const now = dayjs();
    const endOfPeriod = now
      .subtract(1, 'day')
      .add(settingsStore.upcomingEventsPeriod.count, settingsStore.upcomingEventsPeriod.unit)
      .endOf('day');

    return (
      calendarEvents?.filter(
        ({ start, end }) =>
          now.isBetween(start, end) ||
          dayjs(start).isBetween(now, endOfPeriod, 'hour', '[]') ||
          dayjs(end).isBetween(now, endOfPeriod, 'hour', '[]'),
      ) ?? []
    );
  }, [calendarEvents, activeSince, settingsStore.upcomingEventsPeriod]);

  const onRefresh = useCallback(() => {
    return Promise.all(
      compact([
        refetchCurrentMembers(),
        refetchCalendarEvents(),
        isProfileEnabled && refetchProfile(),
        areSubscriptionsEnabled && refetchSubscriptions(),
        areDevicesEnabled && refetchDevices(),
        areMessagesEnabled && refetchMessages(),
      ]),
    );
  }, [authStore.user, settingsStore]);

  const onSuccessiveTaps = useCallback(() => {
    toastStore.add({
      message: `${sample(t('home.onSuccessiveTaps.message', { returnObjects: true }))}`,
      type: 'info',
      action: {
        label: `${sample(t('home.onSuccessiveTaps.action', { returnObjects: true }))}`,
        onPress: async () => {
          toast.dismiss();
          contact();
        },
      },
    });
  }, [toastStore, t]);

  const isFetching = useMemo(() => {
    return (
      isFetchingCurrentMembers ||
      isFetchingProfile ||
      isFetchingSubscriptions ||
      isFetchingCalendarEvents ||
      isFetchingDevices ||
      isFetchingMessages
    );
  }, [
    isFetchingCurrentMembers,
    isFetchingProfile,
    isFetchingSubscriptions,
    isFetchingCalendarEvents,
    isFetchingDevices,
    isFetchingMessages,
  ]);

  useEffect(() => {
    if (
      isFocus &&
      networkState.isConnected &&
      networkState.isInternetReachable &&
      includes([NetworkStateType.ETHERNET, NetworkStateType.WIFI], networkState.type) &&
      currentMembersUpdatedAt &&
      dayjs().diff(currentMembersUpdatedAt, 'second') > STALE_PERIOD_IN_SECONDS
    ) {
      onRefresh();
    }
  }, [isFocus, activeSince, networkState]);

  const onPremiseLocation = useMemo(() => {
    if (profile?.location && profile?.attending) {
      return profile?.location;
    }
  }, [profile?.location, profile?.attending]);

  return (
    <HomeLayout
      outerChildren={
        <>
          <BirthdayBottomSheet ref={birthdayBottomSheetRef} />

          <SubscriptionBottomSheet
            ref={subscriptionBottomSheetRef}
            currentSubscription={currentSubscription}
          />

          <BalanceBottomSheet ref={balanceBottomSheetRef} loading={isFetchingProfile} />

          <MembershipBottomSheet
            ref={membershipBottomSheetRef}
            active={profile?.activeUser}
            activityOverLast6Months={profile?.activity}
            lastMembershipYear={profile?.lastMembership}
            loading={isFetchingProfile}
            valid={profile?.membershipOk}
          />
        </>
      }
      onRefresh={() => {
        useSettingsStore.setState({ hasLearnPullToRefresh: true });
        return onRefresh();
      }}>
      <View
        style={[
          tw`flex flex-row items-center grow shrink pt-1 pl-6 pr-4`,
          isWide && tw`mx-auto w-full max-w-2xl`,
        ]}>
        <StaleDataText
          lastFetch={currentMembersUpdatedAt}
          loading={isFetching}
          onRefresh={onRefresh}
        />

        <View style={tw`flex flex-row items-center justify-end gap-2 shrink grow basis-0`}>
          {areMessagesEnabled && (
            <Animated.View
              entering={BounceIn.duration(1000).delay(300)}
              exiting={BounceOut.duration(1000)}
              style={tw`relative`}>
              <Link asChild href={'/messages'}>
                <AppIconButton
                  icon="message-text-outline"
                  iconSize={24}
                  iconStyle={tw`p-2`}
                  loading={isFetchingMessages}
                  radius={0}
                />
              </Link>

              {messages?.some(({ read }) => !read) && (
                <Animated.View
                  entering={BounceIn.duration(1000)}
                  exiting={BounceOut.duration(1000)}
                  style={tw`z-20 h-5 w-5 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -top-1.5 -right-1.5`}>
                  <View style={tw`h-3 w-3 bg-blue-600 dark:bg-blue-700 rounded-full`} />
                </Animated.View>
              )}
            </Animated.View>
          )}

          <Link asChild href="(settings)">
            <AppPressable>
              <ProfilePicture
                loading={isFetching}
                name={authStore.user?.name}
                pending={!authStore.user && authStore.isFetchingToken}
                style={tw`h-12 w-12`}
                url={authStore.user?.picture}>
                {profile?.attending && (
                  <Animated.View
                    entering={BounceIn.duration(1000)}
                    exiting={BounceOut.duration(1000)}
                    style={tw`z-20 h-5 w-5 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -bottom-0.5 -right-0.5`}>
                    <View style={tw`h-3 w-3 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
                  </Animated.View>
                )}
              </ProfilePicture>
            </AppPressable>
          </Link>
        </View>
      </View>

      <Animated.View
        entering={FadeInLeft.duration(750)}
        style={[
          tw`flex flex-col self-stretch gap-2 pl-6 pr-4`,
          isWide && tw`mx-auto w-full max-w-2xl`,
        ]}>
        <AttendanceCount style={tw`mt-4`} />
      </Animated.View>

      <Animated.View
        entering={FadeInLeft.duration(750).delay(400)}
        style={tw`flex flex-col self-stretch`}>
        <SectionTitle
          loading={isFetchingProfile || isFetchingSubscriptions}
          style={[tw`self-stretch mt-9 pl-6 pr-4`, isWide && tw`mx-auto w-full max-w-2xl`]}
          title={t('home.profile.label')}>
          {profileError && !isSilentError(profileError) && !isFetchingProfile ? (
            <ErrorBadge
              error={profileError}
              title={t('home.profile.onFetch.fail')}
              onRetry={refetchProfile}
            />
          ) : subscriptionsError &&
            !isSilentError(subscriptionsError) &&
            !isFetchingSubscriptions ? (
            <ErrorBadge
              error={subscriptionsError}
              title={t('home.profile.subscription.onFetch.fail')}
              onRetry={refetchSubscriptions}
            />
          ) : null}
        </SectionTitle>

        <ScrollView
          contentContainerStyle={[
            tw`flex flex-row items-stretch gap-4 px-4 mt-4 overflow-visible`,
            isWide && {
              paddingLeft: (width - WIDE_SCREEN_WIDTH) / 2 + 16,
              paddingRight: (width - WIDE_SCREEN_WIDTH) / 2 + 16,
            },
          ]}
          horizontal={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={tw`w-full overflow-visible`}>
          {IS_DEV && !authStore.user?.onboarding?.date && (
            <AppPressable style={tw`flex flex-row items-stretch`} onPress={onboard}>
              <OnboardingCard
                date={dayjs().add(12, 'day').toISOString()}
                glowing={isNil(settingsStore.hasReadOnboardingInstructionsAt)}
                style={tw`min-h-38 min-w-32`}
              />
            </AppPressable>
          )}
          {isTodayBirthday && (
            <AppPressable
              style={tw`flex flex-row items-stretch`}
              onPress={() => birthdayBottomSheetRef.current?.open()}>
              <BirthdayCard style={tw`min-h-38 min-w-32`} />
            </AppPressable>
          )}
          {((devices && !devices.length) || (profile && !profile.lastSeen)) && (
            <Link asChild href="/devices">
              <AppPressable style={tw`flex flex-row items-stretch`}>
                <DevicesCard
                  count={devices?.length}
                  entering={FadeIn.duration(500)}
                  exiting={FadeOut.duration(500)}
                  pending={isPendingDevices}
                  style={tw`min-h-38 min-w-32`}
                />
              </AppPressable>
            </Link>
          )}
          <AppPressable
            style={tw`flex flex-row items-stretch`}
            onPress={() => balanceBottomSheetRef.current?.open()}>
            <BalanceCard
              count={profile?.balance ?? 0}
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingProfile}
              style={tw`min-h-38 min-w-32`}
              valid={profile && !isMemberBalanceInsufficient(profile)}
            />
          </AppPressable>
          <AppPressable
            style={tw`flex flex-row items-stretch`}
            onPress={() => subscriptionBottomSheetRef.current?.open()}>
            <SubscriptionCard
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingSubscriptions}
              style={tw`min-h-38 min-w-32`}
              subscription={currentSubscription}
            />
          </AppPressable>
          <AppPressable
            style={tw`flex flex-row items-stretch`}
            onPress={() => membershipBottomSheetRef.current?.open()}>
            <MembershipCard
              active={profile?.activeUser}
              lastMembershipYear={profile?.lastMembership}
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingProfile}
              style={tw`min-h-38 min-w-32`}
              valid={profile?.membershipOk}
            />
          </AppPressable>
        </ScrollView>
      </Animated.View>

      <SectionTitle
        count={upcomingEvents.length > 2 ? upcomingEvents.length : null}
        entering={FadeInRight.duration(750).delay(600)}
        loading={isFetchingCalendarEvents}
        style={[tw`self-stretch mt-9 pl-6 pr-4`, isWide && tw`mx-auto w-full max-w-2xl`]}
        title={t('home.calendar.label')}>
        {calendarEventsError && !isSilentError(calendarEventsError) && !isFetchingCalendarEvents ? (
          <ErrorBadge
            error={calendarEventsError}
            title={t('home.calendar.onFetch.fail')}
            onRetry={refetchCalendarEvents}
          />
        ) : null}

        <Link asChild href="/events">
          <AppText
            style={tw`ml-auto text-base font-normal leading-5 text-right text-amber-500 min-w-16`}>
            {t('home.calendar.browse')}
          </AppText>
        </Link>
      </SectionTitle>

      <Animated.View entering={FadeInRight.duration(750).delay(600)} style={tw`flex w-full`}>
        <ScrollView
          contentContainerStyle={tw.style(
            `flex flex-row px-4 h-56 min-w-full py-3`,
            isWide && {
              paddingLeft: (width - WIDE_SCREEN_WIDTH) / 2 + 16,
              paddingRight: (width - WIDE_SCREEN_WIDTH) / 2 + 16,
            },
          )}
          decelerationRate="fast"
          horizontal={true}
          scrollEnabled={upcomingEvents.length > 0}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToOffsets={Array.from({ length: upcomingEvents.length }).map(
            (_, i) => 320 + i * (320 + 16),
          )}
          style={tw`w-full overflow-visible`}>
          {isLoadingCalendarEvents ? (
            <Animated.View exiting={FadeOut.duration(500)}>
              <CalendarEventCard loading={isLoadingCalendarEvents} style={tw`w-80`} />
            </Animated.View>
          ) : upcomingEvents.length ? (
            upcomingEvents.map((event, index) => (
              <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                key={`calendar-event-card-${event.id}`}
                style={[index > 0 && tw`ml-4`]}>
                <Link asChild href={`/events/${event.id}`}>
                  <AppPressable style={tw`w-80`}>
                    <CalendarEventCard event={event}>
                      {dayjs().isBetween(event.start, event.end) && (
                        <Animated.View
                          entering={BounceIn.duration(1000).delay(300)}
                          exiting={BounceOut.duration(1000)}
                          style={tw`z-10 h-7 w-7 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -bottom-1.5 -right-1.5`}>
                          <View
                            style={tw`h-4 w-4 bg-emerald-600 dark:bg-emerald-700 rounded-full`}
                          />
                        </Animated.View>
                      )}
                    </CalendarEventCard>
                  </AppPressable>
                </Link>
              </Animated.View>
            ))
          ) : (
            <HomeCalendarEmptyState
              events={upcomingEvents}
              lastFetch={calendarEventsUpdatedAt}
              style={[{ width: width - 16 * 2 }, isWide && tw`mx-auto w-full max-w-2xl`]}
            />
          )}
        </ScrollView>
      </Animated.View>

      <View
        style={[
          tw`flex flex-col w-full px-4 gap-4 mt-9 mb-3`,
          isWide && tw`mx-auto w-full max-w-2xl`,
        ]}>
        <SectionTitle
          entering={FadeInUp.duration(500).delay(600)}
          style={tw`mx-2`}
          title={t('home.services.label')}
        />

        <View style={tw`flex flex-row items-stretch gap-4 min-h-40`}>
          <Animated.View
            entering={FadeInUp.duration(500).delay(700)}
            style={tw`flex flex-col grow shrink basis-0`}>
            <UnlockGateCard
              disabled={Boolean(
                authStore.user && !authStore.user.capabilities?.includes('UNLOCK_GATE'),
              )}
              style={tw`grow`}
              onSuccessiveTaps={onSuccessiveTaps}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(500).delay(800)}
            style={tw`flex flex-col grow shrink basis-0`}>
            <OpenParkingCard
              disabled={Boolean(
                authStore.user && !authStore.user.capabilities?.includes('PARKING_ACCESS'),
              )}
              style={tw`grow`}
              onSuccessiveTaps={onSuccessiveTaps}
            />
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(900)}
          style={tw`flex flex-col self-stretch`}>
          <Link
            asChild
            href={{
              pathname: '/on-premise',
              params: {
                ...(onPremiseLocation && {
                  location: onPremiseLocation,
                }),
              },
            }}>
            <OnPremiseCard
              location={onPremiseLocation && t(`onPremise.location.${onPremiseLocation}`)}
            />
          </Link>
        </Animated.View>

        {!authStore.user && !authStore.isFetchingToken && (
          <UnauthenticatedState
            entering={FadeInUp.duration(500).delay(1000)}
            exiting={FadeOutDown.duration(500).delay(1000)}
            style={tw`mt-12 mb-6 mx-4`}
          />
        )}
      </View>
    </HomeLayout>
  );
}
