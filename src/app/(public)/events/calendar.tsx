import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, View } from 'react-native';
import Animated, { FadeInLeft, FadeOut } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import AppText from '@/components/AppText';
import AppTouchable from '@/components/AppTouchable';
import ErrorState from '@/components/ErrorState';
import PeriodBottomSheet, { type PeriodType } from '@/components/Events/PeriodBottomSheet';
import CalendarEmptyState from '@/components/Home/CalendarEmptyState';
import CalendarEventCard from '@/components/Home/CalendarEventCard';
import { SelectableChip } from '@/components/SelectableChip';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import useAppState from '@/helpers/app-state';
import { isSilentError } from '@/helpers/error';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';

const SORTS = ['descending', 'ascending'] as const;
export type SortType = (typeof SORTS)[number];

const Calendar = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { period } = useLocalSearchParams<{ period?: string }>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(null);
  const [hasSelectedPeriodFilter, setSelectedPeriodFilter] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<SortType>('ascending');
  const activeSince = useAppState();

  useEffect(() => {
    if (period) {
      setSelectedPeriod(period as PeriodType);
    }
  }, [period]);

  const {
    data: calendarEvents,
    isLoading: isLoadingCalendarEvents,
    error: calendarEventsError,
    refetch: refetchCalendarEvents,
  } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const eventsGroupedByDate = useMemo(() => {
    const groups = {} as { [k: string]: CalendarEvent[] };
    calendarEvents?.forEach((calendarEvent) => {
      const startingDate = dayjs(calendarEvent.start).format('YYYY-MM-DD');
      if (groups[startingDate]) {
        groups[startingDate].push(calendarEvent);
      } else {
        groups[startingDate] = [calendarEvent];
      }
    });

    return groups;
  }, [calendarEvents]);

  const filteredEventsGroups = useMemo(() => {
    const now = dayjs();
    return Object.entries(eventsGroupedByDate)
      ?.filter(([date, events]) => {
        switch (selectedPeriod) {
          case 'past':
            return events.some(({ end }) => now.isAfter(end));
          case 'day':
            return events.some(({ end }) => now.isBefore(end)) && now.isSame(date, 'day');
          case 'week':
            return events.some(({ end }) => now.isBefore(end)) && now.isSame(date, 'week');
          case 'month':
            return events.some(({ end }) => now.isBefore(end)) && now.isSame(date, 'month');
          default:
            return events.some(({ end }) => now.isBefore(end));
        }
      })
      .sort(([firstDate], [secondDate]) => {
        switch (selectedSort) {
          case 'ascending':
            return dayjs(firstDate).isAfter(secondDate) ? 1 : -1;
          case 'descending':
            return dayjs(firstDate).isAfter(secondDate) ? -1 : 1;
          default:
            return 0;
        }
      });
  }, [eventsGroupedByDate, selectedPeriod, selectedSort]);

  return (
    <>
      <ServiceLayout
        contentStyle={tw`py-4`}
        title={t('events.calendar.title')}
        onRefresh={refetchCalendarEvents}>
        <ScrollView
          contentContainerStyle={tw`flex flex-row items-center gap-4 px-4`}
          horizontal={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={tw`w-full grow-0 shrink-0`}>
          <SelectableChip
            icon="chevron-down"
            label={t(`events.period.options.${selectedPeriod ?? 'none'}.label`)}
            onPress={() => setSelectedPeriodFilter(true)}
          />
          <SelectableChip
            icon={
              selectedSort === 'ascending'
                ? 'sort-calendar-ascending'
                : selectedSort === 'descending'
                  ? 'sort-calendar-descending'
                  : 'sort'
            }
            label={
              selectedSort
                ? selectedPeriod === 'past'
                  ? selectedSort === 'ascending'
                    ? t('events.sort.options.descending.label')
                    : t('events.sort.options.ascending.label')
                  : t(`events.sort.options.${selectedSort}.label`)
                : t('events.sort.label')
            }
            selected={!!selectedSort}
            onPress={() => {
              const nextSortIndex = SORTS.indexOf(selectedSort) + 1;
              if (nextSortIndex < SORTS.length) {
                setSelectedSort(SORTS[nextSortIndex]);
              } else {
                setSelectedSort(SORTS[0]);
              }
            }}
          />
        </ScrollView>
        <Animated.View exiting={FadeOut.duration(500)} style={tw`mt-4 mx-4 flex flex-col gap-8`}>
          {filteredEventsGroups?.length ? (
            filteredEventsGroups.map(([date, events]) => (
              <View key={`calendar-group-${date}`} style={tw`flex flex-col gap-4`}>
                <AppText
                  entering={FadeInLeft.duration(300)}
                  exiting={FadeOut.duration(300)}
                  style={tw`text-sm font-normal uppercase text-slate-500 mx-2`}>
                  {dayjs(date).format('dddd LL')}
                </AppText>
                {events.map((event) => (
                  <Link
                    asChild
                    href={`/events/${event.id}`}
                    key={`calendar-event-card-${event.id}`}>
                    <AppTouchable style={tw`w-full h-44`}>
                      <CalendarEventCard activeSince={activeSince} event={event} />
                    </AppTouchable>
                  </Link>
                ))}
              </View>
            ))
          ) : isLoadingCalendarEvents ? (
            <>
              <CalendarEventCard loading={isLoadingCalendarEvents} style={tw`h-44`} />
              <CalendarEventCard loading={isLoadingCalendarEvents} style={tw`h-44 mt-8`} />
            </>
          ) : calendarEventsError && !isSilentError(calendarEventsError) ? (
            <ErrorState error={calendarEventsError} title={t('home.calendar.onFetch.fail')} />
          ) : (
            <CalendarEmptyState
              description={t(`events.period.options.${selectedPeriod ?? 'none'}.empty`)}
              style={tw`w-full h-full mt-4`}
            />
          )}
        </Animated.View>
      </ServiceLayout>

      {hasSelectedPeriodFilter && (
        <PeriodBottomSheet
          enableContentPanningGesture={Platform.OS !== 'ios'}
          events={calendarEvents || []}
          selected={selectedPeriod}
          onClose={() => setSelectedPeriodFilter(false)}
          onSelect={(p) => {
            setSelectedSort(p === 'past' ? 'descending' : 'ascending');
            setSelectedPeriod(p);
          }}
        />
      )}
    </>
  );
};

export default Calendar;
