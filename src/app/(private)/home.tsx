import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link, useNavigation } from 'expo-router';
import { isNil, capitalize } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, RefreshControl, View, useColorScheme, Text } from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader, ToastPresets, TouchableOpacity } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import CalendarEmptyCard from '@/components/Home/CalendarEmptyCard';
import CalendarEventBottomSheet from '@/components/Home/CalendarEventBottomSheet';
import CalendarEventCard from '@/components/Home/CalendarEventCard';
import ControlsCard from '@/components/Home/ControlsCard';
import CouponsBottomSheet from '@/components/Home/CouponsBottomSheet';
import CouponsCard from '@/components/Home/CouponsCard';
import HomeCarousel from '@/components/Home/HomeCarousel';
import ParkingCard from '@/components/Home/ParkingCard';
import PresenceCard from '@/components/Home/PresenceCard';
import PresentsCount from '@/components/Home/PresentsCount';
import ProfilePicture from '@/components/Home/ProfilePicture';
import SubscriptionBottomSheet from '@/components/Home/SubscriptionBottomSheet';
import SubscriptionCard from '@/components/Home/SubscriptionCard';
import UnlockDeckDoorBottomSheet from '@/components/Home/UnlockDeckDoorBottomSheet';
import UnlockDeckDoorCard from '@/components/Home/UnlockDeckDoorCard';
import UnlockGateCard from '@/components/Home/UnlockGateCard';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { type CalendarEvent } from '@/services/api/calendar';
import { getPresenceNow, type ApiCurrentPresence } from '@/services/api/presence';
import useAuthStore from '@/stores/auth';
import useCalendarStore from '@/stores/calendar';
import useNoticeStore from '@/stores/notice';
import usePresenceStore from '@/stores/presence';
import useToastStore from '@/stores/toast';
import useUserStore from '@/stores/user';

dayjs.extend(relativeTime);

const homeLogger = log.extend(`[${__filename.split('/').pop()}]`);

const AGE_PERIOD_IN_SECONDS = Number(process.env.EXPO_PUBLIC_REFRESH_PERIOD || 300); // 5 minutes

export default function HomeScreen({}) {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { profile, isFetchingProfile, fetchProfile } = useUserStore();
  const presenceStore = usePresenceStore();
  const calendarStore = useCalendarStore();
  const noticeStore = useNoticeStore();
  const toastStore = useToastStore();
  const navigation = useNavigation();
  const [isReady, setReady] = useState(false);
  const [isFetchingCurrentPresence, setCurrentPresenceFetching] = useState(true);
  const [currentPresence, setCurrentPresence] = useState<ApiCurrentPresence | null>(null);

  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<CalendarEvent | null>(null);

  const [hasSelectSubscription, selectSubscription] = useState<boolean>(false);
  const [hasSelectBalance, selectBalance] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState(false);
  const [lastFetch, setLastFetch] = useState<string | null>(null);
  const [isAged, setAged] = useState<boolean>(false);

  const stackCards = useMemo(
    () =>
      [
        profile?.subscription && (
          <TouchableOpacity key={`subscription-card`} onPress={() => selectSubscription(true)}>
            <SubscriptionCard
              expired={dayjs(profile.subscription.endDate).endOf('day').toISOString()}
              since={profile.subscription.startDate}
            />
          </TouchableOpacity>
        ),
        <TouchableOpacity key={`coupons-card`} onPress={() => selectBalance(true)}>
          <CouponsCard count={profile?.balance} loading={isFetchingProfile && !isReady} />
        </TouchableOpacity>,
      ].filter(Boolean),
    [profile, colorScheme, isReady, isFetchingProfile],
  );

  const calendarCards = useMemo(
    () =>
      calendarStore.events
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
    [colorScheme, isReady, calendarStore],
  );

  const fetchCurrentPresence = useCallback(() => {
    setCurrentPresenceFetching(true);
    return getPresenceNow()
      .then(setCurrentPresence)
      .catch(handleSilentError)
      .catch(async (error) => {
        const errorMessage = await parseErrorText(error);
        const toast = toastStore.add({
          message: t('home.people.onFetchFail.message'),
          type: ToastPresets.FAILURE,
          action: {
            label: t('actions.more'),
            onPress: () => {
              noticeStore.add({
                message: t('home.people.onFetchFail.message'),
                description: errorMessage,
                type: 'error',
              });
              toastStore.dismiss(toast.id);
            },
          },
        });
        return Promise.reject(error);
      })
      .finally(() => setCurrentPresenceFetching(false));
  }, []);

  const fetchCalendarEvents = useCallback(() => {
    return calendarStore
      .fetchEvents()
      .catch(handleSilentError)
      .catch(async (error) => {
        const errorMessage = await parseErrorText(error);
        const toast = toastStore.add({
          message: t('home.calendar.onFetchFail.message'),
          type: ToastPresets.FAILURE,
          action: {
            label: t('actions.more'),
            onPress: () => {
              noticeStore.add({
                message: t('home.calendar.onFetchFail.message'),
                description: errorMessage,
                type: 'error',
              });
              toastStore.dismiss(toast.id);
            },
          },
        });
        return Promise.reject(error);
      });
  }, []);

  const fetchEverything = useCallback(() => {
    return Promise.all([
      fetchProfile(),
      fetchCurrentPresence(),
      presenceStore.fetchWeekPresence(),
      presenceStore.fetchDayPresence(),
      fetchCalendarEvents(),
    ])
      .then(() => {
        setLastFetch(new Date().toISOString());
        setAged(false);
      })
      .catch(handleSilentError);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEverything().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (!!accessToken) {
      setReady(false);
      fetchEverything().finally(() => {
        setReady(true);
      });
    }
  }, [accessToken]);

  useEffect(() => {
    const handleChange = AppState.addEventListener('change', (changedState) => {
      if (changedState === 'active') {
        homeLogger.debug('App has come to the foreground!');
        if (dayjs().subtract(AGE_PERIOD_IN_SECONDS, 'seconds').isAfter(lastFetch)) {
          setAged(true);
        }
      }
    });

    return () => {
      handleChange.remove();
    };
  }, [lastFetch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      homeLogger.debug('Screen is focused');
      if (dayjs().subtract(AGE_PERIOD_IN_SECONDS, 'seconds').isAfter(lastFetch)) {
        setAged(true);
      }
    });

    return unsubscribe;
  }, [navigation, lastFetch]);

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
          {isAged && lastFetch ? (
            <Animated.Text
              entering={FadeInUp.duration(300)}
              exiting={FadeOutUp.duration(300)}
              style={tw`ml-3 text-sm text-slate-500 dark:text-slate-400 shrink grow`}>
              {capitalize(dayjs(lastFetch).fromNow())}
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
            count={currentPresence?.count}
            loading={isFetchingCurrentPresence && !isReady}
            total={currentPresence?.total}
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
                history={presenceStore.weekPresence?.current.timeline.map(({ date, value }) => ({
                  date: new Date(date),
                  value,
                }))}
                loading={presenceStore.isFetchingWeekPresence && !isReady}
                sharedTransitionTag="week-presence-card"
                type="day"
              />
            </TouchableOpacity>
          </Link>
          <Link asChild href="/presence/by-day">
            <TouchableOpacity style={tw`grow basis-0`}>
              <PresenceCard
                disabled
                color="amber"
                history={presenceStore.dayPresence?.current.timeline.map(({ date, value }) => ({
                  date: new Date(date),
                  value,
                }))}
                loading={presenceStore.isFetchingDayPresence && !isReady}
                sharedTransitionTag="week-presence-card"
                type="hour"
              />
            </TouchableOpacity>
          </Link>
        </Animated.View>

        <Animated.View
          entering={FadeInLeft.duration(750).delay(400)}
          style={tw`flex flex-row items-start w-full justify-between`}>
          <Text style={tw`text-base font-medium text-slate-500`}>{t('home.tickets.label')}</Text>
          {/* <Link href="https://www.coworking-metz.fr/la-boutique/">
            <Text style={tw`text-base text-amber-500`}>{t('home.tickets.store')}</Text>
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

        {calendarStore.events.length ? (
          <HomeCarousel
            elements={calendarCards}
            style={[tw`flex flex-col w-full overflow-visible h-24`]}
          />
        ) : (
          <CalendarEmptyCard
            entering={FadeInRight.duration(750).delay(600)}
            loading={calendarStore.isFetchingEvents && !isReady}
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

      {profile?.subscription && hasSelectSubscription ? (
        <SubscriptionBottomSheet
          subscription={profile.subscription}
          onClose={() => selectSubscription(false)}
        />
      ) : null}

      {!isNil(profile) && hasSelectBalance ? (
        <CouponsBottomSheet balance={profile.balance} onClose={() => selectBalance(false)} />
      ) : null}
    </Animated.View>
  );
}
