import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import { capitalize } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle, useColorScheme } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import AppIconButton from '@/components/AppIconButton';
import AppText from '@/components/AppText';
import { theme } from '@/helpers/colors';
import { type ApiMemberActivity } from '@/services/api/members';

const SQUARE_SIZE = 20;
const SQUARE_GAP = 1;
const MINIMUM_SQUARES = 180;
const HEIGHT_IN_PIXELS = 210;

const PresenceGraph = ({
  selectedDate,
  pending = false,
  activity = [],
  activityCount = 0,
  minimumSquares = MINIMUM_SQUARES,
  withDescription = false,
  style,
  onDateSelect,
}: {
  selectedDate?: string;
  pending?: boolean;
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
      .map((item) => ({
        date: item.date,
        type: item.type,
        count: item.value,
        coverage: item.coverage,
      }));
  }, [activity]);

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
    (opacity: number, item?: (typeof values)[number]) => {
      // non-empty values are at least 0.15
      if (opacity > 0.15 && item) {
        const { count, coverage, date, type } = item;
        if (date === selectedDate) {
          return `${tw.color('amber-800')}`;
        }

        if (coverage?.debt?.value) {
          if (coverage.debt.value > 0.5) {
            return `${tw.color('red-700')}`;
          } else {
            return `${tw.color('red-300')}`;
          }
        }

        if (type === 'subscription') {
          if (count >= 1) {
            return theme.meatBrown;
          }

          return theme.peachYellow;
        }

        if (count >= 1) {
          return theme.blueCrayola;
        }

        return theme.babyBlueEyes;
      }

      // for empty values
      if (colorScheme === 'dark') {
        return `rgba(255, 255, 255, 0.1)`;
      }
      return `rgba(128, 128, 128, 0.1)`;
    },
    [values, colorScheme, selectedDate],
  );

  return pending ? (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={tw.style(`flex flex-row items-center justify-center`, {
        minHeight: HEIGHT_IN_PIXELS,
      })}>
      <VerticalLoadingAnimation
        color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
        style={tw`size-16`}
      />
    </Animated.View>
  ) : (
    <Animated.ScrollView
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
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
              tw`absolute bottom-3.5 left-0 z-10 w-64`,
              { height: (SQUARE_SIZE + SQUARE_GAP) * 7 - SQUARE_GAP },
            ]}>
            <View style={tw`my-auto ml-9 w-12`}>
              <AppIconButton icon="chevron-double-left" onPress={() => setAllDatesVisible(true)} />
            </View>
          </LinearGradient>
        ) : withDescription ? (
          <View style={tw`ml-6 flex flex-col self-center`}>
            <Trans
              components={[
                <AppText
                  key="activity-count"
                  style={tw`text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}
                />,
              ]}
              defaults={t('settings.profile.presence.activity', {
                count: activityCount,
              })}
              parent={AppText}
              style={tw`text-left text-sm font-normal leading-6 text-slate-500 dark:text-neutral-500`}
            />
            {firstActivityDate && (
              <AppText style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}>
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
            strokeWidth: 2, // optional, default 3,
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
          tooltipDataAttrs={(_element) => ({})}
          values={values}
          width={(Math.ceil(squaresCount / 7) + 3) * (SQUARE_SIZE + SQUARE_GAP)}
          onDayPress={({ count, date }) => {
            if (count && date) onDateSelect?.(date as never);
          }}
        />

        <View
          style={[
            tw`mr-6 flex flex-col items-center justify-end gap-px pb-3.5`,
            { height: HEIGHT_IN_PIXELS },
          ]}>
          {Array(7)
            .fill(0)
            .map((_zero, index) => (
              <AppText
                key={`contribution-graph-week-day-${index}`}
                style={[
                  tw`text-center font-normal text-slate-500 dark:text-neutral-500`,
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
