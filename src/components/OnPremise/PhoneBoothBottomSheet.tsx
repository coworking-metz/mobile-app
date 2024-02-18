import CallingWithLaptopAnimation from '../Animations/CallingWithLaptopAnimation';
import VerticalLoadingAnimation from '../Animations/VerticalLoadingAnimation';
import AppBottomSheet from '../AppBottomSheet';
import CarouselPaginationDots from '../CarouselPaginationDots';
import ErrorChip from '../ErrorChip';
import ServiceRow from '../Settings/ServiceRow';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View, type LayoutChangeEvent } from 'react-native';
import { BarChart, type barDataItem } from 'react-native-gifted-charts';
import ReadMore from 'react-native-read-more-text';
import { useSharedValue, type StyleProps } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { isSilentError } from '@/helpers/error';
import { getPhoneBoothsOccupation } from '@/services/api/services';
import useAuthStore from '@/stores/auth';

const BAR_WIDTH = 32;
// week should start on monday
const WEEK_DAYS_INDEXES = [...Array(7).keys()].map((index) => (index + 1) % 7);

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
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [selectedWeekDayIndex, setSelectedWeekDayIndex] = useState<number>(dayjs().day());
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const offset = useSharedValue(0);
  const user = useAuthStore((state) => state.user);

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
    return [...occupationPerBooth.blue.occupation, ...occupationPerBooth.orange.occupation].reduce(
      (acc, { averageMinutesByUTCHour }) => [
        ...acc,
        ...Object.keys(averageMinutesByUTCHour || {}).map(Number),
      ],
      [] as number[],
    );
  }, [occupationPerBooth]);

  const firstHourWithOccupation = useMemo(
    () => (allHours.length ? Math.min(...allHours) : 0),
    [allHours],
  );
  const lastHourWithOccupation = useMemo(
    () => (allHours.length ? Math.max(...allHours) : 0),
    [allHours],
  );

  const todayOccupation = useMemo(() => {
    if (!occupationPerBooth) return [];
    const todayBlueOccupation = occupationPerBooth?.blue.occupation.find(
      (item) => item.weekDayIndex === selectedWeekDayIndex,
    );
    const todayOrangeOccupation = occupationPerBooth?.orange.occupation.find(
      (item) => item.weekDayIndex === selectedWeekDayIndex,
    );

    // from 7AM to 11PM
    return Array.from({ length: lastHourWithOccupation - firstHourWithOccupation }, (_, index) => ({
      date: dayjs()
        .utc()
        .set('hour', firstHourWithOccupation + index)
        .toISOString(),
      values: [
        todayBlueOccupation?.averageMinutesByUTCHour[firstHourWithOccupation + index] || 0,
        todayOrangeOccupation?.averageMinutesByUTCHour[firstHourWithOccupation + index] || 0,
      ],
    }));
  }, [occupationPerBooth, selectedWeekDayIndex, firstHourWithOccupation, lastHourWithOccupation]);

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
          style={tw`w-full max-h-[224px] self-center`}
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

        <View style={tw`flex flex-col w-full`}>
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

        {occupationError && !isSilentError(occupationError) ? (
          <ErrorChip error={occupationError} label={t('onPremise.phoneBooths.onFetch.fail')} />
        ) : null}
      </View>
      {isFetchingOccupation ? (
        <View style={tw`flex flex-row items-center justify-center min-h-40`}>
          <VerticalLoadingAnimation
            color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
            style={tw`h-16`}
          />
        </View>
      ) : (
        <BarChart
          focusBarOnPress
          barWidth={BAR_WIDTH}
          dashWidth={0}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data={todayOccupation.reduce((acc, item) => {
            return [
              ...acc,
              {
                label: dayjs(item.date).local().format('HH[h]'),
                value: (item.values[0] / 60) * 100,
                frontColor: tw.color('blue-400')?.toString(),
                spacing: 2,
                barBorderTopLeftRadius: 6,
                barBorderTopRightRadius: 6,
                labelTextStyle: [tw`text-slate-500 text-center`, { width: BAR_WIDTH * 2 + 2 }],
                focusedBarConfig: {
                  color: theme.silverSand,
                },
              } as barDataItem,
              {
                value: (item.values[1] / 60) * 100,
                frontColor: tw.color('orange-400')?.toString(),
                barBorderTopLeftRadius: 6,
                barBorderTopRightRadius: 6,
              },
            ];
          }, [])}
          focusedBarConfig={{
            color: theme.meatBrown,
          }}
          formatYLabel={(value) => (Number(value) > 0 ? value : `${value}%`)}
          height={128}
          initialSpacing={0}
          maxValue={100}
          noOfSections={1}
          overflowTop={12}
          renderTooltip={({ value }: { value: string }) => (
            <View style={[tw`mb-1 flex flex-row justify-center`, { width: BAR_WIDTH }]}>
              <Text style={tw`text-amber-500 dark:text-amber-400`}>{`${Number(value).toFixed(
                0,
              )}%`}</Text>
            </View>
          )}
          scrollToIndex={(dayjs().get('hour') - firstHourWithOccupation) * 2}
          xAxisColor={'transparent'}
          yAxisColor={'transparent'}
          yAxisLabelWidth={0}
        />
      )}

      <View
        style={tw`self-start w-full h-16`}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setCarouselWidth(nativeEvent.layout.width)
        }>
        {carouselWidth ? (
          <Carousel
            snapEnabled
            data={WEEK_DAYS_INDEXES}
            defaultIndex={WEEK_DAYS_INDEXES.findIndex((index) => index === selectedWeekDayIndex)}
            loop={false}
            renderItem={({ item }) => (
              <View style={[tw`flex flex-col px-6`, { width: carouselWidth }]}>
                <Text
                  style={tw`text-center self-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                  {dayjs().set('day', item).format('dddd')}
                </Text>
              </View>
            )}
            style={[tw`flex flex-row w-full h-full overflow-visible`]}
            width={carouselWidth}
            onProgressChange={(progress) => {
              offset.value = -progress;
            }}
            onSnapToItem={(index) => setSelectedWeekDayIndex(WEEK_DAYS_INDEXES[index])}
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
