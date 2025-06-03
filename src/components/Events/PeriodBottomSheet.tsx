import { useBottomSheet } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, { type AppBottomSheetProps } from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { type CalendarEvent } from '@/services/api/calendar';

const PERIODS = ['past', 'day', 'week', 'month', null] as const;
export type PeriodType = (typeof PERIODS)[number];

type PeriodOptionsProps = {
  selected?: PeriodType;
  events: CalendarEvent[];
  onSelect?: (selected: PeriodType) => void;
};

const PeriodOptions = ({ selected, events, onSelect }: PeriodOptionsProps) => {
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
        case 'past':
          const [firstEvent] = events;
          if (firstEvent) {
            return t('events.period.options.past.description', {
              date: dayjs(firstEvent.start).format('ll'),
            });
          }
          break;
        case 'day':
          return t('events.period.options.day.description', {
            date: now.format('dddd'),
          });
        case 'week':
          return t('events.period.options.week.description', {
            from: now.format('dddd DD'),
            to: now.endOf('week').format('dddd DD'),
          });
        case 'month':
          return t('events.period.options.month.description', {
            from: now.format('ll').split(' ').slice(0, 3).join(' '),
            to: now.endOf('month').format('ll').split(' ').slice(0, 3).join(' '),
          });
        case null:
          return t('events.period.options.none.fromToday');
        default:
          break;
      }
      return '';
    },
    [events],
  );

  const getPeriodCount = useCallback(
    (periodType: PeriodType) => {
      const now = dayjs();
      const futureEvents = events.filter((event) => now.isBefore(event.end));
      switch (periodType) {
        case 'past':
          return events.filter((event) => now.isAfter(event.end)).length;
        case 'day':
          return futureEvents.filter((event) => now.isSame(event.start, 'day')).length;
        case 'week':
          return futureEvents.filter((event) => now.isSame(event.start, 'week')).length;
        case 'month':
          return futureEvents.filter((event) => now.isSame(event.start, 'month')).length;
        case null:
          return futureEvents.length;
      }
    },
    [events],
  );

  return (
    <View style={tw`flex flex-col w-full gap-1 py-3`}>
      <AppText style={tw`text-center text-xl text-slate-900 dark:text-gray-200 font-medium mb-5`}>
        {t('events.period.label')}
      </AppText>
      <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
        {t('events.period.previous.label')}
      </AppText>
      <ServiceRow
        description={getPeriodDescription('past')}
        label={t(`events.period.options.past.label`)}
        selected={selected === 'past'}
        style={tw`px-3 mx-3`}
        onPress={() => onPeriodPicked('past')}>
        <View style={tw`bg-gray-300 dark:bg-gray-700 py-1 px-2 rounded`}>
          <AppText style={tw`text-xs font-normal text-slate-900 dark:text-gray-200 `}>
            {getPeriodCount('past')}
          </AppText>
        </View>
      </ServiceRow>

      <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6 mt-6`}>
        {t('events.period.next.label')}
      </AppText>
      {PERIODS.filter((p) => p !== 'past').map((period) => (
        <ServiceRow
          description={getPeriodDescription(period)}
          key={`period-option-${period}`}
          label={t(`events.period.options.${period ?? 'none'}.label`)}
          selected={selected === period}
          style={tw`px-3 mx-3`}
          onPress={() => onPeriodPicked(period)}>
          <View style={tw`bg-gray-300 dark:bg-gray-700 py-1 px-2 rounded`}>
            <AppText style={tw`text-xs font-normal text-slate-900 dark:text-gray-200 `}>
              {getPeriodCount(period)}
            </AppText>
          </View>
        </ServiceRow>
      ))}
    </View>
  );
};

const PeriodBottomSheet = ({
  selected,
  events,
  onSelect,
  ...props
}: Omit<AppBottomSheetProps & PeriodOptionsProps, 'children'>) => {
  return (
    <AppBottomSheet {...props}>
      <PeriodOptions events={events} selected={selected} onSelect={onSelect} />
    </AppBottomSheet>
  );
};
export default PeriodBottomSheet;
