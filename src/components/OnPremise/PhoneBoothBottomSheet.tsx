import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle, useColorScheme, type LayoutChangeEvent } from 'react-native';
import { BarChart, type stackDataItem } from 'react-native-gifted-charts';
import ReadMore from 'react-native-read-more-text';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import tw from 'twrnc';
import CallingWithLaptopAnimation from '@/components/Animations/CallingWithLaptopAnimation';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import ErrorBadge from '@/components/ErrorBadge';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { getPhoneBoothsOccupation } from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';

const BAR_WIDTH = 32;
const BAR_SPACING = 2;
// week should start on monday
const WEEK_DAYS_INDEXES = [...Array(7).keys()].map((index) => (index + 1) % 7);
const FIRST_HOUR_WITH_OCCUPATION = 6;
const LAST_HOUR_WITH_OCCUPATION = 20;

const PhoneBoothBottomSheet = ({
  blueOccupied = null,
  orangeOccupied = null,
  loading,
  style,
  onClose,
}: {
  blueOccupied?: boolean | null;
  orangeOccupied?: boolean | null;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const offset = useSharedValue(0);
  const colorScheme = useColorScheme();

  const {
    data: occupationPerBooth,
    isFetching: isFetchingOccupation,
    error: occupationError,
    refetch: refetchOccupationPerBooth,
  } = useQuery({
    queryKey: onPremiseQueryKeys.phoneBoothsOccupation(),
    queryFn: () => getPhoneBoothsOccupation(),
  });

  const getOccupationFromDayIndex = useCallback(
    (dayIndex: number) => {
      const todayBlueOccupation = occupationPerBooth?.blue.occupation.find(
        (item) => item.weekDayIndex === dayIndex,
      );
      const todayOrangeOccupation = occupationPerBooth?.orange.occupation.find(
        (item) => item.weekDayIndex === dayIndex,
      );

      // from 7AM to 11PM
      return Array.from(
        { length: LAST_HOUR_WITH_OCCUPATION - FIRST_HOUR_WITH_OCCUPATION + 1 },
        (_, index) => ({
          date: dayjs()
            .utc()
            .set('hour', FIRST_HOUR_WITH_OCCUPATION + index)
            .toISOString(),
          values: [
            todayBlueOccupation?.averageMinutesByUTCHour[FIRST_HOUR_WITH_OCCUPATION + index] || 0,
            todayOrangeOccupation?.averageMinutesByUTCHour[FIRST_HOUR_WITH_OCCUPATION + index] || 0,
          ],
        }),
      );
    },
    [occupationPerBooth],
  );

  const barWidth = useMemo(
    () => carouselWidth / (LAST_HOUR_WITH_OCCUPATION - FIRST_HOUR_WITH_OCCUPATION + BAR_SPACING),
    [carouselWidth],
  );

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch gap-4 pt-4`}
      style={style}
      onClose={onClose}>
      <View style={tw`flex flex-col items-start gap-4 px-4`}>
        <CallingWithLaptopAnimation
          autoPlay
          loop={false}
          style={tw`w-full h-[224px] self-center`}
        />
        <AppText
          style={tw`text-center self-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onPremise.phoneBooths.label')}
        </AppText>
        <ReadMore
          numberOfLines={2}
          renderRevealedFooter={(handlePress) => (
            <AppText
              style={tw`text-base font-normal text-amber-500 text-left`}
              onPress={handlePress}>
              {t('actions.hide')}
            </AppText>
          )}
          renderTruncatedFooter={(handlePress) => (
            <AppText
              style={tw`text-base font-normal text-amber-500 text-left`}
              onPress={handlePress}>
              {t('actions.readMore')}
            </AppText>
          )}>
          <AppText style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {t('onPremise.phoneBooths.description')}
          </AppText>
        </ReadMore>

        <View style={tw`flex flex-col w-full mt-2`}>
          <SectionTitle loading={loading} title={t('onPremise.phoneBooths.state.label')} />
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
                style={tw`text-base font-normal text-blue-500 dark:text-blue-400 text-right mr-1`}>
                {isNil(blueOccupied)
                  ? t('onPremise.phoneBooths.state.blue.occupation.unknown')
                  : blueOccupied
                    ? t('onPremise.phoneBooths.state.blue.occupation.occupied')
                    : t('onPremise.phoneBooths.state.blue.occupation.available')}
              </AppText>
            )}
          </ServiceRow>

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
                style={tw`text-base font-normal text-orange-500 dark:text-orange-400 text-right mr-1`}>
                {isNil(orangeOccupied)
                  ? t('onPremise.phoneBooths.state.orange.occupation.unknown')
                  : orangeOccupied
                    ? t('onPremise.phoneBooths.state.orange.occupation.occupied')
                    : t('onPremise.phoneBooths.state.orange.occupation.available')}
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
        style={tw`flex flex-col self-start w-full h-48 pb-8`}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setCarouselWidth(nativeEvent.layout.width)
        }>
        {!occupationPerBooth && isFetchingOccupation ? (
          <View style={tw`flex flex-row items-center justify-center min-h-40`}>
            <VerticalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
              style={tw`h-16 w-16`}
            />
          </View>
        ) : carouselWidth ? (
          <Carousel
            snapEnabled
            data={WEEK_DAYS_INDEXES}
            defaultIndex={WEEK_DAYS_INDEXES.findIndex((index) => index === dayjs().day())}
            loop={false}
            renderItem={({ item: day }) => (
              <View style={[tw`flex flex-col`, { width: carouselWidth }]}>
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
                      style={tw`flex flex-row justify-center bg-gray-300 dark:bg-zinc-700 py-1 rounded w-10 overflow-hidden mb-1 -ml-2 z-20`}>
                      <AppText
                        numberOfLines={1}
                        style={tw`text-xs text-center text-slate-900 dark:text-gray-200 font-medium`}>
                        {Number(blue + orange).toFixed(0)}%
                      </AppText>
                    </View>
                  )}
                  spacing={6}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  stackData={getOccupationFromDayIndex(day).reduce((acc, item, itemIndex) => {
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
                          tw`text-slate-500 dark:text-neutral-500 text-left`,
                          { width: BAR_WIDTH },
                        ],
                      } as stackDataItem,
                    ];
                  }, [])}
                  width={carouselWidth - 6}
                  xAxisColor={
                    tw.prefixMatch('dark') ? tw.color('neutral-700') : tw.color('slate-400')
                  }
                  yAxisColor={'transparent'}
                  yAxisExtraHeight={12}
                  yAxisLabelWidth={0}
                />
                <AppText
                  style={tw`text-center self-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-2`}>
                  {dayjs().set('day', day).format('dddd')}
                </AppText>
              </View>
            )}
            style={[tw`flex flex-row w-full h-full overflow-visible`]}
            width={carouselWidth}
            windowSize={3}
            onProgressChange={(_progress, relativeProgress) => {
              offset.value = relativeProgress;
            }}
          />
        ) : (
          <></>
        )}
      </View>
      <CarouselPaginationDots count={7} offset={offset} style={tw`self-center -mt-8`} />
    </AppBottomSheet>
  );
};

export default PhoneBoothBottomSheet;
