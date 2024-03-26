import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInLeft, FadeOut } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import AppTouchableScale from '@/components/AppTouchableScale';
import ErrorState from '@/components/ErrorState';
import PeriodBottomSheet, { type PeriodType } from '@/components/Events/PeriodBottomSheet';
import CalendarEmptyState from '@/components/Home/CalendarEmptyState';
import CalendarEventCard from '@/components/Home/CalendarEventCard';
import ModalLayout from '@/components/ModalLayout';
import { isSilentError } from '@/helpers/error';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';

interface EventsGroupedByDate {
  date: string;
  events: CalendarEvent[];
}

const SORTS = ['descending', 'ascending'] as const;
export type SortType = (typeof SORTS)[number];

const PeriodChip = ({ selected, onPress }: { selected: PeriodType; onPress?: () => void }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={tw`flex flex-row items-center justify-center px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-900`}>
        <Text style={tw`text-base font-normal text-slate-900 dark:text-gray-200`}>
          {t(`events.period.options.${selected ?? 'none'}.label`)}
        </Text>
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
          name="chevron-down"
          size={20}
          style={tw`ml-1`}
        />
      </View>
    </TouchableOpacity>
  );
};

const SortChip = ({ selected, onPress }: { selected?: SortType; onPress?: () => void }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tw`flex flex-row items-center justify-center px-4 py-2 rounded-full border-[1px]`,
          selected
            ? tw`bg-amber-50 border-amber-700 dark:bg-amber-950 dark:border-amber-500`
            : tw`bg-gray-200 dark:bg-gray-900 border-transparent`,
        ]}>
        <Text
          style={[
            tw`text-base font-normal `,
            selected
              ? tw`text-amber-700 dark:text-amber-500`
              : tw`text-slate-900 dark:text-gray-200`,
          ]}>
          {selected ? t(`events.sort.options.${selected}.label`) : t('events.sort.label')}
        </Text>

        <MaterialCommunityIcons
          color={
            selected
              ? tw.prefixMatch('dark')
                ? tw.color('amber-500')
                : tw.color('amber-700')
              : tw.prefixMatch('dark')
                ? tw.color('gray-400')
                : tw.color('gray-700')
          }
          name={
            selected === 'ascending'
              ? 'sort-calendar-ascending'
              : selected === 'descending'
                ? 'sort-calendar-descending'
                : 'sort'
          }
          size={20}
          style={tw`ml-1`}
        />
      </View>
    </TouchableOpacity>
  );
};

const Calendar = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { period } = useLocalSearchParams<{ period?: string }>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(null);
  const [hasSelectedPeriodFilter, setSelectedPeriodFilter] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<SortType>('ascending');

  useEffect(() => {
    if (period) {
      setSelectedPeriod(period as PeriodType);
    }
  }, [period]);

  const {
    data: calendarEvents,
    isLoading: isLoadingCalendarEvents,
    isFetching: isFetchingCalendarEvents,
    error: calendarEventsError,
  } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const eventsGroupedByDate = useMemo(() => {
    return (
      calendarEvents?.reduce((groups, event) => {
        const groupFound = groups.find((group) => dayjs(group.date).isSame(event.start, 'day'));

        if (groupFound) {
          return [
            ...groups.filter((group) => group.date !== groupFound.date),
            {
              ...groupFound,
              events: [...groupFound.events, event],
            },
          ];
        }

        return [
          ...groups,
          {
            date: dayjs(event.start).format('YYYY-MM-DD'),
            events: [event],
          },
        ];
      }, [] as EventsGroupedByDate[]) ?? []
    );
  }, [calendarEvents]);

  const filteredEventsGroups = useMemo(() => {
    const now = dayjs();
    return eventsGroupedByDate
      ?.filter((group) => {
        switch (selectedPeriod) {
          case 'past':
            return group.events.some(({ end }) => now.isAfter(end));
          case 'day':
            return (
              group.events.some(({ end }) => now.isBefore(end)) && now.isSame(group.date, 'day')
            );
          case 'week':
            return (
              group.events.some(({ end }) => now.isBefore(end)) && now.isSame(group.date, 'week')
            );
          case 'month':
            return (
              group.events.some(({ end }) => now.isBefore(end)) && now.isSame(group.date, 'month')
            );
          default:
            return group.events.some(({ end }) => now.isBefore(end));
        }
      })
      .sort((a, b) => {
        switch (selectedSort) {
          case 'ascending':
            return dayjs(a.date).isAfter(b.date) ? 1 : -1;
          case 'descending':
            return dayjs(a.date).isAfter(b.date) ? -1 : 1;
          default:
            return 0;
        }
      });
  }, [eventsGroupedByDate, selectedPeriod, selectedSort]);

  return (
    <>
      <ModalLayout title={t('events.calendar.title')}>
        <View style={tw`mb-4`}>
          <ScrollView
            contentContainerStyle={tw`flex flex-row items-center gap-4 px-4`}
            horizontal={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={tw`w-full`}>
            <PeriodChip selected={selectedPeriod} onPress={() => setSelectedPeriodFilter(true)} />
            <SortChip
              selected={selectedSort}
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
        </View>
        <Animated.View exiting={FadeOut.duration(500)} style={tw`mt-4 mx-4 flex flex-col gap-8`}>
          {isLoadingCalendarEvents ? (
            <>
              <CalendarEventCard loading={isLoadingCalendarEvents} style={tw`h-44`} />
              <CalendarEventCard loading={isLoadingCalendarEvents} style={tw`h-44 mt-8`} />
            </>
          ) : filteredEventsGroups?.length ? (
            filteredEventsGroups.map((group) => (
              <View key={`calendar-group-${group.date}`} style={tw`flex flex-col gap-4`}>
                <Animated.Text
                  entering={FadeInLeft.duration(300)}
                  exiting={FadeOut.duration(300)}
                  style={tw`text-sm font-normal uppercase text-slate-500 mx-2`}>
                  {dayjs(group.date).format('dddd LL')}
                </Animated.Text>
                {group.events.map((event) => (
                  <Link
                    asChild
                    href={`/events/${event.id}`}
                    key={`calendar-event-card-${event.id}`}>
                    <AppTouchableScale style={tw`w-full h-44`}>
                      <CalendarEventCard event={event} loading={isFetchingCalendarEvents} />
                    </AppTouchableScale>
                  </Link>
                ))}
              </View>
            ))
          ) : calendarEventsError && !isSilentError(calendarEventsError) ? (
            <ErrorState error={calendarEventsError} title={t('home.calendar.onFetch.fail')} />
          ) : (
            <CalendarEmptyState
              description={t(`events.period.options.${selectedPeriod ?? 'none'}.empty`)}
              style={tw`w-full h-full mt-4`}
            />
          )}
        </Animated.View>
      </ModalLayout>

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
