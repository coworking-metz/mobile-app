import CallingWithLaptopAnimation from '../Animations/CallingWithLaptopAnimation';
import HorizontalLoadingAnimation from '../Animations/HorizontalLoadingAnimation';
import VerticalLoadingAnimation from '../Animations/VerticalLoadingAnimation';
import AppBottomSheet from '../AppBottomSheet';
import CarouselPaginationDots from '../CarouselPaginationDots';
import ErrorChip from '../ErrorChip';
import ServiceRow from '../Settings/ServiceRow';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { isNil, uniq } from 'lodash';
import { Skeleton } from 'moti/skeleton';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  StyleProp,
  Text,
  View,
  ViewStyle,
  useColorScheme,
  type LayoutChangeEvent,
} from 'react-native';
import { BarChart, type stackDataItem } from 'react-native-gifted-charts';
import ReadMore from 'react-native-read-more-text';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';

import { getPhoneBoothsOccupation } from '@/services/api/services';
import useAuthStore from '@/stores/auth';

const BAR_WIDTH = 32;
const BAR_SPACING = 2;
// week should start on monday
const WEEK_DAYS_INDEXES = [...Array(7).keys()].map((index) => (index + 1) % 7);
const DEFAULT_FIRST_HOUR_WITH_OCCUPATION = 6;
const DEFAULT_LAST_HOUR_WITH_OCCUPATION = 20;

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
  const user = useAuthStore((s) => s.user);
  const colorScheme = useColorScheme();

  const {
    data: occupationPerBooth,
    isFetching: isFetchingOccupation,
    error: occupationError,
  } = useQuery({
    queryKey: ['phone-booths-occupation'],
    queryFn: () => getPhoneBoothsOccupation(),
    retry: false,
    enabled: !!user,
  });

  const allHours = useMemo(() => {
    if (!occupationPerBooth) return [];
    return uniq(
      [...occupationPerBooth.blue.occupation, ...occupationPerBooth.orange.occupation].reduce(
        (acc, { averageMinutesByUTCHour }) => [
          ...acc,
          ...Object.entries(averageMinutesByUTCHour || {})
            .filter(([_, value]) => !!value)
            .map(([hour]) => Number(hour)),
        ],
        [] as number[],
      ),
    );
  }, [occupationPerBooth]);

  const firstHourWithOccupation = useMemo(
    // () => (allHours.length ? Math.min(...allHours) : DEFAULT_FIRST_HOUR_WITH_OCCUPATION),
    () => DEFAULT_FIRST_HOUR_WITH_OCCUPATION,
    [allHours],
  );
  const lastHourWithOccupation = useMemo(
    // () => (allHours.length ? Math.max(...allHours) : DEFAULT_LAST_HOUR_WITH_OCCUPATION),
    () => DEFAULT_LAST_HOUR_WITH_OCCUPATION,
    [allHours],
  );

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
        { length: lastHourWithOccupation - firstHourWithOccupation + 1 },
        (_, index) => ({
          date: dayjs()
            .utc()
            .set('hour', firstHourWithOccupation + index)
            .toISOString(),
          values: [
            todayBlueOccupation?.averageMinutesByUTCHour[firstHourWithOccupation + index] || 0,
            todayOrangeOccupation?.averageMinutesByUTCHour[firstHourWithOccupation + index] || 0,
          ],
        }),
      );
    },
    [occupationPerBooth, firstHourWithOccupation, lastHourWithOccupation],
  );

  const barWidth = useMemo(
    () => carouselWidth / (lastHourWithOccupation - firstHourWithOccupation + BAR_SPACING),
    [carouselWidth, lastHourWithOccupation, firstHourWithOccupation],
  );

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch gap-4 pt-4 pb-8`}
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col items-start gap-4 px-4`}>
        <CallingWithLaptopAnimation
          autoPlay
          loop={false}
          style={tw`w-full h-[224px] self-center`}
        />
        <Text
          style={tw`text-center self-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onPremise.phoneBooths.label')}
        </Text>
        <ReadMore
          numberOfLines={2}
          renderRevealedFooter={(handlePress) => (
            <Text style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
              {t('actions.hide')}
            </Text>
          )}
          renderTruncatedFooter={(handlePress) => (
            <Text style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
              {t('actions.readMore')}
            </Text>
          )}>
          <Text style={tw`text-left text-base font-normal text-slate-500`}>
            {t('onPremise.phoneBooths.description')}
          </Text>
        </ReadMore>

        <View style={tw`flex flex-col w-full mt-2`}>
          <Text style={tw`text-sm font-normal uppercase text-slate-500`}>
            {t('onPremise.phoneBooths.state.label')}
          </Text>
          <ServiceRow
            withBottomDivider
            label={t('onPremise.phoneBooths.state.blue.occupation.label')}
            style={tw`w-full px-0`}
            {...(!isNil(blueOccupied) && {
              suffixIcon: blueOccupied ? 'door-closed' : 'door-open',
            })}>
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
                style={tw`text-base font-normal text-blue-500 dark:text-blue-400 grow text-right`}>
                {isNil(blueOccupied)
                  ? t('onPremise.phoneBooths.state.blue.occupation.unknown')
                  : blueOccupied
                    ? t('onPremise.phoneBooths.state.blue.occupation.occupied')
                    : t('onPremise.phoneBooths.state.blue.occupation.available')}
              </Text>
            )}
          </ServiceRow>

          <ServiceRow
            label={t('onPremise.phoneBooths.state.orange.occupation.label')}
            style={tw`w-full px-0`}
            {...(!isNil(orangeOccupied) && {
              suffixIcon: orangeOccupied ? 'door-closed' : 'door-open',
            })}>
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
                style={tw`text-base font-normal text-orange-500 dark:text-orange-400 grow text-right`}>
                {isNil(orangeOccupied)
                  ? t('onPremise.phoneBooths.state.orange.occupation.unknown')
                  : orangeOccupied
                    ? t('onPremise.phoneBooths.state.orange.occupation.occupied')
                    : t('onPremise.phoneBooths.state.orange.occupation.available')}
              </Text>
            )}
          </ServiceRow>
        </View>
      </View>

      <View style={tw`flex flex-row gap-2 min-h-6 mx-4`}>
        <Text style={tw`text-sm font-normal uppercase text-slate-500`}>
          {t('onPremise.phoneBooths.graph.label')}
        </Text>

        {occupationPerBooth && isFetchingOccupation ? (
          <HorizontalLoadingAnimation
            color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
            style={tw`ml-auto h-6 w-6`}
          />
        ) : occupationError && !isSilentError(occupationError) ? (
          <ErrorChip error={occupationError} label={t('onPremise.phoneBooths.onFetch.fail')} />
        ) : null}
      </View>

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
            renderItem={({ item: day, index }) => (
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
                      style={tw`flex flex-row justify-center bg-gray-300 dark:bg-gray-700 py-1 rounded w-10 overflow-hidden mb-1 -ml-2 z-20`}>
                      <Text
                        numberOfLines={1}
                        style={tw`text-xs text-center text-slate-900 dark:text-gray-200 font-medium`}>
                        {Number(blue + orange).toFixed(0)}%
                      </Text>
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
                        labelTextStyle: [tw`text-slate-500 text-left`, { width: BAR_WIDTH }],
                      } as stackDataItem,
                    ];
                  }, [])}
                  width={carouselWidth - 6}
                  xAxisColor={tw.color('slate-400')?.toString()}
                  yAxisColor={'transparent'}
                  yAxisExtraHeight={12}
                  yAxisLabelWidth={0}
                />
                <Text
                  style={tw`text-center self-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-2`}>
                  {dayjs().set('day', day).format('dddd')}
                </Text>
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
      <CarouselPaginationDots
        count={7}
        offset={offset}
        style={tw`self-center -mt-8`}
        width={carouselWidth}
      />
    </AppBottomSheet>
  );
};

export default PhoneBoothBottomSheet;
