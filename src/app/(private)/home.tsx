import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link, useNavigation } from 'expo-router';
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppState,
  RefreshControl,
  View,
  useColorScheme,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOutUp,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader, ToastPresets, TouchableOpacity } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AmourFoodBottomSheet from '@/components/Home/AmourFoodBottomSheet';
import AmoorFoodCard from '@/components/Home/AmourFoodCard';
import CouponsBottomSheet from '@/components/Home/CouponsBottomSheet';
import CouponsCard from '@/components/Home/CouponsCard';
import ParkingCard from '@/components/Home/ParkingCard';
import PresenceCard from '@/components/Home/PresenceCard';
import PresentsCount from '@/components/Home/PresentsCount';
import ProfilePicture from '@/components/Home/ProfilePicture';
import SubscriptionBottomSheet from '@/components/Home/SubscriptionBottomSheet';
import SubscriptionCard from '@/components/Home/SubscriptionCard';
import UnlockCard from '@/components/Home/UnlockCard';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { getMenu, type AmourFoodMenu } from '@/services/api/amourFood';
import { getPresenceNow, type ApiCurrentPresence } from '@/services/api/presence';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import usePresenceStore from '@/stores/presence';
import useToastStore from '@/stores/toast';
import useUserStore from '@/stores/user';

dayjs.extend(relativeTime);

const homeLogger = log.extend(`[${__filename.split('/').pop()}]`);

const AGE_PERIOD_IN_SECONDS = 300; // 5 minutes

export default function HomeScreen({}) {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { profile, isFetchingProfile, fetchProfile } = useUserStore();
  const presenceStore = usePresenceStore();
  const noticeStore = useNoticeStore();
  const toastStore = useToastStore();
  const navigation = useNavigation();
  const [isReady, setReady] = useState(false);
  const [isFetchingCurrentPresence, setCurrentPresenceFetching] = useState(false);
  const [currentPresence, setCurrentPresence] = useState<ApiCurrentPresence | null>(null);

  const [isFetchingMenu, setFetchingMenu] = useState(false);
  const [todayMenu, setTodayMenu] = useState<AmourFoodMenu | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<AmourFoodMenu | null>(null);

  const [hasSelectSubscription, selectSubscription] = useState<boolean>(false);
  const [hasSelectBalance, selectBalance] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState(false);
  const [lastFetch, setLastFetch] = useState<string | null>(null);
  const [isAged, setAged] = useState<boolean>(false);

  const [stackCardsWidth, setStackCardsWidth] = React.useState<number>(0);
  const stackCards = useMemo(
    () =>
      [
        profile?.subscription && (
          <TouchableOpacity key={`subscription-card`} onPress={() => selectSubscription(true)}>
            <SubscriptionCard
              expired={profile.subscription.endDate}
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
            label: t('home.people.onFetchFail.action'),
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

  const fetchMenu = useCallback(() => {
    setFetchingMenu(true);
    return getMenu()
      .then(setTodayMenu)
      .catch(handleSilentError)
      .catch(async (error) => {
        const errorMessage = await parseErrorText(error);
        const toast = toastStore.add({
          message: t('home.amourFood.onFetchFail.message'),
          type: ToastPresets.FAILURE,
          action: {
            label: t('home.amourFood.onFetchFail.action'),
            onPress: () => {
              noticeStore.add({
                message: t('home.amourFood.onFetchFail.message'),
                description: errorMessage,
                type: 'error',
              });
              toastStore.dismiss(toast.id);
            },
          },
        });
        return Promise.reject(error);
      })
      .finally(() => setFetchingMenu(false));
  }, []);

  const fetchEverything = useCallback(() => {
    return Promise.all([
      fetchProfile(),
      fetchCurrentPresence(),
      presenceStore.fetchWeekPresence(),
      presenceStore.fetchDayPresence(),
      fetchMenu(),
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
          tw`relative grow flex flex-col items-start gap-4 justify-start pt-2 pb-4 px-4`,
          { paddingTop: insets.top },
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
        style={[tw`h-full w-full`]}>
        <View style={tw`flex flex-row items-center w-full`}>
          {isAged && lastFetch ? (
            <Animated.Text
              entering={FadeInUp.duration(300)}
              exiting={FadeOutUp.duration(300)}
              style={tw`ml-3 text-sm text-slate-500 dark:text-slate-400 shrink grow`}>
              {t('home.onAged.message', {
                since: dayjs(lastFetch).fromNow(),
              })}
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
          entering={FadeInRight.duration(750).delay(400)}
          style={[tw`flex flex-col w-full overflow-visible h-24`]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) =>
            setStackCardsWidth(nativeEvent.layout.width)
          }>
          {stackCardsWidth && stackCards.length ? (
            <Carousel
              snapEnabled
              data={stackCards}
              height={92}
              loop={false}
              renderItem={({ item, index }) => (
                <View key={index} style={index > 0 && tw`ml-4`}>
                  {item}
                </View>
              )}
              style={[tw`flex flex-row w-full overflow-visible`]}
              width={stackCards.length > 1 ? stackCardsWidth - 16 : stackCardsWidth}
            />
          ) : (
            <></>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInLeft.duration(750).delay(600)}
          style={tw`flex flex-col self-stretch`}>
          <TouchableOpacity style={tw`grow basis-0`} onPress={() => setSelectedMenu(todayMenu)}>
            <AmoorFoodCard loading={isFetchingMenu && !isReady} menu={todayMenu} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(700)}
          style={tw`flex flex-col self-stretch`}>
          <UnlockCard />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(800)}
          style={tw`flex flex-col self-stretch`}>
          <ParkingCard />
        </Animated.View>
      </Animated.ScrollView>

      {selectedMenu ? (
        <AmourFoodBottomSheet menu={selectedMenu} onClose={() => setSelectedMenu(null)} />
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
