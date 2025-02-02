import CalendarAnimation from '../Animations/CalendarAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import CarouselPaginationDots from '../CarouselPaginationDots';
import ErrorChip from '../ErrorChip';
import ServiceRow from '../Settings/ServiceRow';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, Text, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import tw from 'twrnc';
import { formatAmount } from '@/helpers/currency';
import { isSilentError } from '@/helpers/error';

import i18n from '@/i18n';
import { type ApiMemberSubscription } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const SubscriptionBottomSheet = ({
  subscriptions = [],
  currentSubscription, // the one that should be displayed first
  loading = false,
  activeSince,
  style,
  onClose,
}: {
  subscriptions?: ApiMemberSubscription[];
  currentSubscription?: ApiMemberSubscription;
  loading?: boolean;
  activeSince?: string;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  const user = useAuthStore((s) => s.user);
  const hasBeenActive = useRef(false);

  const { refetch: refetchSubscriptions, error: subscriptionsError } = useQuery({
    queryKey: ['members', user?.id, 'subscriptions'],
    enabled: false,
  });

  useEffect(() => {
    if (!!user?.id && hasBeenActive.current) {
      refetchSubscriptions();
    }
  }, [user, activeSince, refetchSubscriptions]);

  useEffect(() => {
    hasBeenActive.current = true;
  }, []);

  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const offset = useSharedValue(0);

  const getLabel = useCallback(
    (s: ApiMemberSubscription) => {
      const now = dayjs();
      if (now.startOf('day').isAfter(s.ended)) {
        const start = dayjs(s.started);
        const end = dayjs(s.ended);
        const startMonthDaysCount = start.endOf('month').diff(start, 'day');
        const endMonthDaysCount = end.diff(end.startOf('month'), 'day');
        if (startMonthDaysCount >= 20) {
          return t('home.profile.subscription.label.previous', {
            month: now.isSame(start, 'year') ? start.format('MMMM') : start.format('MMMM YYYY'),
          });
        } else if (endMonthDaysCount >= 20) {
          return t('home.profile.subscription.label.previous', {
            month: now.isSame(end, 'year') ? end.format('MMMM') : end.format('MMMM YYYY'),
          });
        } else {
          return t('home.profile.subscription.label.previous', {
            month: [
              `${start.format('MMMM')} - ${end.format('MMMM')}`,
              !now.isSame(end, 'year') && end.format('YYYY'),
            ]
              .filter(Boolean)
              .join(' '),
          });
        }
      }

      if (now.isBefore(s.started)) return t('home.profile.subscription.label.next');
      return t('home.profile.subscription.label.current');
    },
    [t],
  );

  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => {
      return dayjs(a.started).diff(b.started);
    });
  }, [subscriptions]);

  const defaultIndex = useMemo(() => {
    const currentSubscriptionIndex = sortedSubscriptions.findIndex(
      (s) => s._id === currentSubscription?._id,
    );
    if (currentSubscriptionIndex >= 0) return currentSubscriptionIndex;
    const lastSubscriptionIndex = sortedSubscriptions.length - 1;
    if (lastSubscriptionIndex >= 0) return lastSubscriptionIndex;
    return 0;
  }, [sortedSubscriptions, currentSubscription]);

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`mx-6`}>
        <CalendarAnimation style={tw`w-full h-40 mx-auto`} />
      </View>
      {sortedSubscriptions.length ? (
        <>
          <View
            style={tw`self-start w-full h-[28rem]`}
            onLayout={({ nativeEvent }: LayoutChangeEvent) =>
              setCarouselWidth(nativeEvent.layout.width)
            }>
            {carouselWidth ? (
              <Carousel
                snapEnabled
                data={sortedSubscriptions}
                defaultIndex={defaultIndex}
                enabled={sortedSubscriptions.length > 1}
                loop={false}
                renderItem={({ item }) => (
                  <View style={[tw`flex flex-col px-6 grow pb-3`, { width: carouselWidth }]}>
                    <Text
                      numberOfLines={2}
                      style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 my-auto`}>
                      {getLabel(item)}
                    </Text>
                    <Text
                      style={tw`text-left text-base font-normal text-slate-500 w-full mt-4 mb-2`}>
                      {t('home.profile.subscription.description')}
                    </Text>
                    <ServiceRow
                      withBottomDivider
                      label={t('home.profile.subscription.status.startedOn')}
                      style={tw`w-full px-0`}>
                      {loading ? (
                        <Skeleton
                          backgroundColor={
                            tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                          }
                          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                          height={24}
                          width={128}
                        />
                      ) : (
                        <Text
                          style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
                          {dayjs(item.started).format('dddd ll')}
                        </Text>
                      )}
                    </ServiceRow>
                    <ServiceRow
                      withBottomDivider
                      label={
                        dayjs().startOf('day').isAfter(item.ended)
                          ? t('home.profile.subscription.status.expiredSince')
                          : t('home.profile.subscription.status.ongoingUntil')
                      }
                      style={tw`w-full px-0`}>
                      {loading ? (
                        <Skeleton
                          backgroundColor={
                            tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                          }
                          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                          height={24}
                          width={128}
                        />
                      ) : (
                        <Text
                          style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
                          {dayjs(item.ended).format('dddd ll')}
                        </Text>
                      )}
                    </ServiceRow>
                    <ServiceRow
                      withBottomDivider
                      description={t('home.profile.subscription.attendance.description')}
                      label={t('home.profile.subscription.attendance.label')}
                      style={tw`w-full px-0`}>
                      {loading ? (
                        <Skeleton
                          backgroundColor={
                            tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                          }
                          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                          height={24}
                          width={64}
                        />
                      ) : (
                        <View style={tw`flex flex-row justify-end items-end gap-1 grow`}>
                          {item.attendanceCount != 0 && (
                            <Text
                              numberOfLines={1}
                              style={tw`text-base font-semibold text-slate-900 dark:text-gray-200`}>
                              {item.attendanceCount}
                            </Text>
                          )}
                          <Text
                            numberOfLines={1}
                            style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
                            {t('home.profile.subscription.attendance.count', {
                              count: item.attendanceCount,
                            })}
                          </Text>
                        </View>
                      )}
                    </ServiceRow>
                    <ServiceRow
                      withBottomDivider
                      description={t('home.profile.subscription.activity.description')}
                      label={t('home.profile.subscription.activity.label')}
                      style={tw`w-full px-0`}>
                      {loading ? (
                        <Skeleton
                          backgroundColor={
                            tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                          }
                          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                          height={24}
                          width={96}
                        />
                      ) : (
                        <View style={tw`flex flex-row justify-end items-end gap-1 grow`}>
                          {item.activityCount != 0 && (
                            <Text
                              numberOfLines={1}
                              style={tw`text-base font-semibold text-slate-900 dark:text-gray-200`}>
                              {item.activityCount}
                            </Text>
                          )}
                          <Text
                            numberOfLines={1}
                            style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
                            {t('home.profile.subscription.activity.count', {
                              count: item.activityCount,
                            })}
                          </Text>
                        </View>
                      )}
                    </ServiceRow>
                    <ServiceRow
                      description={t('home.profile.subscription.savings.description')}
                      label={t('home.profile.subscription.savings.label')}
                      style={tw`w-full px-0`}>
                      {loading ? (
                        <Skeleton
                          backgroundColor={
                            tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                          }
                          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                          height={24}
                          width={96}
                        />
                      ) : (
                        <View
                          style={[
                            tw`px-2.5 py-0.5 rounded-full`,
                            item.savingsOverTickets < 0 && tw`bg-gray-100 dark:bg-gray-700`,
                            item.savingsOverTickets > 0 && tw`bg-green-100 dark:bg-green-900`,
                          ]}>
                          <Text
                            numberOfLines={1}
                            style={[
                              tw`text-base font-semibold text-slate-900 dark:text-gray-200`,
                              item.savingsOverTickets < 0 && tw`text-gray-800 dark:text-gray-300`,
                              item.savingsOverTickets > 0 && tw`text-green-800 dark:text-green-300`,
                            ]}>
                            {`${item.savingsOverTickets > 0 ? '+' : ''}${formatAmount(item.savingsOverTickets, {}, i18n.language)}`}
                          </Text>
                        </View>
                      )}
                    </ServiceRow>
                  </View>
                )}
                style={[tw`flex flex-row w-full h-full overflow-visible`]}
                width={carouselWidth}
                onProgressChange={(progress) => {
                  offset.value = -progress;
                }}
              />
            ) : (
              <></>
            )}
          </View>
          {sortedSubscriptions.length > 1 ? (
            <CarouselPaginationDots
              count={sortedSubscriptions.length}
              offset={offset}
              style={tw`self-center`}
              width={carouselWidth}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <View style={[tw`flex flex-col px-6`]}>
          <Text
            style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
            {t('home.profile.subscription.label.none')}
          </Text>
          <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4 mb-2`}>
            {t('home.profile.subscription.description')}
          </Text>
        </View>
      )}
      {subscriptionsError && !isSilentError(subscriptionsError) ? (
        <ErrorChip
          error={subscriptionsError}
          label={t('home.profile.subscription.onFetch.fail')}
          style={[tw`self-start mx-6`, sortedSubscriptions.length > 1 ? tw`mt-6` : tw`mt-2 mb-4`]}
        />
      ) : null}

      <Link
        asChild
        href="https://www.coworking-metz.fr/boutique/pass-resident/"
        style={tw`mx-6 ${sortedSubscriptions.length > 1 ? 'mt-6' : 'mt-2'}`}>
        <AppRoundedButton disabled={!user} style={tw`h-14 self-stretch`} suffixIcon="open-in-new">
          <Text style={tw`text-base font-medium text-black`}>
            {sortedSubscriptions.length
              ? t('home.profile.subscription.renew')
              : t('home.profile.subscription.get')}
          </Text>
        </AppRoundedButton>
      </Link>
    </AppBottomSheet>
  );
};

export default SubscriptionBottomSheet;
