import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import { isNil } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import openMap from 'react-native-open-maps';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import AppRoundedButton from '@/components/AppRoundedButton';
import ModalLayout from '@/components/ModalLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
import ZoombableImage from '@/components/ZoomableImage';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';

export default function CalendarEventPage() {
  useDeviceContext(tw);
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();

  const {
    data: calendarEvents,
    isFetching: isFetchingCalendarEvents,
    refetch: refreshCalendarEvents,
    error: calendarEventsError,
  } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: getCalendarEvents,
  });

  const event = useMemo<CalendarEvent | null>(() => {
    return (
      (!isNil(id) && (calendarEvents || []).find((event) => `${event.id}` === `${id}`)) || null
    );
  }, [calendarEvents]);

  return (
    <ModalLayout from="/events/calendar" title={event?.label || ''}>
      {event ? (
        <>
          <ZoombableImage
            contentFit="cover"
            source={event.picture}
            style={tw`h-44 mx-4 rounded-2xl bg-gray-200 dark:bg-gray-900`}
            transition={300}
          />
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
            <Text style={tw`text-base font-normal text-gray-500 mx-6 mt-6`}>
              {event.description}
            </Text>
          ) : null}

          {event.url ? (
            <View style={tw`mx-6 mt-auto pt-6 pb-2`}>
              <Link asChild href={event.url}>
                <AppRoundedButton style={tw`min-h-14 self-stretch`} suffixIcon="open-in-new">
                  <Text style={tw`text-base font-medium text-black`}>{t('actions.takeALook')}</Text>
                </AppRoundedButton>
              </Link>
            </View>
          ) : null}
        </>
      ) : (
        <>
          <View style={tw`flex flex-col items-center justify-end px-4 grow basis-0`}>
            <TumbleweedRollingAnimation style={tw`h-56 w-full max-w-xs`} />
          </View>
          <View
            style={tw`flex flex-col items-center justify-start px-4 gap-2 grow basis-0 max-w-sm mx-auto`}>
            <Animated.Text
              entering={FadeInLeft.duration(500)}
              numberOfLines={1}
              style={tw`text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
              {t('notFound.title')}
            </Animated.Text>
            <Animated.Text
              entering={FadeInLeft.duration(500).delay(150)}
              numberOfLines={2}
              style={tw`text-base font-normal text-center text-slate-500 dark:text-slate-400`}>
              {t('notFound.description')}
            </Animated.Text>
          </View>
        </>
      )}
    </ModalLayout>
  );
}
