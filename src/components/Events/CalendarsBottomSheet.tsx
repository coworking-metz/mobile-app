import dayjs from 'dayjs';
import { uniq } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetRef,
  type AppBottomSheetProps,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import { type PeriodType } from '@/components/Events/PeriodBottomSheet';
import ServiceRow from '@/components/Layout/ServiceRow';
import { type CalendarEvent } from '@/services/api/calendar';

const CalendarsBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  Omit<
    AppBottomSheetProps & {
      selected: string | null;
      events: CalendarEvent[];
      period: PeriodType;
      onSelect?: (selected: string | null) => void;
    },
    'children'
  >
> = ({ selected, events, period, onSelect, style, ...props }, forwardedRef) => {
  const { t } = useTranslation();

  const allCalendars = useMemo(() => {
    return uniq(events?.map((e) => e.calendar));
  }, [events]);

  const filteredEventsByPeriod = useMemo(() => {
    const now = dayjs();
    return events.filter(({ start, end }) => {
      switch (period) {
        case 'past':
          return now.isAfter(end);
        case 'day':
          return now.isBefore(end) && now.isSame(start, 'day');
        case 'week':
          return now.isBefore(end) && now.isSame(start, 'week');
        case 'month':
          return now.isBefore(end) && now.isSame(start, 'month');
        default:
          return now.isBefore(end);
      }
    });
  }, [events, period]);

  const getCalendarCount = useCallback(
    (calendar: string) => {
      return filteredEventsByPeriod.filter((event) => event.calendar === calendar).length;
    },
    [filteredEventsByPeriod],
  );

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`py-6`, style]} {...props}>
      <View style={tw`flex w-full flex-col gap-1 py-3`}>
        <AppText style={tw`mb-5 text-center text-xl font-medium text-slate-900 dark:text-gray-200`}>
          {t('events.calendars.label')}
        </AppText>

        {allCalendars.map((calendar) => (
          <ServiceRow
            key={`calendar-option-${calendar}`}
            label={t(`events.detail.author.byCalendar.${calendar}`)}
            selected={selected === calendar}
            style={tw`mx-3 px-3`}
            onPress={() => onSelect?.(calendar)}>
            <View style={tw`rounded bg-gray-300 px-2 py-1 dark:bg-zinc-700`}>
              <AppText style={tw`text-xs font-normal text-slate-900 dark:text-gray-200 `}>
                {getCalendarCount(calendar)}
              </AppText>
            </View>
          </ServiceRow>
        ))}

        <ServiceRow
          label={t('events.calendars.all')}
          selected={selected === null}
          style={tw`mx-3 px-3`}
          onPress={() => onSelect?.(null)}>
          <View style={tw`rounded bg-gray-300 px-2 py-1 dark:bg-zinc-700`}>
            <AppText style={tw`text-xs font-normal text-slate-900 dark:text-gray-200 `}>
              {filteredEventsByPeriod.length}
            </AppText>
          </View>
        </ServiceRow>
      </View>
    </AppBottomSheet>
  );
};

export default forwardRef(CalendarsBottomSheet);
