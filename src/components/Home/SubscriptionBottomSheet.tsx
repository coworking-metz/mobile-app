import CalendarAnimation from '../Animations/CalendarAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import ServiceRow from '../Settings/ServiceRow';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  type StyleProps,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { type ApiMemberSubscription } from '@/services/api/members';

const DOT_SIZE = 12;
const EXPANDED_DOT_SIZE = DOT_SIZE * 3;
const MARGIN = (DOT_SIZE / 3) * 2;

const PaginationDot = ({
  animationValue,
  index,
  containerWidth,
}: {
  index: number;
  animationValue: Animated.SharedValue<number>;
  containerWidth: number;
}) => {
  const inputRange = [
    (index - 1) * containerWidth,
    index * containerWidth,
    (index + 1) * containerWidth,
  ];

  const sizeInputRange = [
    (index - 3) * containerWidth,
    (index - 2) * containerWidth,
    (index - 1) * containerWidth,
    index * containerWidth,
    (index + 1) * containerWidth,
    (index + 2) * containerWidth,
    (index + 3) * containerWidth,
  ];

  const animatedStyles = useAnimatedStyle(() => {
    const colour = interpolateColor(
      animationValue.value,
      inputRange,
      [theme.silverSand, '#C27803', theme.silverSand],
      'RGB',
    );

    const width = interpolate(
      animationValue.value,
      sizeInputRange,
      [DOT_SIZE, DOT_SIZE, DOT_SIZE, EXPANDED_DOT_SIZE, DOT_SIZE, DOT_SIZE, DOT_SIZE],
      'clamp',
    );

    const right = interpolate(
      animationValue.value,
      sizeInputRange,
      [
        0,
        (DOT_SIZE + MARGIN) * 1,
        (DOT_SIZE + MARGIN) * 2,
        (DOT_SIZE + MARGIN) * 3,
        (DOT_SIZE + MARGIN) * 3 + EXPANDED_DOT_SIZE + MARGIN,
        (DOT_SIZE + MARGIN) * 4 + EXPANDED_DOT_SIZE + MARGIN,
        (DOT_SIZE + MARGIN) * 5 + EXPANDED_DOT_SIZE + MARGIN,
      ],
      'clamp',
    );

    const opacity = interpolate(
      animationValue.value,
      sizeInputRange,
      [0, 0.5, 1, 1, 1, 0.5, 0],
      'clamp',
    );

    return {
      right,
      opacity,
      width,
      backgroundColor: colour,
    };
  });

  return (
    <Animated.View
      style={[
        tw`absolute`,
        {
          right: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
        },
        animatedStyles,
      ]}
    />
  );
};

const SubscriptionBottomSheet = ({
  subscriptions = [],
  loading = false,
  style,
  onClose,
}: {
  subscriptions?: ApiMemberSubscription[];
  loading?: boolean;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const offset = useSharedValue(0);

  const getLabel = useCallback(
    (s: ApiMemberSubscription) => {
      const now = dayjs();
      if (now.startOf('day').isAfter(s.aboEnd)) {
        const start = dayjs(s.aboStart);
        const end = dayjs(s.aboEnd);
        const startMonthDaysCount = start.endOf('month').diff(start, 'day');
        const endMonthDaysCount = end.diff(end.startOf('month'), 'day');
        if (startMonthDaysCount >= 20) {
          return t('home.profile.subscription.label.previous', {
            month: start.format('MMMM'),
          });
        } else if (endMonthDaysCount >= 20) {
          return t('home.profile.subscription.label.previous', {
            month: end.format('MMMM'),
          });
        } else {
          return t('home.profile.subscription.label.previous', {
            month: `${start.format('MMMM')} - ${end.format('MMMM')}`,
          });
        }
      }

      if (now.isBefore(s.aboStart)) return t('home.profile.subscription.label.next');
      return t('home.profile.subscription.label.current');
    },
    [t],
  );

  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => {
      return dayjs(a.aboStart).diff(b.aboStart);
    });
  }, [subscriptions]);

  const defaultIndex = useMemo(() => {
    const currentSubscriptionIndex = sortedSubscriptions.findIndex((s) => s.current);
    if (currentSubscriptionIndex >= 0) return currentSubscriptionIndex;
    const lastSubscriptionIndex = sortedSubscriptions.length - 1;
    if (lastSubscriptionIndex >= 0) return lastSubscriptionIndex;
    return 0;
  }, [sortedSubscriptions]);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col w-full justify-between py-4`}
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`mx-6`}>
        <CalendarAnimation style={tw`w-full`} />
      </View>
      {sortedSubscriptions.length ? (
        <>
          <View
            style={tw`self-start w-full h-63`}
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
                  <View style={[tw`flex flex-col px-6`, { width: carouselWidth }]}>
                    <Text
                      style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
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
                          {dayjs(item.aboStart).format('dddd ll')}
                        </Text>
                      )}
                    </ServiceRow>
                    <ServiceRow
                      label={
                        dayjs().startOf('day').isAfter(item.aboEnd)
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
                          {dayjs(item.aboEnd).format('dddd ll')}
                        </Text>
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
            <View
              pointerEvents={'none'}
              style={[
                tw`relative flex flex-row self-center mt-6`,
                { width: (DOT_SIZE + MARGIN) * 6 + EXPANDED_DOT_SIZE, height: DOT_SIZE },
              ]}>
              {sortedSubscriptions.map((_, index) => (
                <PaginationDot
                  animationValue={offset}
                  containerWidth={carouselWidth}
                  index={index}
                  key={`pagination-dot-${index}`}
                />
              ))}
            </View>
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

      <Link
        asChild
        href="https://www.coworking-metz.fr/boutique/pass-resident/"
        style={tw`mt-6 mx-6`}>
        <AppRoundedButton style={tw`h-14 self-stretch`} suffixIcon="open-in-new">
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
