import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppState,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
  type AppStateStatus,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader, ToastPresets } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppTouchableScale from '@/components/AppTouchableScale';
import ErrorChip from '@/components/ErrorChip';
import { type PeriodType } from '@/components/Events/PeriodBottomSheet';
import BalanceBottomSheet from '@/components/Home/BalanceBottomSheet';
import BalanceCard from '@/components/Home/BalanceCard';
import CalendarEmptyState from '@/components/Home/CalendarEmptyState';
import CalendarEventCard from '@/components/Home/CalendarEventCard';
import MembershipBottomSheet from '@/components/Home/MembershipBottomSheet';
import MembershipCard from '@/components/Home/MembershipCard';
import OccupancyCount from '@/components/Home/OccupancyCount';
import OnPremiseCard from '@/components/Home/OnPremiseCard';
import OpenParkingCard from '@/components/Home/OpenParkingCard';
import ProfilePicture from '@/components/Home/ProfilePicture';
import StaleDataText from '@/components/Home/StaleDataText';
import SubscriptionBottomSheet from '@/components/Home/SubscriptionBottomSheet';
import SubscriptionCard from '@/components/Home/SubscriptionCard';
import UnlockGateCard from '@/components/Home/UnlockGateCard';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';
import { isSilentError } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { getCalendarEvents } from '@/services/api/calendar';
import { getCurrentMembers, getMemberProfile } from '@/services/api/members';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const homeLogger = log.extend(`[home.tsx]`);

export default function HomeScreen({}) {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const settingsStore = useSettingsStore();
  const insets = useSafeAreaInsets();
  const toastStore = useToastStore();

  const [hasSelectSubscription, selectSubscription] = useState<boolean>(false);
  const [hasSelectBalance, selectBalance] = useState<boolean>(false);
  const [hasSelectMembership, selectMembership] = useState<boolean>(false);

  const [shouldRenderContactBottomSheet, setRenderContactBottomSheet] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: currentMembers,
    isLoading: isLoadingCurrentMembers,
    refetch: refetchCurrentMembers,
    error: currentMembersError,
    dataUpdatedAt: currentMembersUpdatedAt,
  } = useQuery({
    queryKey: ['currentMembers'],
    queryFn: getCurrentMembers,
    retry: false,
    enabled: !!user,
  });

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
    refetch: refetchProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId);
      }
      throw new Error('Missing user id');
    },
    retry: false,
    enabled: !!user?.id,
  });

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        homeLogger.debug('App has come to the foreground!');
        if (hasSelectBalance || hasSelectSubscription || hasSelectMembership) {
          refetchProfile();
        }
      }

      appState.current = nextAppState;
    },
    [hasSelectBalance, hasSelectSubscription, hasSelectMembership, refetchProfile],
  );

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const appChangeSubscription = AppState.addEventListener('change', handleAppStateChange);
    return () => appChangeSubscription.remove();
  }, [handleAppStateChange]);

  const currentSubscription = useMemo(() => {
    // retrieve ongoing subscription or the most recent one
    return profile?.abos.find(({ current }) => current) ?? profile?.abos.find(() => true) ?? null;
  }, [profile]);

  const {
    data: calendarEvents,
    isLoading: isLoadingCalendarEvents,
    refetch: refreshCalendarEvents,
    error: calendarEventsError,
  } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
    retry: false,
    enabled: !!user,
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
  }, [calendarEvents, appState.current]);

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
    if (user?.id) {
      setRefreshing(true);
      settingsStore.setLearnPullToRefresh(true);
      Promise.all([refetchProfile(), refetchCurrentMembers(), refreshCalendarEvents()]).finally(
        () => {
          setRefreshing(false);
        },
      );
    }
  }, [user, settingsStore]);

  const onSuccessiveTaps = useCallback(() => {
    const toast = toastStore.add({
      message: t('home.onSuccessiveTaps.message'),
      type: ToastPresets.GENERAL,
      action: {
        label: t('home.onSuccessiveTaps.action'),
        onPress: () => {
          setRenderContactBottomSheet(true);
          toastStore.dismiss(toast.id);
        },
      },
    });
  }, [toastStore, t]);

  return (
    <Animated.View style={[tw`flex w-full flex-col items-stretch bg-gray-100 dark:bg-black`]}>
      <Animated.ScrollView
        contentContainerStyle={[
          tw`relative grow flex flex-col items-start justify-start`,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 32 },
        ]}
        entering={FadeIn.duration(750)}
        horizontal={false}
        refreshControl={
          <RefreshControl
            progressViewOffset={insets.top}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
        style={[tw`h-full w-full`]}>
        <View style={tw`flex flex-row items-center w-full px-4`}>
          <StaleDataText lastFetch={currentMembersUpdatedAt} />

          <View style={tw`flex flex-col items-end shrink grow basis-0`}>
            <Link asChild href="/settings">
              <AppTouchableScale>
                <ProfilePicture />
              </AppTouchableScale>
            </Link>
          </View>
        </View>

        <Animated.View
          entering={FadeInLeft.duration(750).delay(150)}
          style={tw`flex self-stretch ml-6 mr-4`}>
          <OccupancyCount
            error={currentMembersError}
            loading={isLoadingCurrentMembers}
            members={currentMembers}
            style={tw`mt-4`}
            total={28}
          />
        </Animated.View>

        <Animated.View entering={FadeInLeft.duration(750).delay(400)} style={tw`flex self-stretch`}>
          <View style={tw`flex flex-row gap-2 min-h-6 mt-12 mb-2 px-4`}>
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
                loading={isLoadingProfile}
                style={tw`min-h-38`}
              />
            </AppTouchableScale>
            <AppTouchableScale
              style={tw`flex flex-row items-stretch`}
              onPress={() => selectSubscription(true)}>
              <SubscriptionCard
                loading={isLoadingProfile}
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
                loading={isLoadingProfile}
                style={tw`min-h-38`}
                valid={profile?.membershipOk}
              />
            </AppTouchableScale>
          </ScrollView>
        </Animated.View>

        <Animated.View
          entering={FadeInRight.duration(750).delay(600)}
          style={tw`flex flex-row justify-between w-full mt-12 mb-3 px-4`}>
          <Text style={tw`text-sm font-normal uppercase text-slate-500`}>
            {t('home.calendar.label')}
          </Text>
          {calendarEventsError && !isSilentError(calendarEventsError) ? (
            <ErrorChip error={calendarEventsError} label={t('home.calendar.onFetch.fail')} />
          ) : null}
          <Link asChild href="/events/calendar">
            <Text style={tw`text-base font-normal text-right text-amber-500 min-w-[16]`}>
              {t('home.calendar.browse')}
            </Text>
          </Link>
        </Animated.View>

        <Animated.View entering={FadeInRight.duration(750).delay(600)} style={tw`flex w-full`}>
          <ScrollView
            contentContainerStyle={tw`flex flex-row gap-4 px-4 h-56 min-w-full`}
            horizontal={true}
            scrollEnabled={nextCalendarEvents.length > 0}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={tw`w-full`}>
            {isLoadingCalendarEvents ? (
              <Animated.View exiting={FadeOut.duration(500)}>
                <CalendarEventCard loading={isLoadingCalendarEvents} style={tw`w-80`} />
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

        <View style={tw`flex flex-col w-full px-4 gap-4 mt-12 mb-3`}>
          <Animated.Text
            entering={FadeInUp.duration(500).delay(600)}
            style={tw`text-sm font-normal uppercase text-slate-500`}>
            {t('home.services.label')}
          </Animated.Text>

          {user?.capabilities.includes('UNLOCK_GATE') && (
            <Animated.View entering={FadeInUp.duration(500).delay(700)}>
              <UnlockGateCard onSuccessiveTaps={onSuccessiveTaps} />
            </Animated.View>
          )}

          {user?.capabilities.includes('PARKING_ACCESS') && (
            <Animated.View entering={FadeInUp.duration(500).delay(800)}>
              <OpenParkingCard onSuccessiveTaps={onSuccessiveTaps} />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInUp.duration(500).delay(900)}
            style={tw`flex flex-col self-stretch`}>
            <Link asChild href="/on-premise">
              <OnPremiseCard />
            </Link>
          </Animated.View>
        </View>
      </Animated.ScrollView>

      <View style={[tw`absolute top-0 left-0 right-0`]}>
        <Fader
          position={Fader.position.TOP}
          size={insets.top || (Platform.OS === 'android' ? 16 : 0)}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
      </View>

      {hasSelectSubscription ? (
        <SubscriptionBottomSheet
          loading={isFetchingProfile}
          subscriptions={profile?.abos || []}
          onClose={() => selectSubscription(false)}
        />
      ) : null}

      {hasSelectBalance ? (
        <BalanceBottomSheet
          balance={profile?.balance || 0}
          loading={isFetchingProfile}
          onClose={() => selectBalance(false)}
        />
      ) : null}

      {hasSelectMembership ? (
        <MembershipBottomSheet
          active={profile?.activeUser}
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
    </Animated.View>
  );
}
