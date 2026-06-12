import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { isNil } from 'lodash';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import tw from 'twrnc';
import CalendarAnimation from '@/components/Animations/CalendarAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import ErrorChip from '@/components/ErrorChip';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { formatAmount } from '@/helpers/currency';
import { isSilentError } from '@/helpers/error';
import i18n from '@/i18n';
import { getMemberSubscriptions, type ApiMemberSubscription } from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<ApiMemberSubscription>);

const SubscriptionBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    currentSubscription?: ApiMemberSubscription; // the one that should be displayed first
    style?: StyleProp<ViewStyle>;
    onClose?: () => void;
  }
> = ({ currentSubscription, style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const hasNavigatedToShop = useRef(false);
  const activeSince = useAppState();
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const offset = useSharedValue(0);

  const {
    isFetching: isFetchingSubscriptions,
    isPending: isPendingSubscriptions,
    isEnabled: areSubscriptionsEnabled,
    data: subscriptions,
    refetch: refetchSubscriptions,
    error: subscriptionsError,
  } = useQuery({
    queryKey: authStore.user?.id ? membersQueryKeys.subscriptionsById(authStore.user.id) : [],
    queryFn: () => {
      if (authStore.user?.id) {
        return getMemberSubscriptions(authStore.user.id);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !isNil(authStore.user?.id),
    select: (data) => [...data].sort((a, b) => dayjs(a.started).diff(b.started)),
  });

  useEffect(() => {
    if (areSubscriptionsEnabled && hasNavigatedToShop.current) {
      hasNavigatedToShop.current = false;
      refetchSubscriptions();
    }
  }, [areSubscriptionsEnabled, activeSince]);

  const onHorizontalScroll = useAnimatedScrollHandler(
    {
      onScroll: ({ contentOffset }) => {
        if (carouselWidth) {
          // Normalize to page index so pagination dots interpolate between items.
          offset.value = contentOffset.x / carouselWidth;
        } else {
          offset.value = 0;
        }
      },
    },
    [carouselWidth],
  );

  const defaultIndex = useMemo(() => {
    if (!subscriptions) return null;
    const currentSubscriptionIndex = subscriptions.findIndex(
      (s) => s._id === currentSubscription?._id,
    );
    if (currentSubscriptionIndex >= 0) return currentSubscriptionIndex;
    const lastSubscriptionIndex = subscriptions.length - 1;
    if (lastSubscriptionIndex >= 0) return lastSubscriptionIndex;
    return 0;
  }, [subscriptions, currentSubscription]);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`py-6`, style]} onClose={onClose}>
      <View style={tw`mx-6`}>
        <CalendarAnimation style={tw`mx-auto h-40 w-full`} />
        <AppText
          numberOfLines={2}
          style={tw`mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('home.profile.subscription.title')}
        </AppText>
        <AppText
          style={tw`mb-2 mt-4 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {t('home.profile.subscription.description')}
        </AppText>
      </View>

      <View
        style={[tw`w-full overflow-hidden`]}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setCarouselWidth(nativeEvent.layout.width)
        }>
        {subscriptions?.length ? (
          <AnimatedFlashList
            horizontal
            data={subscriptions}
            decelerationRate="fast"
            initialScrollIndex={defaultIndex}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <SubscriptionItem
                loading={isFetchingSubscriptions}
                pending={isPendingSubscriptions}
                style={tw.style(`px-6`, { width: carouselWidth })}
                subscription={item}
              />
            )}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToOffsets={Array.from({ length: subscriptions.length }).map(
              (_, i) => carouselWidth * (i + 1),
            )}
            onScroll={onHorizontalScroll}
          />
        ) : null}

        {subscriptions && subscriptions.length > 1 ? (
          <CarouselPaginationDots
            count={subscriptions.length}
            offset={offset}
            style={tw.style(`mt-3 self-center`)}
          />
        ) : null}
      </View>
      {subscriptionsError && !isSilentError(subscriptionsError) ? (
        <ErrorChip
          error={subscriptionsError}
          label={t('home.profile.subscription.onFetch.fail')}
          style={[
            tw`mx-6 self-start`,
            subscriptions && subscriptions.length > 1 ? tw`mt-6` : tw`mb-4 mt-2`,
          ]}
          onRetry={refetchSubscriptions}
        />
      ) : null}

      {authStore.user && (
        <View style={[tw`mx-6 mt-2`, subscriptions && subscriptions.length > 1 && tw`mt-6`]}>
          <Link
            asChild
            href={`${WORDPRESS_BASE_URL}/boutique/pass-resident/`}
            onPress={() => {
              hasNavigatedToShop.current = true;
            }}>
            <AppRoundedButton
              label={
                subscriptions?.length
                  ? t('home.profile.subscription.renew')
                  : t('home.profile.subscription.get')
              }
              style={tw`w-full max-w-sm self-center`}
              suffixIcon="open-in-new"
            />
          </Link>
        </View>
      )}
    </AppBottomSheet>
  );
};

const SubscriptionItem = ({
  subscription,
  loading,
  pending,
  style,
}: {
  subscription: ApiMemberSubscription;
  loading?: boolean;
  pending?: boolean;
  style?: ViewStyle;
}) => {
  const { t } = useTranslation();

  const header = useMemo(() => {
    const now = dayjs();
    if (now.startOf('day').isAfter(subscription.ended)) {
      const start = dayjs(subscription.started);
      const end = dayjs(subscription.ended);
      const startMonthDaysCount = start.endOf('month').diff(start, 'day');
      const endMonthDaysCount = end.diff(end.startOf('month'), 'day');
      if (startMonthDaysCount >= 20) {
        return now.isSame(start, 'year') ? start.format('MMMM') : start.format('MMMM YYYY');
      } else if (endMonthDaysCount >= 20) {
        return now.isSame(end, 'year') ? end.format('MMMM') : end.format('MMMM YYYY');
      } else {
        return [
          `${start.format('MMMM')} - ${end.format('MMMM')}`,
          !now.isSame(end, 'year') && end.format('YYYY'),
        ]
          .filter(Boolean)
          .join(' ');
      }
    }

    if (now.isBefore(subscription.started)) return t('home.profile.subscription.header.next');
    return t('home.profile.subscription.header.current');
  }, [subscription, t]);

  return (
    <View style={[tw`flex flex-col`, style]}>
      <SectionTitle loading={loading} style={tw`mt-1`} title={header} />
      <ServiceRow
        withBottomDivider
        label={t('home.profile.subscription.period.label')}
        style={tw`w-full px-0`}>
        {pending ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <AppText
            numberOfLines={2}
            style={tw`text-right text-sm font-normal text-slate-500 dark:text-neutral-500`}>
            {t('home.profile.subscription.period.value', {
              started: dayjs(subscription.started).format('dddd ll'),
              ended: dayjs(subscription.ended).format('dddd ll'),
            })}
          </AppText>
        )}
      </ServiceRow>

      <ServiceRow
        withBottomDivider
        description={t('home.profile.subscription.attendance.description')}
        label={t('home.profile.subscription.attendance.label')}
        style={tw`w-full px-0`}>
        {pending ? (
          <LoadingSkeleton height={24} width={64} />
        ) : (
          <Trans
            components={[
              <AppText
                key="emphasis"
                numberOfLines={1}
                style={tw`font-semibold text-slate-900 dark:text-gray-200`}
              />,
            ]}
            defaults={t('home.profile.subscription.attendance.count', {
              count: subscription.attendanceCount,
            })}
            numberOfLines={1}
            parent={AppText}
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}
          />
        )}
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        description={t('home.profile.subscription.activity.description')}
        label={t('home.profile.subscription.activity.label')}
        style={tw`w-full px-0`}>
        {pending ? (
          <LoadingSkeleton height={24} width={96} />
        ) : (
          <Trans
            components={[
              <AppText
                key="emphasis"
                numberOfLines={1}
                style={tw`font-semibold text-slate-900 dark:text-gray-200`}
              />,
            ]}
            defaults={t('home.profile.subscription.activity.count', {
              count: subscription.activityCount,
            })}
            numberOfLines={1}
            parent={AppText}
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}
          />
        )}
      </ServiceRow>
      <ServiceRow
        description={t('home.profile.subscription.savings.description')}
        label={t('home.profile.subscription.savings.label')}
        style={tw`w-full px-0`}>
        {pending ? (
          <LoadingSkeleton height={24} width={80} />
        ) : subscription.savingsOverTickets > 0 ? (
          <View style={tw`rounded-full bg-green-100 px-2.5 py-0.5 dark:bg-green-900`}>
            <AppText
              numberOfLines={1}
              style={[tw`text-base font-semibold leading-5 text-green-800 dark:text-green-300`]}>
              +{formatAmount(subscription.savingsOverTickets, {}, i18n.language)}
            </AppText>
          </View>
        ) : (
          <AppText
            numberOfLines={1}
            style={[tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`]}>
            {formatAmount(subscription.savingsOverTickets, {}, i18n.language)}
          </AppText>
        )}
      </ServiceRow>
    </View>
  );
};

export default forwardRef(SubscriptionBottomSheet);
