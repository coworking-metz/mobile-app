import { Fader, TouchableOpacity } from '@ddx0510/react-native-ui-lib';
import TouchableScale from '@jonny/touchable-scale';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppState,
  type AppStateStatus,
  RefreshControl,
  Text,
  View,
  useColorScheme,
  ScrollView,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import AppTouchableScale from '@/components/AppTouchableScale';
import AmourFoodEventCard from '@/components/Home/AmourFoodEventCard';
import BalanceBottomSheet from '@/components/Home/BalanceBottomSheet';
import BalanceCard from '@/components/Home/BalanceCard';
import CalendarEmptyCard from '@/components/Home/CalendarEmptyCard';
import CalendarEventCard from '@/components/Home/CalendarEventCard';
import ControlsCard from '@/components/Home/ControlsCard';
import HomeCarousel from '@/components/Home/HomeCarousel';
import MembershipBottomSheet from '@/components/Home/MembershipBottomSheet';
import MembershipCard from '@/components/Home/MembershipCard';
import OpenParkingCard from '@/components/Home/OpenParkingCard';
import PresenceCard from '@/components/Home/PresenceCard';
import PresentsCount from '@/components/Home/PresentsCount';
import ProfilePicture from '@/components/Home/ProfilePicture';
import SubscriptionBottomSheet from '@/components/Home/SubscriptionBottomSheet';
import SubscriptionCard from '@/components/Home/SubscriptionCard';
import UnlockGateCard from '@/components/Home/UnlockGateCard';
import { isSilentError, useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { getAmourFoodEvents } from '@/services/api/amour-food';
import { getCalendarEvents } from '@/services/api/calendar';
import { getCurrentMembers, getMemberProfile } from '@/services/api/members';
import { getPresenceByDay, getPresenceByWeek } from '@/services/api/presence';
import useAuthStore from '@/stores/auth';

const homeLogger = log.extend(`[${__filename.split('/').pop()}]`);

const AGE_PERIOD_IN_SECONDS = 300; // 5 minutes

export default function HomeScreen({}) {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const notifyError = useErrorNotification();

  const [hasSelectSubscription, selectSubscription] = useState<boolean>(false);
  const [hasSelectBalance, selectBalance] = useState<boolean>(false);
  const [hasSelectMembership, selectMembership] = useState<boolean>(false);

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
    enabled: !!user,
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
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  const {
    data: amourFoodEvents,
    isFetching: isFetchingAmourFoodEvents,
    refetch: refreshAmourFoodEvents,
    error: amourFoodEventsError,
  } = useQuery({
    queryKey: ['amourFoodEvents'],
    queryFn: getAmourFoodEvents,
    retry: false,
    enabled: !!user,
  });

  // const {
  //   data: dailyPresence,
  //   isFetching: isFetchingDailyPresence,
  //   refetch: refreshDailyPresence,
  //   error: dailyPresenceError,
  // } = useQuery({
  //   queryKey: ['dailyPresence'],
  //   queryFn: getPresenceByWeek,
  //   retry: false,
  //   enabled: !!user,
  // });

  // const {
  //   data: hourlyPresence,
  //   isFetching: isFetchingHourlyPresence,
  //   refetch: refreshHourlyPresence,
  //   error: hourlyPresenceError,
  // } = useQuery({
  //   queryKey: ['hourlyPresence'],
  //   queryFn: getPresenceByDay,
  //   retry: false,
  //   enabled: !!user,
  // });

  useEffect(() => {
    if (profileError && !isSilentError(profileError)) {
      notifyError(t('home.profile.onFetch.fail'), profileError);
    }
  }, [profileError]);

  useEffect(() => {
    if (currentMembersError && !isSilentError(currentMembersError)) {
      notifyError(t('home.people.onFetch.fail'), currentMembersError);
    }
  }, [currentMembersError]);

  useEffect(() => {
    if (amourFoodEventsError && !isSilentError(amourFoodEventsError)) {
      notifyError(t('home.calendar.onFetch.fail'), amourFoodEventsError);
    }
  }, [amourFoodEventsError]);

  // useEffect(() => {
  //   if (dailyPresenceError && !isSilentError(dailyPresenceError)) {
  //     notifyError(t('presence.byWeek.onFetch.fail'), dailyPresenceError);
  //   }
  // }, [dailyPresenceError]);

  // useEffect(() => {
  //   if (hourlyPresenceError && !isSilentError(hourlyPresenceError)) {
  //     notifyError(t('presence.byDay.onFetch.fail'), hourlyPresenceError);
  //   }
  // }, [hourlyPresenceError]);

  const onRefresh = useCallback(() => {
    if (user?.id) {
      setRefreshing(true);
      Promise.all([
        refetchProfile(),
        refetchCurrentMembers(),
        refreshAmourFoodEvents(),
        // refreshDailyPresence(),
        // refreshHourlyPresence(),
      ]).finally(() => {
        setRefreshing(false);
      });
    }
  }, [user]);

  const currentSubscription = useMemo(() => {
    // retrieve ongoing subscription or the most recent one
    return profile?.abos.find(({ current }) => current) ?? profile?.abos.find(() => true) ?? null;
  }, [profile]);

  return (
    <Animated.View style={[tw`flex w-full flex-col items-stretch dark:bg-black`]}>
      <View style={[tw`absolute top-0 left-0 right-0 z-10`]}>
        <Fader
          visible
          position={Fader.position.TOP}
          size={insets.top || (Platform.OS === 'android' ? 16 : 0)}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
      </View>

      <Animated.ScrollView
        contentContainerStyle={[
          tw`relative grow flex flex-col items-start justify-start pt-2`,
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
          {currentMembersUpdatedAt &&
          dayjs().diff(currentMembersUpdatedAt, 'second') > AGE_PERIOD_IN_SECONDS ? (
            <Animated.Text
              entering={FadeInUp.duration(300)}
              exiting={FadeOutUp.duration(300)}
              style={tw`ml-3 text-sm text-slate-500 dark:text-slate-400 shrink grow`}>
              {capitalize(dayjs(currentMembersUpdatedAt).fromNow())}
            </Animated.Text>
          ) : null}
          <View style={tw`ml-auto`}>
            <Link asChild href="/settings">
              <AppTouchableScale>
                <ProfilePicture />
              </AppTouchableScale>
            </Link>
          </View>
        </View>

        <Animated.View
          entering={FadeInLeft.duration(750).delay(150)}
          style={tw`mt-4 ml-6 mr-4 self-stretch`}>
          <PresentsCount
            count={currentMembers?.length || 0}
            loading={isLoadingCurrentMembers}
            total={28}
          />
        </Animated.View>

        {/* <Animated.View
          entering={FadeInRight.duration(750).delay(300)}
          style={tw`flex flex-row flex-wrap w-full items-center gap-4 h-24 px-4 mt-2`}>
          <Link asChild href="/presence/by-week">
            <TouchableOpacity style={tw`grow basis-0 max-w-1/2`}>
              <PresenceCard
                disabled
                color="blue"
                history={dailyPresence?.current.timeline.map(({ date, value }) => ({
                  date: new Date(date),
                  value,
                }))}
                loading={!dailyPresence && isFetchingDailyPresence}
                type="day"
              />
            </TouchableOpacity>
          </Link>
          <Link asChild href="/presence/by-day">
            <TouchableOpacity style={tw`grow basis-0`}>
              <PresenceCard
                disabled
                color="amber"
                history={hourlyPresence?.current.timeline.map(({ date, value }) => ({
                  date: new Date(date),
                  value,
                }))}
                loading={!hourlyPresence && isFetchingHourlyPresence}
                type="hour"
              />
            </TouchableOpacity>
          </Link>
        </Animated.View> */}

        <Animated.View
          entering={FadeInLeft.duration(750).delay(400)}
          style={tw`flex flex-row mt-8 mb-3 px-4`}>
          <Text style={tw`text-sm font-normal uppercase text-slate-500 grow`}>
            {t('home.profile.label')}
          </Text>
        </Animated.View>
        <ScrollView
          contentContainerStyle={tw`flex flex-row items-stretch gap-4 px-4`}
          horizontal={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={tw`w-full`}>
          <AppTouchableScale key={`balance-card`} onPress={() => selectBalance(true)}>
            <BalanceCard count={profile?.balance} loading={isLoadingProfile} style={tw`h-38`} />
          </AppTouchableScale>
          <AppTouchableScale key={`subscription-card`} onPress={() => selectSubscription(true)}>
            <SubscriptionCard
              loading={isLoadingProfile}
              style={tw`h-38`}
              subscription={currentSubscription}
            />
          </AppTouchableScale>
          <TouchableScale key={`membership-card`} onPress={() => selectMembership(true)}>
            <MembershipCard
              lastMembershipYear={profile?.lastMembership}
              loading={isLoadingProfile}
              style={tw`h-38`}
              valid={profile?.membershipOk}
            />
          </TouchableScale>
        </ScrollView>

        <Animated.View
          entering={FadeInRight.duration(750).delay(600)}
          style={tw`flex flex-row justify-between w-full mt-8 mb-3 px-4`}>
          <Text style={tw`text-sm font-normal uppercase text-slate-500`}>
            {t('home.calendar.label')}
          </Text>
          <Link asChild href="/events/calendar">
            <Text style={tw`text-base font-normal text-amber-500 min-w-[16]`}>
              {t('home.calendar.browse')}
            </Text>
          </Link>
        </Animated.View>

        <ScrollView
          contentContainerStyle={tw`flex flex-row gap-4 px-4`}
          horizontal={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={tw`w-full`}>
          {amourFoodEvents
            ?.filter(({ time }) =>
              dayjs(time).isBetween(
                dayjs().subtract(1, 'day').startOf('day'),
                dayjs().add(2, 'day').endOf('day'),
                'day',
              ),
            )
            .sort((a, b) => dayjs(a.time).diff(dayjs(b.time)))
            .map((event) => (
              <Link
                asChild
                href={`/events/amour-food/${event.time}`}
                key={`amour-food-event-card-${event.time}`}>
                <AppTouchableScale style={tw`w-80`}>
                  <AmourFoodEventCard event={event} />
                </AppTouchableScale>
              </Link>
            ))}
        </ScrollView>

        {/* {calendarEvents?.length ? (
          <HomeCarousel
            elements={calendarCards}
            style={[tw`flex flex-col w-full overflow-visible h-56`]}
          />
        ) : (
          <CalendarEmptyCard
            entering={FadeInRight.duration(750).delay(600)}
            loading={isFetchingCalendarEvents}
            style={tw`w-full`}
          />
        )} */}

        <View style={tw`flex flex-col w-full px-4 gap-4 mt-8 mb-3`}>
          <Animated.Text
            entering={FadeInUp.duration(500).delay(600)}
            style={tw`text-sm font-normal uppercase text-slate-500`}>
            {t('home.services.label')}
          </Animated.Text>

          {user?.capabilities.includes('UNLOCK_GATE') && (
            <Animated.View entering={FadeInUp.duration(500).delay(700)}>
              <UnlockGateCard />
            </Animated.View>
          )}

          {user?.capabilities.includes('PARKING_ACCESS') && (
            <Animated.View entering={FadeInUp.duration(500).delay(800)}>
              <OpenParkingCard />
            </Animated.View>
          )}

          {/* <Animated.View
          entering={FadeInUp.duration(500).delay(900)}
          style={tw`flex flex-col self-stretch`}>
          <Link asChild href="/controls">
            <TouchableScale>
              <ControlsCard />
            </TouchableScale>
          </Link>
        </Animated.View> */}
        </View>
      </Animated.ScrollView>

      {hasSelectSubscription ? (
        <SubscriptionBottomSheet
          loading={isFetchingProfile}
          subscription={currentSubscription}
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

      {hasSelectMembership && profile ? (
        <MembershipBottomSheet
          lastMembershipYear={profile.lastMembership}
          loading={isFetchingProfile}
          valid={profile.membershipOk}
          onClose={() => selectMembership(false)}
        />
      ) : null}
    </Animated.View>
  );
}
