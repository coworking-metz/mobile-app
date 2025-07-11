import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import { capitalize } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle, useColorScheme } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import AppText from '@/components/AppText';
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
  nonCompliantActivity = [],
  activityCount = 0,
  minimumSquares = MINIMUM_SQUARES,
  withDescription = false,
  style,
  onDateSelect,
}: {
  selectedDate?: string;
  loading?: boolean;
  nonCompliantActivity?: ApiMemberActivity[];
  activity?: ApiMemberActivity[];
  activityCount?: number;
  minimumSquares?: number;
  withDescription?: boolean;
  style?: StyleProp<ViewStyle>;
  onDateSelect?: (date: string) => void;
}) => {
  const { i18n, t } = useTranslation();
  const colorScheme = useColorScheme();
  const sixMonthsAgo = dayjs().subtract(6, 'months').startOf('day');
  const [areAllDatesVisible, setAllDatesVisible] = useState(false);

  const firstActivityDate = useMemo(() => {
    const [first] = activity;
    return first?.date;
  }, [activity]);

  const hasActivityBeforeSixMonths = useMemo(() => {
    return activity.some(({ date }) => sixMonthsAgo.isAfter(date));
  }, [activity, sixMonthsAgo]);

  const earliestDate = useMemo(() => {
    if (!areAllDatesVisible) {
      if (hasActivityBeforeSixMonths) {
        return sixMonthsAgo.format('YYYY-MM-DD');
      }

      const [first] = activity.filter(({ date }) => sixMonthsAgo.isBefore(date));
      return first?.date;
    }

    const [first] = activity;
    return first?.date;
  }, [activity, areAllDatesVisible, hasActivityBeforeSixMonths]);

  const squaresCount = useMemo(() => {
    return Math.max(dayjs().add(1, 'day').diff(earliestDate, 'day'), minimumSquares);
  }, [earliestDate, minimumSquares]);

  const values = useMemo(() => {
    return activity
      .filter(({ value }) => !!value)
      .map((item) => {
        const nonCompliant = nonCompliantActivity.find(({ date }) => date === item.date);
        return {
          date: item.date,
          selected: item.date === selectedDate,
          count: item.value,
          nonCompliantCount: nonCompliant?.value,
        };
      });
  }, [activity, selectedDate, nonCompliantActivity]);

  /**
   * Because lib authors are some kind of shenanigans,
   * the opacity color is based on the minimum and maximum values passed to the chart.
   * To get the color we want, we need to compute the opacity based on the maximum value.
   *
   * This is fucked up.
   * @see https://github.com/indiespirit/react-native-chart-kit/blob/master/src/Utils.ts
   *
   * So instead, we use patch-package to fix it in `ContributionGraph.js`
   * and pass the value alongside the opacity.
   */
  const getSquareColor = useCallback(
    (opacity: number, value?: (typeof values)[number]) => {
      // non-empty values are at least 0.15
      if (opacity > 0.15 && value) {
        const { count, nonCompliantCount, selected } = value;
        if (selected) {
          return `${tw.color('amber-800')}`;
        }

        if (nonCompliantCount) {
          if (nonCompliantCount > 0.5) {
            return `${tw.color('red-700')}`;
          } else {
            return `${tw.color('red-300')}`;
          }
        }

        if (count >= 1) {
          return theme.meatBrown;
        }

        return theme.peachYellow;
      }

      // for empty values
      if (colorScheme === 'dark') {
        return `rgba(255, 255, 255, 0.1)`;
      }
      return `rgba(128, 128, 128, 0.1)`;
    },
    [values, colorScheme],
  );

  return loading ? (
    <View style={tw`flex flex-row items-center justify-center min-h-[${HEIGHT_IN_PIXELS}px]`}>
      <VerticalLoadingAnimation
        color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
        style={tw`h-16 w-16`}
      />
    </View>
  ) : (
    <Animated.ScrollView
      horizontal={true}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      style={[style, { transform: [{ scaleX: -1 }] }]}>
      <View
        key={`presence-graph-${areAllDatesVisible ? `6months` : 'all'}`}
        style={[tw`flex flex-row`, { transform: [{ scaleX: -1 }] }]}>
        {activityCount && !areAllDatesVisible && hasActivityBeforeSixMonths ? (
          <LinearGradient
            colors={
              colorScheme === 'dark'
                ? ['#18181bff', '#18181bcc', '#18181b00']
                : ['#f9fafbff', '#f9fafbaa', '#f9fafb00']
            }
            end={{ x: 1, y: 0 }}
            start={{ x: 0.1, y: 0 }}
            style={[
              tw`w-48 z-10 absolute left-0 bottom-3.5`,
              { height: (SQUARE_SIZE + SQUARE_GAP) * 7 - SQUARE_GAP },
            ]}>
            <View style={tw`my-auto w-12 ml-9`}>
              <MaterialCommunityIcons.Button
                backgroundColor="transparent"
                borderRadius={40}
                color={tw.color('gray-500')}
                iconStyle={{ marginRight: 0 }}
                name="chevron-left-circle"
                size={40}
                style={tw`p-1`}
                underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
                onPress={() => setAllDatesVisible(true)}
              />
            </View>
          </LinearGradient>
        ) : withDescription ? (
          <View style={tw`flex flex-col self-center ml-6`}>
            <View style={tw`flex flex-row items-end gap-1`}>
              <AppText
                style={tw`text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {activityCount ||
                  t('settings.profile.presence.activity', {
                    count: activityCount,
                  })}
              </AppText>
              {!!activityCount && (
                <AppText
                  style={tw`font-normal text-sm leading-6 text-slate-500 dark:text-slate-400`}>
                  {t('settings.profile.presence.activity', {
                    count: activityCount,
                  })}
                </AppText>
              )}
            </View>
            {firstActivityDate && (
              <AppText style={tw`font-normal text-sm text-slate-500 dark:text-slate-400`}>
                {t('settings.profile.presence.since', {
                  date: dayjs(firstActivityDate).format('ll'),
                })}
              </AppText>
            )}
          </View>
        ) : null}
        <ContributionGraph
          chartConfig={{
            backgroundGradientTo: 'transparent',
            backgroundGradientFromOpacity: 0,
            backgroundGradientFrom: 'transparent',
            backgroundGradientToOpacity: 0,
            color: getSquareColor as never,
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
          tooltipDataAttrs={(_element) => ({
            // onPress: (evt) => {
            //   console.log(evt.nativeEvent.pageX, date);
            // },
          })}
          values={values}
          width={(Math.ceil(squaresCount / 7) + 3) * (SQUARE_SIZE + SQUARE_GAP)}
          onDayPress={({ count, date }) => {
            if (count) onDateSelect?.(date);
          }}
        />

        <View
          style={[
            tw`flex flex-col items-center justify-end pb-3.5 gap-[1px] mr-6`,
            { height: HEIGHT_IN_PIXELS },
          ]}>
          {Array(7)
            .fill(0)
            .map((_zero, index) => (
              <AppText
                key={`contribution-graph-week-day-${index}`}
                style={[
                  tw`text-center font-normal text-slate-500 dark:text-slate-400`,
                  { height: SQUARE_SIZE },
                ]}>
                {capitalize(dayjs().set('day', index).format('dd').slice(0, 1))}
              </AppText>
            ))}
        </View>
      </View>
    </Animated.ScrollView>
  );
};

export default PresenceGraph;
