import { Fader, TouchableOpacity } from '@ddx0510/react-native-ui-lib';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, Text, View, useColorScheme } from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import BalanceBottomSheet from '@/components/Home/BalanceBottomSheet';
import BalanceCard from '@/components/Home/BalanceCard';
import CalendarEmptyCard from '@/components/Home/CalendarEmptyCard';
import CalendarEventBottomSheet from '@/components/Home/CalendarEventBottomSheet';
import CalendarEventCard from '@/components/Home/CalendarEventCard';
import ControlsCard from '@/components/Home/ControlsCard';
import HomeCarousel from '@/components/Home/HomeCarousel';
import ParkingCard from '@/components/Home/ParkingCard';
import PresenceCard from '@/components/Home/PresenceCard';
import PresentsCount from '@/components/Home/PresentsCount';
import ProfilePicture from '@/components/Home/ProfilePicture';
import SubscriptionBottomSheet from '@/components/Home/SubscriptionBottomSheet';
import SubscriptionCard from '@/components/Home/SubscriptionCard';
import UnlockGateCard from '@/components/Home/UnlockGateCard';
import { isSilentError, useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';
import { getCurrentMembers, getMemberProfile } from '@/services/api/members';
import { getPresenceByDay, getPresenceByWeek } from '@/services/api/presence';
import useAuthStore from '@/stores/auth';

dayjs.extend(relativeTime);

const homeLogger = log.extend(`[${__filename.split('/').pop()}]`);

const AGE_PERIOD_IN_SECONDS = Number(process.env.EXPO_PUBLIC_REFRESH_PERIOD || 300); // 5 minutes

export default function HomeScreen({}) {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const notifyError = useErrorNotification();

  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<CalendarEvent | null>(null);

  const [hasSelectSubscription, selectSubscription] = useState<boolean>(false);
  const [hasSelectBalance, selectBalance] = useState<boolean>(false);

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
  });

  const {
    data: profile,
    isLoading: isLoadingProfile,
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

  const {
    data: calendarEvents,
    isFetching: isFetchingCalendarEvents,
    refetch: refreshCalendarEvents,
    error: calendarEventsError,
  } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
    retry: false,
  });

  const {
    data: dailyPresence,
    isFetching: isFetchingDailyPresence,
    refetch: refreshDailyPresence,
    error: dailyPresenceError,
  } = useQuery({
    queryKey: ['dailyPresence'],
    queryFn: getPresenceByWeek,
    retry: false,
  });

  const {
    data: hourlyPresence,
    isFetching: isFetchingHourlyPresence,
    refetch: refreshHourlyPresence,
    error: hourlyPresenceError,
  } = useQuery({
    queryKey: ['hourlyPresence'],
    queryFn: getPresenceByDay,
    retry: false,
  });

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
    if (calendarEventsError && !isSilentError(calendarEventsError)) {
      notifyError(t('home.calendar.onFetch.fail'), calendarEventsError);
    }
  }, [calendarEventsError]);

  useEffect(() => {
    if (dailyPresenceError && !isSilentError(dailyPresenceError)) {
      notifyError(t('presence.byWeek.onFetch.fail'), dailyPresenceError);
    }
  }, [dailyPresenceError]);

  useEffect(() => {
    if (hourlyPresenceError && !isSilentError(hourlyPresenceError)) {
      notifyError(t('presence.byDay.onFetch.fail'), hourlyPresenceError);
    }
  }, [hourlyPresenceError]);

  const onRefresh = useCallback(() => {
    if (user?.id) {
      setRefreshing(true);
      Promise.all([
        refetchProfile(),
        refetchCurrentMembers(),
        refreshCalendarEvents(),
        refreshDailyPresence(),
        refreshHourlyPresence(),
      ]).finally(() => {
        setRefreshing(false);
      });
    }
  }, [user]);

  const currentSubscription = useMemo(() => {
    return profile?.abos.find(({ current }) => current);
  }, [profile]);

  const stackCards = useMemo(
    () =>
      [
        currentSubscription && dayjs().isBefore(currentSubscription.aboEnd) && (
          <TouchableOpacity key={`subscription-card`} onPress={() => selectSubscription(true)}>
            <SubscriptionCard
              expired={dayjs(currentSubscription.aboEnd).endOf('day').toISOString()}
              since={currentSubscription.aboStart}
            />
          </TouchableOpacity>
        ),
        <TouchableOpacity key={`coupons-card`} onPress={() => selectBalance(true)}>
          <BalanceCard count={profile?.balance} loading={isLoadingProfile} />
        </TouchableOpacity>,
      ]
        .sort(() => {
          // balance should come first when it is negative
          // or when subscription is expired
          if (
            (profile?.balance && profile.balance < 0) ||
            dayjs().isAfter(currentSubscription?.aboEnd)
          ) {
            return -1;
          }
          return 1;
        })
        .filter(Boolean),
    [currentSubscription, profile, colorScheme, isLoadingProfile],
  );

  const calendarCards = useMemo(
    () =>
      (calendarEvents || [])
        .filter(
          ({ start }) => dayjs().isSame(start, 'day') || dayjs().add(1, 'day').isSame(start, 'day'),
        )
        .map((event) => (
          <Link asChild href={`/events/${event.id}`} key={`calendar-event-${event.id}-card`}>
            <TouchableOpacity>
              <CalendarEventCard event={event} />
            </TouchableOpacity>
          </Link>
        )),
    [colorScheme, calendarEvents],
  );

  return (
    <Animated.View style={[tw`flex w-full flex-col items-stretch dark:bg-black`]}>
      <View style={[tw`absolute top-0 left-0 right-0 z-10`]}>
        <Fader
          visible
          position={Fader.position.TOP}
          size={insets.top}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
      </View>

      <Animated.ScrollView
        contentContainerStyle={[
          tw`relative grow flex flex-col items-start gap-4 justify-start pt-2 px-4`,
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
        <View style={tw`flex flex-row items-center w-full`}>
          {currentMembersUpdatedAt &&
          dayjs().diff(currentMembersUpdatedAt, 'second') > AGE_PERIOD_IN_SECONDS ? (
            <Animated.Text
              entering={FadeInUp.duration(300)}
              exiting={FadeOutUp.duration(300)}
              style={tw`ml-3 text-sm text-slate-500 dark:text-slate-400 shrink grow`}>
              {capitalize(dayjs(currentMembersUpdatedAt).fromNow())}
            </Animated.Text>
          ) : null}
          <Link asChild href="/settings">
            <TouchableOpacity style={tw`ml-auto`}>
              <ProfilePicture />
            </TouchableOpacity>
          </Link>
        </View>

        <Animated.View entering={FadeInLeft.duration(750).delay(150)} style={tw`mb-4 ml-3`}>
          <PresentsCount
            count={currentMembers?.length || 0}
            loading={isLoadingCurrentMembers}
            total={28}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInRight.duration(750).delay(300)}
          style={tw`flex flex-row flex-wrap w-full items-center gap-4 h-24`}>
          <Link asChild href="/presence/by-week">
            <TouchableOpacity style={tw`grow basis-0`}>
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
        </Animated.View>

        <Animated.View
          entering={FadeInLeft.duration(750).delay(400)}
          style={tw`flex flex-row items-start w-full justify-between`}>
          <Text style={tw`text-base font-medium text-slate-500`}>{t('home.profile.label')}</Text>
          {/* <Link href="https://www.coworking-metz.fr/la-boutique/">
            <Text style={tw`text-base text-amber-500`}>{t('home.profile.store')}</Text>
          </Link> */}
        </Animated.View>
        <HomeCarousel
          elements={stackCards}
          entering={FadeInLeft.duration(750).delay(400)}
          style={[tw`flex flex-col w-full overflow-visible h-24`]}
        />

        <Animated.View
          entering={FadeInRight.duration(750).delay(600)}
          style={tw`flex flex-row justify-between w-full`}>
          <Text style={tw`text-base font-medium text-slate-500`}>{t('home.calendar.label')}</Text>
          <Link asChild href="/events/calendar">
            <Text style={tw`text-base text-amber-500 min-w-[16]`}>{t('home.calendar.browse')}</Text>
          </Link>
        </Animated.View>

        {calendarEvents?.length ? (
          <HomeCarousel
            elements={calendarCards}
            style={[tw`flex flex-col w-full overflow-visible h-24`]}
          />
        ) : (
          <CalendarEmptyCard
            entering={FadeInRight.duration(750).delay(600)}
            loading={isFetchingCalendarEvents}
            style={tw`w-full`}
          />
        )}

        <Animated.Text
          entering={FadeInUp.duration(500).delay(600)}
          style={tw`text-base font-medium text-slate-500`}>
          {t('home.services.label')}
        </Animated.Text>
        <Animated.View
          entering={FadeInUp.duration(500).delay(700)}
          style={tw`flex flex-col self-stretch`}>
          <UnlockGateCard />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(800)}
          style={tw`flex flex-col self-stretch`}>
          <ParkingCard />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(900)}
          style={tw`flex flex-col self-stretch`}>
          <Link asChild href="/controls">
            <TouchableOpacity>
              <ControlsCard />
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </Animated.ScrollView>

      {selectedCalendarEvent ? (
        <CalendarEventBottomSheet
          event={selectedCalendarEvent}
          onClose={() => setSelectedCalendarEvent(null)}
        />
      ) : null}

      {currentSubscription && hasSelectSubscription ? (
        <SubscriptionBottomSheet
          endDate={currentSubscription.aboEnd}
          startDate={currentSubscription.aboStart}
          onClose={() => selectSubscription(false)}
        />
      ) : null}

      {hasSelectBalance ? (
        <BalanceBottomSheet balance={profile?.balance || 0} onClose={() => selectBalance(false)} />
      ) : null}
    </Animated.View>
  );
}
