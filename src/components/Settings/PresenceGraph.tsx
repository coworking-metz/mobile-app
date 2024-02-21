import VerticalLoadingAnimation from '../Animations/VerticalLoadingAnimation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import Animated, { type StyleProps } from 'react-native-reanimated';
import { Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { type ApiMemberActivity } from '@/services/api/members';

const SQUARE_SIZE = 20;
const SQUARE_GAP = 1;
const MINIMUM_SQUARES = 180;
const HEIGHT_IN_PIXELS = 210;

const PresenceGraph = ({
  selectedDate,
  loading = false,
  activity = [],
  nonCompliantDates = [],
  style,
  onDateSelect,
}: {
  selectedDate?: string;
  loading?: boolean;
  nonCompliantDates?: string[];
  activity?: ApiMemberActivity[];
  style?: StyleProps;
  onDateSelect?: (date: string) => void;
}) => {
  const { i18n, t } = useTranslation();
  const animatedScrollViewRef = useRef<Animated.ScrollView>(null);
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
  );
  const earliestDate = useMemo(() => {
    const [first] = activity
      .filter(({ date }) => !startDate || dayjs(date).isAfter(startDate))
      .sort((a, b) => dayjs(a.date).diff(b.date));
    return first?.date;
  }, [activity, startDate]);

  const squaresCount = useMemo(() => {
    return Math.max(dayjs().diff(earliestDate, 'day'), MINIMUM_SQUARES);
  }, [earliestDate]);

  const hasSelectedDate = useMemo(
    () => activity.some(({ date }) => selectedDate === date),
    [selectedDate],
  );
  const hasNonCompliantDates = useMemo(
    () => activity.some(({ date }) => nonCompliantDates.includes(date)),
    [nonCompliantDates],
  );

  /**
   * Because lib authors are some kind of shenanigans,
   * the opacity color is based on the minimum and maximum values passed to the chart.
   * To get the color we want, we need to compute the opacity based on the maximum value.
   *
   * This is fucked up. Don't try to maintain this code.
   *
   * @see https://github.com/indiespirit/react-native-chart-kit/blob/master/src/Utils.ts
   */
  const getSquareColor = useCallback(
    (opacity: number) => {
      // non-empty values are at least 0.15
      if (opacity > 0.15) {
        if (hasSelectedDate) {
          if (opacity >= 1) {
            return `${tw.color('amber-800')}`; // should be 1 because count is 3 (the highest)
          }
        }

        if (hasNonCompliantDates) {
          if (opacity > 0.6) {
            return `${tw.color('red-700')}`; // should be at least 0.6 because count is 2.5
          }
          if (opacity > 0.4) {
            return `${tw.color('red-300')}`; // should be at least 0.4 because count is 1.25
          }
        }

        if (opacity > 0.2) {
          // if above the min, this a full day
          return theme.meatBrown;
        }
        return theme.peachYellow; // should always be equal to 0.2 because this is the min
      }

      // for empty values
      if (tw.prefixMatch('dark')) {
        return `rgba(255, 255, 255, 0.1)`;
      }
      return `rgba(128, 128, 128, 0.1)`;
    },
    [selectedDate, hasNonCompliantDates],
  );

  const values = useMemo(() => {
    return activity.map((item) => ({
      date: item.date,
      count:
        item.date === selectedDate
          ? 3
          : nonCompliantDates.includes(item.date)
            ? 2.5 * item.value
            : item.value,
    }));
  }, [activity, selectedDate, nonCompliantDates]);

  return loading ? (
    <View style={tw`flex flex-row items-center justify-center min-h-[${HEIGHT_IN_PIXELS}px]`}>
      <VerticalLoadingAnimation
        color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
        style={tw`h-16`}
      />
    </View>
  ) : (
    <Animated.ScrollView
      ref={animatedScrollViewRef}
      horizontal={true}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      style={[style, { transform: [{ scaleX: -1 }] }]}>
      <View
        key={`presence-graph-${startDate ? `6months` : 'all'}`}
        style={[tw`flex flex-row`, { transform: [{ scaleX: -1 }] }]}>
        {!startDate ? (
          <Text
            style={tw`text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-200 self-center ml-6`}>
            {dayjs(earliestDate).year()}
          </Text>
        ) : (
          <Button
            activeBackgroundColor={
              tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')
            }
            activeOpacity={1}
            backgroundColor="transparent"
            style={tw`ml-6 h-14 my-auto`}
            onPress={() => setStartDate(null)}>
            <MaterialCommunityIcons
              color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
              name="arrow-left"
              size={24}
            />
            <Text style={tw`ml-3 text-base font-medium text-slate-900 dark:text-gray-200`}>
              {t('actions.seeMore')}
            </Text>
          </Button>
        )}
        <ContributionGraph
          chartConfig={{
            backgroundGradientTo: 'transparent',
            backgroundGradientFromOpacity: 0,
            backgroundGradientFrom: 'transparent',
            backgroundGradientToOpacity: 0,
            color: getSquareColor,
            labelColor: (opacity = 1) =>
              tw.prefixMatch('dark')
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2, // optional, default 3
          }}
          endDate={new Date()}
          getMonthLabel={(month) =>
            new Intl.DateTimeFormat(i18n.language, {
              month: 'long',
              timeZone: 'UTC',
            }).format(new Date(`2023-${month < 9 ? `0${month + 1}` : month + 1}-01`))
          }
          height={HEIGHT_IN_PIXELS}
          numDays={squaresCount}
          tooltipDataAttrs={({ date }) => ({
            // onPress: (evt) => {
            //   console.log(evt.nativeEvent.pageX, date);
            // },
          })}
          values={values}
          width={Math.ceil(squaresCount / 7) * (SQUARE_SIZE + SQUARE_GAP) + 64} // magic formula
          onDayPress={({ count, date }) => {
            if (count) onDateSelect?.(date);
          }}
        />

        <View
          style={[
            tw`flex flex-col justify-end pb-3.5 gap-[1px] mr-6`,
            { height: HEIGHT_IN_PIXELS },
          ]}>
          {[...Array(7).keys()].map((index) => (
            <Text
              key={`contribution-graph-week-day-${index}`}
              style={[
                tw`text-center font-normal uppercase text-slate-500 dark:text-slate-400`,
                { height: SQUARE_SIZE },
              ]}>
              {dayjs().set('day', index).format('dddd').slice(0, 1)}
            </Text>
          ))}
        </View>
      </View>
    </Animated.ScrollView>
  );
};

export default PresenceGraph;
