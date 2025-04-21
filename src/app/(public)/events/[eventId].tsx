import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as Calendar from 'expo-calendar';
import { Link, useLocalSearchParams } from 'expo-router';
import { isNil } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import openMap from 'react-native-open-maps';
import { FadeInLeft } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import ErrorState from '@/components/ErrorState';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ZoomableImage from '@/components/ZoomableImage';
import { useAppPermissions } from '@/context/permissions';
import { isSilentError } from '@/helpers/error';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';

export default function CalendarEventPage() {
  useDeviceContext(tw);
  const { eventId, _root } = useLocalSearchParams();
  const { t } = useTranslation();
  const renderPermissionsBottomSheet = useAppPermissions();

  const {
    data: calendarEvents,
    isFetching: isFetchingCalendarEvents,
    error: calendarEventsError,
    refetch: refetchCalendarEvents,
  } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
    refetchOnMount: false,
  });

  const event = useMemo<CalendarEvent | null>(() => {
    return (!isNil(eventId) && (calendarEvents || []).find((e) => `${e.id}` === eventId)) || null;
  }, [calendarEvents, eventId]);

  const firstPicture = useMemo(() => {
    const [first] = event?.pictures || [];
    return first;
  }, [event]);

  const firstUrl = useMemo(() => {
    const [first] = event?.urls || [];
    return first;
  }, [event]);

  const onAddToCalendar = useCallback(() => {
    if (event) {
      (async () => {
        const { granted } = await Calendar.requestCalendarPermissionsAsync();
        if (granted) {
          Calendar.createEventInCalendarAsync({
            startDate: new Date(event.start),
            endDate: new Date(event.end),
            title: event.title,
            location: event.location,
            notes: event.description,
          });
        } else {
          renderPermissionsBottomSheet();
        }
      })();
    }
  }, [event]);

  return (
    <ServiceLayout
      contentStyle={tw`pt-4`}
      title={event?.title || ''}
      withBackButton={!_root}
      onRefresh={refetchCalendarEvents}>
      <View style={tw`w-full max-w-xl mx-auto grow`}>
        {event ? (
          <>
            <ZoomableImage
              contentFit="cover"
              source={firstPicture}
              sources={event.pictures}
              style={tw`relative h-44 mx-4 rounded-2xl bg-gray-200 dark:bg-gray-900`}
              transition={300}>
              {event.pictures.length > 1 && (
                <View style={tw`absolute bottom-1.5 right-5.5 bg-black/70 py-1 px-2 rounded-lg`}>
                  <AppText style={tw`text-xs text-gray-200 font-medium`}>
                    {event.pictures.length}
                  </AppText>
                </View>
              )}
            </ZoomableImage>
            <ServiceRow
              withBottomDivider
              description={t('events.detail.time', {
                startTime: dayjs(event.start).format('LT'),
                endTime: dayjs(event.end).format('LT'),
              })}
              label={t('events.detail.date', {
                date: new Date(event.start),
                formatParams: {
                  date: { weekday: 'long', month: 'long', day: 'numeric' },
                },
              })}
              prefixIcon="calendar-outline"
              style={tw`mt-6 mx-3 px-3`}
              suffixIcon="calendar-plus"
              onPress={onAddToCalendar}
            />
            {event.location ? (
              <ServiceRow
                withBottomDivider
                label={event.location}
                prefixIcon="map-marker-outline"
                style={tw`mx-3 px-3`}
                suffixIcon="directions"
                onPress={() => openMap({ query: event.location })}
              />
            ) : null}
            {event.description ? (
              <AppText style={tw`text-base font-normal text-gray-500 mx-6 mt-6`}>
                {event.description}
              </AppText>
            ) : null}

            {firstUrl ? (
              <View style={tw`mt-auto px-6 pt-6`}>
                <Link asChild href={firstUrl}>
                  <AppRoundedButton
                    style={tw`min-h-14 w-full max-w-md self-center`}
                    suffixIcon="open-in-new">
                    <AppText style={tw`text-base font-medium text-black`}>
                      {t('actions.takeALook')}
                    </AppText>
                  </AppRoundedButton>
                </Link>
              </View>
            ) : null}
          </>
        ) : isFetchingCalendarEvents ? (
          <View style={tw`h-44 mx-4 overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-900`}>
            <LoadingSkeleton height={`100%`} width={`100%`} />
          </View>
        ) : calendarEventsError && !isSilentError(calendarEventsError) ? (
          <ErrorState error={calendarEventsError} title={t('home.calendar.onFetch.fail')} />
        ) : (
          <>
            <View style={tw`flex flex-col items-center justify-end px-4 grow basis-0`}>
              <TumbleweedRollingAnimation style={tw`h-56 w-full max-w-xs`} />
            </View>
            <View
              style={tw`flex flex-col items-center justify-start px-4 gap-2 grow basis-0 max-w-sm mx-auto`}>
              <AppText
                entering={FadeInLeft.duration(500)}
                numberOfLines={1}
                style={tw`text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {t('notFound.title')}
              </AppText>
              <AppText
                entering={FadeInLeft.duration(500).delay(150)}
                numberOfLines={2}
                style={tw`text-base font-normal text-center text-slate-500 dark:text-slate-400`}>
                {t('notFound.description')}
              </AppText>
            </View>
          </>
        )}
      </View>
    </ServiceLayout>
  );
}
