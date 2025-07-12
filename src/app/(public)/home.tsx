import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { NetworkStateType, useNetworkState } from 'expo-network';
import { Link } from 'expo-router';
import { includes, sample } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  StretchInY,
} from 'react-native-reanimated';
import { toast } from 'sonner-native';
import tw, { useDeviceContext } from 'twrnc';
import AppText from '@/components/AppText';
import AppTouchable from '@/components/AppTouchable';
import ErrorBadge from '@/components/ErrorBagde';
import AppointmentCard from '@/components/Home/AppointmentCard';
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
import OpenParkingCard from '@/components/Home/OpenParkingCard';
import ProfilePicture from '@/components/Home/ProfilePicture';
import StaleDataText, { STALE_PERIOD_IN_SECONDS } from '@/components/Home/StaleDataText';
import SubscriptionBottomSheet from '@/components/Home/SubscriptionBottomSheet';
import SubscriptionCard from '@/components/Home/SubscriptionCard';
import UnauthenticatedState from '@/components/Home/UnauthenticatedState';
import UnlockGateCard from '@/components/Home/UnlockGateCard';
import SectionTitle from '@/components/Layout/SectionTitle';
import { useAppContact } from '@/context/contact';
import useAppState from '@/helpers/app-state';
import { isSilentError } from '@/helpers/error';
import useAppScreen from '@/helpers/screen';
import { getCalendarEvents } from '@/services/api/calendar';
import {
  getCurrentMembers,
  getMemberDevices,
  getMemberProfile,
  getMemberSubscriptions,
  isMemberBalanceInsufficient,
} from '@/services/api/members';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const MAX_WIDTH = 672; // tw`max-w-2xl`

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

  const [hasSelectSubscription, selectSubscription] = useState<boolean>(false);
  const [hasSelectBalance, selectBalance] = useState<boolean>(false);
  const [hasSelectMembership, selectMembership] = useState<boolean>(false);
  const [hasSelectBirthday, selectBirthday] = useState<boolean>(false);

  const contact = useAppContact();

  const {
    data: currentMembers,
    isLoading: isLoadingCurrentMembers,
    isFetching: isFetchingCurrentMembers,
    refetch: refetchCurrentMembers,
    error: currentMembersError,
    dataUpdatedAt: currentMembersUpdatedAt,
    errorUpdatedAt: currentMembersErrorUpdatedAt,
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
    data: devices,
    isPending: isPendingDevices,
    isFetching: isFetchingDevices,
    refetch: refetchDevices,
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'devices'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberDevices(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    retry: false,
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
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'subscriptions'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberSubscriptions(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
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
    dataUpdatedAt: calendarEventsUpdatedAt,
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

  const onRefresh = useCallback(() => {
    return Promise.all([
      authStore.user?.id && refetchProfile(),
      authStore.user?.id && refetchSubscriptions(),
      authStore.user?.id && refetchDevices(),
      refetchCurrentMembers(),
      refreshCalendarEvents(),
    ]);
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
      isFetchingProfile ||
      isFetchingSubscriptions ||
      isFetchingCalendarEvents ||
      isFetchingCurrentMembers ||
      isFetchingDevices
    );
  }, [
    isFetchingProfile,
    isFetchingSubscriptions,
    isFetchingCalendarEvents,
    isFetchingCurrentMembers,
    isFetchingDevices,
  ]);

  useEffect(() => {
    if (
      isFocus &&
      networkState.isConnected &&
      networkState.isInternetReachable &&
      includes([NetworkStateType.ETHERNET, NetworkStateType.WIFI], networkState.type)
    ) {
      const lastFetch = currentMembersUpdatedAt ?? currentMembersErrorUpdatedAt;
      if (lastFetch && dayjs().diff(lastFetch, 'second') > STALE_PERIOD_IN_SECONDS) {
        onRefresh();
      }
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
          {hasSelectBirthday ? <BirthdayBottomSheet onClose={() => selectBirthday(false)} /> : null}

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
        </>
      }
      onRefresh={() => {
        useSettingsStore.setState({ hasLearnPullToRefresh: true });
        return onRefresh();
      }}>
      <View
        style={[
          tw`flex flex-row items-center w-full px-4 pt-1`,
          isWide && tw`mx-auto w-full max-w-2xl`,
        ]}>
        <StaleDataText
          activeSince={activeSince}
          lastFetch={currentMembersUpdatedAt ?? currentMembersErrorUpdatedAt}
          loading={isFetching}
        />

        <View style={tw`flex flex-col items-end shrink grow basis-0`}>
          <Link asChild href="(settings)">
            <AppTouchable>
              <ProfilePicture
                attending={profile?.attending}
                loading={isFetching}
                name={authStore.user?.name}
                pending={!authStore.user && authStore.isFetchingToken}
                style={tw`h-12 w-12`}
                url={authStore.user?.picture}
              />
            </AppTouchable>
          </Link>
        </View>
      </View>

      <Animated.View
        entering={FadeInLeft.duration(750)}
        style={[
          tw`flex flex-col self-stretch gap-2 ml-6 mr-4 mb-6`,
          isWide && tw`mx-auto w-full max-w-2xl`,
        ]}>
        <AttendanceCount
          error={
            currentMembersError && !isSilentError(currentMembersError) ? currentMembersError : null
          }
          lastFetch={currentMembersUpdatedAt}
          loading={isLoadingCurrentMembers}
          members={currentMembers}
          style={tw`mt-4`}
          total={40}
        />
      </Animated.View>

      {authStore.user?.onboarding && (
        <Animated.View
          entering={StretchInY.delay(750)}
          style={[tw`flex self-stretch mx-4`, isWide && tw`mx-auto w-full max-w-2xl`]}>
          <AppointmentCard date={authStore.user.onboarding.date} style={tw`w-full`} />
        </Animated.View>
      )}

      <Animated.View entering={FadeInLeft.duration(750).delay(400)} style={tw`flex self-stretch`}>
        <SectionTitle
          style={[tw`w-full mt-6 px-6`, isWide && tw`mx-auto max-w-2xl`]}
          title={t('home.profile.label')}>
          {profileError && !isSilentError(profileError) ? (
            <ErrorBadge error={profileError} title={t('home.profile.onFetch.fail')} />
          ) : null}
        </SectionTitle>

        <ScrollView
          contentContainerStyle={[
            tw`flex flex-row items-stretch gap-4 px-4 mt-4 overflow-visible`,
            isWide && {
              paddingLeft: (width - MAX_WIDTH) / 2,
              paddingRight: (width - MAX_WIDTH) / 2,
            },
          ]}
          horizontal={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={tw`w-full overflow-visible`}>
          {isTodayBirthday && (
            <AppTouchable
              style={tw`flex flex-row items-stretch`}
              onPress={() => selectBirthday(true)}>
              <BirthdayCard style={tw`h-38`} />
            </AppTouchable>
          )}
          {((devices && !devices.length) || (profile && !profile.lastSeen)) && (
            <Link asChild href="/devices">
              <AppTouchable style={tw`flex flex-row items-stretch`}>
                <DevicesCard
                  count={devices?.length}
                  entering={FadeIn.duration(500)}
                  exiting={FadeOut.duration(500)}
                  pending={isPendingDevices}
                  style={tw`h-38`}
                />
              </AppTouchable>
            </Link>
          )}
          <AppTouchable style={tw`flex flex-row items-stretch`} onPress={() => selectBalance(true)}>
            <BalanceCard
              count={profile?.balance}
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingProfile}
              style={tw`h-38`}
              valid={profile && !isMemberBalanceInsufficient(profile)}
            />
          </AppTouchable>
          <AppTouchable
            style={tw`flex flex-row items-stretch`}
            onPress={() => selectSubscription(true)}>
            <SubscriptionCard
              activeSince={activeSince}
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingSubscriptions}
              style={tw`h-38`}
              subscription={currentSubscription}
            />
          </AppTouchable>
          <AppTouchable
            style={tw`flex flex-row items-stretch`}
            onPress={() => selectMembership(true)}>
            <MembershipCard
              active={profile?.activeUser}
              lastMembershipYear={profile?.lastMembership}
              loading={(!authStore.user && authStore.isFetchingToken) || isLoadingProfile}
              style={tw`h-38`}
              valid={profile?.membershipOk}
            />
          </AppTouchable>
        </ScrollView>
      </Animated.View>

      <SectionTitle
        count={nextCalendarEvents.length > 2 ? nextCalendarEvents.length : null}
        entering={FadeInRight.duration(750).delay(600)}
        style={[tw`w-full mt-6 px-6`, isWide && tw`mx-auto max-w-2xl`]}
        title={t('home.calendar.label')}>
        {calendarEventsError && !isSilentError(calendarEventsError) ? (
          <ErrorBadge error={calendarEventsError} title={t('home.calendar.onFetch.fail')} />
        ) : null}

        <Link asChild href="/events">
          <AppText
            style={tw`ml-auto text-base font-normal leading-5 text-right text-amber-500 min-w-5`}>
            {t('home.calendar.browse')}
          </AppText>
        </Link>
      </SectionTitle>

      <Animated.View entering={FadeInRight.duration(750).delay(600)} style={tw`flex w-full`}>
        <ScrollView
          contentContainerStyle={[
            tw`flex flex-row gap-4 px-4 h-56 min-w-full py-3`,
            isWide && {
              paddingLeft: (width - MAX_WIDTH) / 2,
              paddingRight: (width - MAX_WIDTH) / 2,
            },
          ]}
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
                  <AppTouchable style={tw`w-80`}>
                    <CalendarEventCard event={event} />
                  </AppTouchable>
                </Link>
              </Animated.View>
            ))
          ) : (
            <HomeCalendarEmptyState
              events={nextCalendarEvents}
              lastFetch={calendarEventsUpdatedAt}
              style={tw`w-full h-full mt-4`}
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
              ...(onPremiseLocation && {
                params: {
                  location: onPremiseLocation,
                },
              }),
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
