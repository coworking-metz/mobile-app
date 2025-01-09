import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  StretchInY,
} from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import AppTouchableScale from '@/components/AppTouchableScale';
import ErrorChip from '@/components/ErrorChip';
import { type PeriodType } from '@/components/Events/PeriodBottomSheet';
import AppointmentCard from '@/components/Home/AppointmentCard';
import BalanceBottomSheet from '@/components/Home/BalanceBottomSheet';
import BalanceCard from '@/components/Home/BalanceCard';
import CalendarEmptyState from '@/components/Home/CalendarEmptyState';
import CalendarEventCard from '@/components/Home/CalendarEventCard';
import HomeLayout from '@/components/Home/HomeLayout';
import MembershipBottomSheet from '@/components/Home/MembershipBottomSheet';
import MembershipCard from '@/components/Home/MembershipCard';
import OccupancyCount from '@/components/Home/OccupancyCount';
import OnPremiseCard from '@/components/Home/OnPremiseCard';
import OpenParkingCard from '@/components/Home/OpenParkingCard';
import ProfilePicture from '@/components/Home/ProfilePicture';
import StaleDataText from '@/components/Home/StaleDataText';
import SubscriptionBottomSheet from '@/components/Home/SubscriptionBottomSheet';
import SubscriptionCard from '@/components/Home/SubscriptionCard';
import UnauthenticatedState from '@/components/Home/UnauthenticatedState';
import UnlockGateCard from '@/components/Home/UnlockGateCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';
import useAppState from '@/helpers/app-state';
import { isSilentError } from '@/helpers/error';
import { getCalendarEvents } from '@/services/api/calendar';
import {
  getCurrentMembers,
  getMemberProfile,
  getMemberSubscriptions,
} from '@/services/api/members';
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

  const [hasSelectSubscription, selectSubscription] = useState<boolean>(false);
  const [hasSelectBalance, selectBalance] = useState<boolean>(false);
  const [hasSelectMembership, selectMembership] = useState<boolean>(false);

  const [shouldRenderContactBottomSheet, setRenderContactBottomSheet] = useState<boolean>(false);

  const {
    data: currentMembers,
    isLoading: isLoadingCurrentMembers,
    isFetching: isFetchingCurrentMembers,
    refetch: refetchCurrentMembers,
    error: currentMembersError,
    dataUpdatedAt: currentMembersUpdatedAt,
  } = useQuery({
    queryKey: ['currentMembers'],
    queryFn: getCurrentMembers,
    retry: false,
  });

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
    refetch: refetchProfile,
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
    enabled: !!authStore.user?.id,
  });

  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    isFetching: isFetchingSubscriptions,
    refetch: refetchSubscriptions,
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'subscriptions'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberSubscriptions(userId);
      }
      throw new Error('Missing user id');
    },
    retry: false,
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
    refetch: refreshCalendarEvents,
    error: calendarEventsError,
  } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
    retry: false,
  });

  const nextCalendarEvents = useMemo(() => {
    const now = dayjs();
    const tomorrow = now.add(1, 'day').endOf('day');
    return (
      calendarEvents?.filter(
        ({ start, end }) =>
          dayjs(start).isBetween(now, tomorrow) || dayjs(end).isBetween(now, tomorrow),
      ) ?? []
    );
  }, [calendarEvents, activeSince]);

  const firstPeriodWithEvents: PeriodType = useMemo(() => {
    const [nextEvent] = nextCalendarEvents?.filter(({ end }) => dayjs().isBefore(end)) || [];
    if (nextEvent) {
      if (dayjs(nextEvent.start).isSame(dayjs(), 'week')) {
        return 'week';
      } else if (dayjs(nextEvent.start).isSame(dayjs(), 'month')) {
        return 'month';
      }
    }
    return null;
  }, [nextCalendarEvents]);

  const onRefresh = useCallback(() => {
    return Promise.all([
      authStore.user?.id && refetchProfile(),
      authStore.user?.id && refetchSubscriptions(),
      refetchCurrentMembers(),
      refreshCalendarEvents(),
    ]);
  }, [authStore.user, settingsStore]);

  const onSuccessiveTaps = useCallback(() => {
    const toast = toastStore.add({
      message: t('home.onSuccessiveTaps.message'),
      type: 'info',
      action: {
        label: t('home.onSuccessiveTaps.action'),
        onPress: () => {
          setRenderContactBottomSheet(true);
          toastStore.dismiss(toast.id);
        },
      },
    });
  }, [toastStore, t]);

  const isFetching = useMemo(() => {
    return (
      isFetchingProfile ||
      isFetchingSubscriptions ||
      isFetchingCalendarEvents ||
      isFetchingCurrentMembers
    );
  }, [
    isFetchingProfile,
    isFetchingSubscriptions,
    isFetchingCalendarEvents,
    isFetchingCurrentMembers,
  ]);

  return (
    <HomeLayout
      outerChildren={
        <>
          {hasSelectSubscription ? (
            <SubscriptionBottomSheet
              activeSince={activeSince}
              currentSubscription={currentSubscription}
              loading={isFetchingSubscriptions}
              subscriptions={subscriptions}
              onClose={() => selectSubscription(false)}
            />
          ) : null}

          {hasSelectBalance ? (
            <BalanceBottomSheet
              activeSince={activeSince}
              balance={profile?.balance || 0}
              loading={isFetchingProfile}
              onClose={() => selectBalance(false)}
            />
          ) : null}

          {hasSelectMembership ? (
            <MembershipBottomSheet
              active={profile?.activeUser}
              activeSince={activeSince}
              activityOverLast6Months={profile?.activity}
              lastMembershipYear={profile?.lastMembership}
              loading={isFetchingProfile}
              valid={profile?.membershipOk}
              onClose={() => selectMembership(false)}
            />
          ) : null}

          {shouldRenderContactBottomSheet ? (
            <ContactBottomSheet onClose={() => setRenderContactBottomSheet(false)} />
          ) : null}
        </>
      }
      onRefresh={() => {
        useSettingsStore.setState({ hasLearnPullToRefresh: true });
        return onRefresh();
      }}>
      <View
        style={[
          tw`flex flex-row items-center w-full px-4 pt-1`,
          Platform.OS === 'android' && tw``,
        ]}>
        <StaleDataText activeSince={activeSince} lastFetch={currentMembersUpdatedAt} />

        <View style={tw`flex flex-col items-end shrink grow basis-0`}>
          <Link asChild href="/settings">
            <AppTouchableScale
              style={tw`relative h-13 w-13 flex flex-col items-center justify-center`}>
              {isFetching && (
                <LoadingSpinner
                  entering={FadeIn.duration(300)}
                  exiting={FadeOut.duration(300)}
                  style={tw`absolute h-13 w-13`}
                />
              )}

              <ProfilePicture
                attending={profile?.attending}
                loading={!authStore.user && authStore.isFetchingToken}
                style={tw`h-12 w-12`}
                url={authStore.user?.picture}
              />
            </AppTouchableScale>
          </Link>
        </View>
      </View>

      <Animated.View
        entering={FadeInLeft.duration(750)}
        style={tw`flex self-stretch ml-6 mr-4 mb-6`}>
        <OccupancyCount
          error={currentMembersError}
          loading={isLoadingCurrentMembers}
          members={currentMembers}
          style={tw`mt-4`}
          total={40}
        />
      </Animated.View>

      {authStore.user?.onboarding && (
        <Animated.View entering={StretchInY.delay(750)} style={tw`flex self-stretch mx-4`}>
          <AppointmentCard date={authStore.user.onboarding.date} style={tw`w-full`} />
        </Animated.View>
      )}

      <Animated.View entering={FadeInLeft.duration(750).delay(400)} style={tw`flex self-stretch`}>
        <View style={tw`flex flex-row gap-2 min-h-6 mt-6 mb-2 px-4`}>
          <Text style={tw`text-sm font-normal uppercase text-slate-500`}>
            {t('home.profile.label')}
          </Text>
          {profileError && !isSilentError(profileError) ? (
            <ErrorChip error={profileError} label={t('home.profile.onFetch.fail')} />
          ) : null}
        </View>

        <ScrollView
          contentContainerStyle={tw`flex flex-row items-stretch gap-4 px-4`}
          horizontal={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={tw`w-full`}>
          <AppTouchableScale
            style={tw`flex flex-row items-stretch`}
            onPress={() => selectBalance(true)}>
            <BalanceCard
              count={profile?.balance}
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingProfile}
              style={tw`min-h-38`}
            />
          </AppTouchableScale>
          <AppTouchableScale
            style={tw`flex flex-row items-stretch`}
            onPress={() => selectSubscription(true)}>
            <SubscriptionCard
              activeSince={activeSince}
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingSubscriptions}
              style={tw`min-h-38`}
              subscription={currentSubscription}
            />
          </AppTouchableScale>
          <AppTouchableScale
            style={tw`flex flex-row items-stretch`}
            onPress={() => selectMembership(true)}>
            <MembershipCard
              active={profile?.activeUser}
              lastMembershipYear={profile?.lastMembership}
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingProfile}
              style={tw`min-h-38`}
              valid={profile?.membershipOk}
            />
          </AppTouchableScale>
        </ScrollView>
      </Animated.View>

      <Animated.View
        entering={FadeInRight.duration(750).delay(600)}
        style={tw`flex flex-row items-center w-full gap-2 mt-12 px-4`}>
        <Text style={tw`text-sm font-normal uppercase text-slate-500`}>
          {t('home.calendar.label')}
        </Text>
        {nextCalendarEvents.length > 2 && (
          <View style={tw`bg-gray-400/25 dark:bg-gray-700/50 py-1 px-2 rounded-full`}>
            <Text style={tw`text-xs text-slate-900 dark:text-gray-200 font-medium`}>
              {nextCalendarEvents.length}
            </Text>
          </View>
        )}
        {calendarEventsError && !isSilentError(calendarEventsError) ? (
          <ErrorChip error={calendarEventsError} label={t('home.calendar.onFetch.fail')} />
        ) : null}
        <Link asChild href="/events/calendar">
          <Text
            style={tw`ml-auto text-base font-normal leading-5 text-right text-amber-500 min-w-[16]`}>
            {t('home.calendar.browse')}
          </Text>
        </Link>
      </Animated.View>

      <Animated.View entering={FadeInRight.duration(750).delay(600)} style={tw`flex w-full`}>
        <ScrollView
          contentContainerStyle={tw`flex flex-row gap-4 px-4 h-56 min-w-full py-3`}
          horizontal={true}
          scrollEnabled={nextCalendarEvents.length > 0}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={tw`w-full overflow-visible`}>
          {isLoadingCalendarEvents ? (
            <Animated.View exiting={FadeOut.duration(500)}>
              <CalendarEventCard
                activeSince={activeSince}
                loading={isLoadingCalendarEvents}
                style={tw`w-80`}
              />
            </Animated.View>
          ) : nextCalendarEvents.length ? (
            nextCalendarEvents.map((event) => (
              <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                key={`calendar-event-card-${event.id}`}>
                <Link asChild href={`/events/${event.id}`}>
                  <AppTouchableScale style={tw`w-80`}>
                    <CalendarEventCard event={event} />
                  </AppTouchableScale>
                </Link>
              </Animated.View>
            ))
          ) : (
            <CalendarEmptyState
              description={t('home.calendar.empty.label')}
              style={tw`w-full h-full mt-4`}>
              <Link
                asChild
                href={[
                  '/events/calendar',
                  firstPeriodWithEvents && `period=${firstPeriodWithEvents}`,
                ]
                  .filter(Boolean)
                  .join('?')}>
                <Text style={tw`text-base font-normal text-amber-500 text-center mt-4`}>
                  {t('home.calendar.empty.action')}
                </Text>
              </Link>
            </CalendarEmptyState>
          )}
        </ScrollView>
      </Animated.View>

      <View style={tw`flex flex-col w-full px-4 gap-4 mt-9 mb-3`}>
        <Animated.Text
          entering={FadeInUp.duration(500).delay(600)}
          style={tw`text-sm font-normal uppercase text-slate-500`}>
          {t('home.services.label')}
        </Animated.Text>

        <View style={tw`flex flex-row items-stretch gap-4 min-h-40`}>
          <Animated.View
            entering={FadeInUp.duration(500).delay(700)}
            style={tw`flex flex-col grow shrink basis-0`}>
            <UnlockGateCard
              disabled={
                authStore.isFetchingToken ||
                Boolean(authStore.user && !authStore.user.capabilities?.includes('UNLOCK_GATE'))
              }
              style={tw`grow`}
              onSuccessiveTaps={onSuccessiveTaps}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(500).delay(800)}
            style={tw`flex flex-col grow shrink basis-0`}>
            <OpenParkingCard
              disabled={
                authStore.isFetchingToken ||
                Boolean(authStore.user && !authStore.user.capabilities?.includes('PARKING_ACCESS'))
              }
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
            href={`/on-premise${profile?.location ? `?location=${profile.location}` : ''}`}>
            <OnPremiseCard
              location={profile?.location && t(`onPremise.location.${profile?.location}`)}
            />
          </Link>
        </Animated.View>

        {!authStore.user && !authStore.isFetchingToken && (
          <UnauthenticatedState
            exiting={FadeOutDown.duration(500).delay(900)}
            style={tw`mt-12 mb-6 mx-4`}
          />
        )}
      </View>
    </HomeLayout>
  );
}
