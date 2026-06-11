import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useIsFocused } from 'expo-router';
import { isNil } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, useColorScheme, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import { BarChart, type stackDataItem } from 'react-native-gifted-charts';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import tw from 'twrnc';
import CallingWithLaptopAnimation from '@/components/Animations/CallingWithLaptopAnimation';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import ErrorBadge from '@/components/ErrorBadge';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { getOnPremiseState, getPhoneBoothsOccupation } from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';

const BAR_WIDTH = 32;
const BAR_SPACING = 2;
// week should start on monday
const WEEK_DAYS_INDEXES = [...Array(7).keys()].map((index) => (index + 1) % 7);
const FIRST_HOUR_WITH_OCCUPATION = 6;
const LAST_HOUR_WITH_OCCUPATION = 20;

type HourlyOccupation = {
  date: string;
  values: number[];
};

type DailyOccupation = {
  date: string;
  byHour: HourlyOccupation[];
};

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<DailyOccupation>);

const PhoneBoothBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    blueOccupied?: boolean | null;
    orangeOccupied?: boolean | null;
    loading?: boolean;
  }
> = ({ blueOccupied = null, orangeOccupied = null, loading, style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const offset = useSharedValue(0);
  const activeSince = useAppState();
  const isFocus = useIsFocused();

  const { dataUpdatedAt: onPremiseStateUpdatedAt } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
  });

  // count duration since last fetch to redraw stale data text
  // every time the screen gets focused or the app gets back to foreground
  const durationSinceLastFetch = useMemo(() => {
    return onPremiseStateUpdatedAt ? dayjs().diff(onPremiseStateUpdatedAt, 'second') : null;
  }, [onPremiseStateUpdatedAt, isFocus, activeSince]);

  const {
    data: occupationPerBooth,
    isFetching: isFetchingOccupation,
    error: occupationError,
    refetch: refetchOccupationPerBooth,
  } = useQuery({
    queryKey: onPremiseQueryKeys.phoneBoothsOccupation(),
    queryFn: () => getPhoneBoothsOccupation(),
  });

  const dailyOccupations = useMemo(() => {
    return WEEK_DAYS_INDEXES.map((dayIndex) => {
      const blueOccupation = occupationPerBooth?.blue.occupation.find(
        (item) => item.weekDayIndex === dayIndex,
      );
      const orangeOccupation = occupationPerBooth?.orange.occupation.find(
        (item) => item.weekDayIndex === dayIndex,
      );

      return {
        date: dayjs().day(dayIndex).toISOString(),
        byHour: Array.from(
          // from 7AM to 11PM
          { length: LAST_HOUR_WITH_OCCUPATION - FIRST_HOUR_WITH_OCCUPATION + 1 },
          (_, index) => ({
            date: dayjs()
              .utc()
              .set('hour', FIRST_HOUR_WITH_OCCUPATION + index)
              .toISOString(),
            values: [
              blueOccupation?.averageMinutesByUTCHour[FIRST_HOUR_WITH_OCCUPATION + index] || 0,
              orangeOccupation?.averageMinutesByUTCHour[FIRST_HOUR_WITH_OCCUPATION + index] || 0,
            ],
          }),
        ),
      };
    });
  }, [occupationPerBooth]);

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

  const barWidth = useMemo(
    () => carouselWidth / (LAST_HOUR_WITH_OCCUPATION - FIRST_HOUR_WITH_OCCUPATION + BAR_SPACING),
    [carouselWidth],
  );

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col gap-4 py-6`, style]}
      onClose={onClose}>
      <View style={tw`flex flex-col items-start gap-4 px-4`}>
        <CallingWithLaptopAnimation
          autoPlay
          loop={false}
          style={tw`h-[224px] w-full self-center`}
        />
        <AppText
          style={tw`self-center text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onPremise.phoneBooths.label')}
        </AppText>
        <Trans
          components={[
            <AppText
              key="unable-to-book"
              style={tw`font-medium text-slate-900 dark:text-gray-200`}
            />,
          ]}
          defaults={t('onPremise.phoneBooths.description')}
          parent={AppText}
          style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
        />

        <View style={tw`mt-2 flex w-full flex-col`}>
          <SectionTitle loading={loading} title={t('onPremise.phoneBooths.state.label')}>
            {!isNil(durationSinceLastFetch) && durationSinceLastFetch > 300 && (
              <AppText
                style={tw`ml-auto text-right text-xs font-normal text-slate-500 dark:text-neutral-500`}>
                {durationSinceLastFetch > 3_600
                  ? dayjs(onPremiseStateUpdatedAt).calendar()
                  : dayjs(onPremiseStateUpdatedAt).fromNow()}
              </AppText>
            )}
          </SectionTitle>

          <ServiceRow
            label={t('onPremise.phoneBooths.state.orange.occupation.label')}
            style={tw`w-full px-0`}
            {...(!isNil(orangeOccupied) && {
              suffixIcon: orangeOccupied ? 'door-closed' : 'door-open',
            })}>
            {loading ? (
              <LoadingSkeleton height={24} width={128} />
            ) : (
              <AppText
                style={tw`mr-1 text-right text-base font-normal text-orange-500 dark:text-orange-400`}>
                {isNil(orangeOccupied)
                  ? t('onPremise.phoneBooths.state.orange.occupation.unknown')
                  : orangeOccupied
                    ? t('onPremise.phoneBooths.state.orange.occupation.occupied')
                    : t('onPremise.phoneBooths.state.orange.occupation.available')}
              </AppText>
            )}
          </ServiceRow>
          <ServiceRow
            withBottomDivider
            label={t('onPremise.phoneBooths.state.blue.occupation.label')}
            style={tw`w-full px-0`}
            {...(!isNil(blueOccupied) && {
              suffixIcon: blueOccupied ? 'door-closed' : 'door-open',
            })}>
            {loading ? (
              <LoadingSkeleton height={24} width={128} />
            ) : (
              <AppText
                style={tw`mr-1 text-right text-base font-normal text-blue-500 dark:text-blue-400`}>
                {isNil(blueOccupied)
                  ? t('onPremise.phoneBooths.state.blue.occupation.unknown')
                  : blueOccupied
                    ? t('onPremise.phoneBooths.state.blue.occupation.occupied')
                    : t('onPremise.phoneBooths.state.blue.occupation.available')}
              </AppText>
            )}
          </ServiceRow>
        </View>
      </View>

      <SectionTitle
        loading={loading}
        style={tw`mx-4`}
        title={t('onPremise.phoneBooths.graph.label')}>
        {occupationError && !isSilentError(occupationError) && !isFetchingOccupation ? (
          <ErrorBadge
            error={occupationError}
            title={t('onPremise.phoneBooths.onFetch.fail')}
            onRetry={refetchOccupationPerBooth}
          />
        ) : null}
      </SectionTitle>

      <View
        style={tw`flex w-full flex-col self-start`}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setCarouselWidth(nativeEvent.layout.width)
        }>
        {!occupationPerBooth && isFetchingOccupation ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={tw`flex min-h-40 flex-row items-center justify-center`}>
            <VerticalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
              style={tw`size-16`}
            />
          </Animated.View>
        ) : carouselWidth ? (
          <AnimatedFlashList
            horizontal
            data={dailyOccupations}
            decelerationRate="fast"
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            initialScrollIndex={WEEK_DAYS_INDEXES.findIndex((index) => index === dayjs().day())}
            keyExtractor={(occupation) => occupation.date}
            renderItem={({ item: occupation }) => (
              <DailyOccupationBarChart
                barWidth={barWidth}
                occupation={occupation}
                width={carouselWidth}
              />
            )}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToOffsets={Array.from({ length: dailyOccupations.length }).map(
              (_, i) => carouselWidth * (i + 1),
            )}
            onScroll={onHorizontalScroll}
          />
        ) : null}
        <CarouselPaginationDots count={7} offset={offset} style={tw`mt-4 self-center`} />
      </View>
    </AppBottomSheet>
  );
};

const DailyOccupationBarChart = ({
  width,
  barWidth,
  occupation,
  style,
}: {
  width: number;
  barWidth: number;
  occupation: DailyOccupation;
  style?: StyleProp<ViewStyle>;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={[tw`flex flex-col`, { width }, style]}>
      <BarChart
        disableScroll
        focusBarOnPress
        barWidth={barWidth}
        dashWidth={0}
        focusedBarConfig={{
          color: theme.meatBrown,
        }}
        formatYLabel={(value) => (Number(value) > 0 ? value : `${value}%`)}
        height={92}
        initialSpacing={6}
        maxValue={100}
        noOfSections={1}
        overflowTop={12}
        renderTooltip={({
          stacks: [{ value: blue }, { value: orange }],
        }: {
          stacks: { value: number }[];
        }) => (
          <View
            style={tw`z-20 -ml-2 mb-1 flex w-10 flex-row justify-center overflow-hidden rounded bg-gray-300 py-1 dark:bg-zinc-700`}>
            <AppText
              numberOfLines={1}
              style={tw`text-center text-xs font-medium text-slate-900 dark:text-gray-200`}>
              {Number(blue + orange).toFixed(0)}%
            </AppText>
          </View>
        )}
        spacing={6}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        stackData={occupation.byHour.reduce((acc, item, itemIndex) => {
          return [
            ...acc,
            {
              stacks: [
                {
                  value: (item.values[0] / 60) * 50,
                  color:
                    colorScheme === 'dark'
                      ? tw.color('blue-500')?.toString()
                      : tw.color('blue-400')?.toString(),
                },
                {
                  value: (item.values[1] / 60) * 50,
                  color:
                    colorScheme === 'dark'
                      ? tw.color('orange-500')?.toString()
                      : tw.color('orange-400')?.toString(),
                },
              ],
              spacing: 2,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              ...(itemIndex % 3 === 0 && {
                label: dayjs(item.date).local().format('HH[h]'),
              }),
              labelTextStyle: [
                tw`text-left text-slate-500 dark:text-neutral-500`,
                { width: BAR_WIDTH },
              ],
            } as stackDataItem,
          ];
        }, [])}
        width={width - 6}
        xAxisColor={tw.prefixMatch('dark') ? tw.color('neutral-700') : tw.color('slate-400')}
        yAxisColor={'transparent'}
        yAxisExtraHeight={12}
        yAxisLabelWidth={0}
      />
      <AppText
        style={tw`mt-2 self-center text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {dayjs(occupation.date).format('dddd')}
      </AppText>
    </View>
  );
};

export default forwardRef(PhoneBoothBottomSheet);
