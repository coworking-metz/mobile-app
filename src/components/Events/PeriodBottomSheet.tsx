import dayjs from 'dayjs';
import React, { forwardRef, ForwardRefRenderFunction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetRef,
  type AppBottomSheetProps,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import { type CalendarEvent } from '@/services/api/calendar';

const PERIODS = ['past', 'day', 'week', 'month', null] as const;
export type PeriodType = (typeof PERIODS)[number];

const PeriodBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  Omit<
    AppBottomSheetProps & {
      selected?: PeriodType;
      events: CalendarEvent[];
      onSelect?: (selected: PeriodType) => void;
    },
    'children'
  >
> = ({ selected, events, onSelect, style, ...props }, forwardedRef) => {
  const { t } = useTranslation();

  const onPeriodPicked = useCallback(
    async (newSelected: PeriodType) => {
      onSelect?.(newSelected);
    },
    [onSelect],
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
    <AppBottomSheet ref={forwardedRef} style={[tw`py-6`, style]} {...props}>
      <View style={tw`flex w-full flex-col gap-1 py-3`}>
        <AppText style={tw`mb-5 text-center text-xl font-medium text-slate-900 dark:text-gray-200`}>
          {t('events.period.label')}
        </AppText>
        <SectionTitle style={tw`mx-6`} title={t('events.period.previous.label')} />

        <ServiceRow
          description={getPeriodDescription('past')}
          label={t(`events.period.options.past.label`)}
          selected={selected === 'past'}
          style={tw`mx-3 px-3`}
          onPress={() => onPeriodPicked('past')}>
          <View style={tw`rounded bg-gray-300 px-2 py-1 dark:bg-zinc-700`}>
            <AppText style={tw`text-xs font-normal text-slate-900 dark:text-gray-200 `}>
              {getPeriodCount('past')}
            </AppText>
          </View>
        </ServiceRow>

        <SectionTitle style={tw`mx-6 mt-6`} title={t('events.period.next.label')} />
        {PERIODS.filter((p) => p !== 'past').map((period) => (
          <ServiceRow
            description={getPeriodDescription(period)}
            key={`period-option-${period}`}
            label={t(`events.period.options.${period ?? 'none'}.label`)}
            selected={selected === period}
            style={tw`mx-3 px-3`}
            onPress={() => onPeriodPicked(period)}>
            <View style={tw`rounded bg-gray-300 px-2 py-1 dark:bg-zinc-700`}>
              <AppText style={tw`text-xs font-normal text-slate-900 dark:text-gray-200 `}>
                {getPeriodCount(period)}
              </AppText>
            </View>
          </ServiceRow>
        ))}
      </View>
    </AppBottomSheet>
  );
};
export default forwardRef(PeriodBottomSheet);
