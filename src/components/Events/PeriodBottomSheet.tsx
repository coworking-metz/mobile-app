import AppBottomSheet, { type AppBottomSheetProps } from '../AppBottomSheet';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Text, View } from 'react-native';
import tw from 'twrnc';
import ServiceRow from '@/components/Settings/ServiceRow';
import { type CalendarEvent } from '@/services/api/calendar';

const PERIODS = ['day', 'week', 'month', null] as const;
export type PeriodType = (typeof PERIODS)[number];

type PeriodOptionsProps = {
  selected?: PeriodType;
  withPastEvents?: boolean;
  events: CalendarEvent[];
  onSelect?: (selected: PeriodType) => void;
};

const PeriodOptions = ({ selected, withPastEvents, events, onSelect }: PeriodOptionsProps) => {
  const { t } = useTranslation();
  const { close } = useBottomSheet();

  const onPeriodPicked = useCallback(
    async (newSelected: PeriodType) => {
      onSelect?.(newSelected);
      close();
    },
    [onSelect, close],
  );

  const getPeriodDescription = useCallback(
    (periodType: PeriodType) => {
      const now = dayjs();
      switch (periodType) {
        case 'day':
          return t('events.period.options.day.description', {
            date: now.format('dddd'),
          });
        case 'week':
          const weekFrom = withPastEvents ? now.startOf('week') : now;
          return t('events.period.options.week.description', {
            from: weekFrom.format('dddd DD'),
            to: now.endOf('week').format('dddd DD'),
          });
        case 'month':
          const monthFrom = withPastEvents ? now.startOf('month') : now;
          return t('events.period.options.month.description', {
            from: monthFrom.format('ll').split(' ').slice(0, 3).join(' '),
            to: now.endOf('month').format('ll').split(' ').slice(0, 3).join(' '),
          });
        case null:
          if (withPastEvents) {
            const [firstEvent] = events;
            if (firstEvent) {
              return t('events.period.options.none.since', {
                date: dayjs(firstEvent.start).format('LL'),
              });
            }
          } else {
            return t('events.period.options.none.fromToday');
          }

          break;
      }
      return '';
    },
    [events, withPastEvents],
  );

  const getPeriodCount = useCallback(
    (periodType: PeriodType) => {
      const now = dayjs();
      switch (periodType) {
        case 'day':
          return events.filter((event) => now.isSame(event.start, 'day')).length;
        case 'week':
          return events
            .filter((event) => now.isSame(event.start, 'week'))
            .filter((event) => withPastEvents || now.startOf('day').isBefore(event.start, 'day'))
            .length;
        case 'month':
          return events
            .filter((event) => now.isSame(event.start, 'month'))
            .filter((event) => withPastEvents || now.startOf('day').isBefore(event.start, 'day'))
            .length;
        case null:
          return events.filter(
            (event) => withPastEvents || now.startOf('day').isBefore(event.start, 'day'),
          ).length;
      }
    },
    [events, withPastEvents],
  );

  return (
    <View style={tw`flex flex-col w-full gap-1 py-3`}>
      <Text style={tw`text-center text-xl text-slate-900 dark:text-gray-200 font-medium mb-5`}>
        {t('events.period.label')}
      </Text>
      {PERIODS.map((period) => (
        <ServiceRow
          description={getPeriodDescription(period)}
          key={`period-option-${period}`}
          label={t(`events.period.options.${period ?? 'none'}.label`)}
          selected={selected === period}
          style={[tw`px-3 mx-3`]}
          onPress={() => onPeriodPicked(period)}>
          <View style={tw`bg-gray-300 dark:bg-gray-700 py-1 px-2 rounded`}>
            <Animated.Text style={tw`text-xs font-normal text-slate-900 dark:text-gray-200 `}>
              {getPeriodCount(period)}
            </Animated.Text>
          </View>
        </ServiceRow>
      ))}
    </View>
  );
};

const PeriodBottomSheet = ({
  selected,
  withPastEvents,
  events,
  onSelect,
  ...props
}: Omit<AppBottomSheetProps & PeriodOptionsProps, 'children'>) => {
  return (
    <AppBottomSheet {...props}>
      <PeriodOptions
        events={events}
        selected={selected}
        withPastEvents={withPastEvents}
        onSelect={onSelect}
      />
    </AppBottomSheet>
  );
};
export default PeriodBottomSheet;
