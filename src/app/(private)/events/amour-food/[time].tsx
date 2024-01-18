import { Button } from '@ddx0510/react-native-ui-lib';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { isNil } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import openMap from 'react-native-open-maps';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import tw from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import AppButtonWide from '@/components/AppRoundedButton';
import ModalLayout from '@/components/ModalLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
import ZoombableImage from '@/components/ZoomableImage';
import { theme } from '@/helpers/colors';
import { type AmourFoodEvent, getAmourFoodEvents } from '@/services/api/amour-food';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';
import useAuthStore from '@/stores/auth';

export default function Page() {
  const { time } = useLocalSearchParams();
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const router = useRouter();

  const {
    data: amourFoodEvents,
    isFetching: isFetchingAmourFoodEvents,
    error: amourFoodEventsError,
  } = useQuery({
    queryKey: ['amourFoodEvents'],
    queryFn: getAmourFoodEvents,
    retry: false,
    enabled: !!user,
  });

  const event = useMemo<AmourFoodEvent | null>(() => {
    return (
      (!isNil(time) && amourFoodEvents?.find((event) => `${event.time}` === `${time}`)) || null
    );
  }, [amourFoodEvents]);

  return (
    <ModalLayout from="/events/calendar" title={event?.nom}>
      {event ? (
        <>
          <View style={tw`flex flex-col grow items-stretch w-full`}>
            <ZoombableImage
              contentFit="cover"
              source={event.illustration}
              style={tw`h-40 mx-4 rounded-2xl bg-gray-200 dark:bg-gray-900`}
              transition={300}
            />
            <ServiceRow
              withBottomDivider
              description={t('events.detail.time', {
                startTime: dayjs(event.time).add(12, 'hour').format('LT'),
                endTime: dayjs(event.time).add(13, 'hour').add(30, 'minute').format('LT'),
              })}
              label={t('events.detail.date', {
                date: new Date(event.time),
                formatParams: {
                  date: { weekday: 'long', month: 'long', day: 'numeric' },
                },
              })}
              prefixIcon="calendar-outline"
              style={tw`mt-3 mx-3 px-3`}
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
              <Text style={tw`text-base font-normal text-gray-500 mx-6 mt-2`}>
                {event.description}
              </Text>
            ) : null}
          </View>

          {event.permalink ? (
            <View style={tw`mx-6 mt-auto pt-6 pb-2`}>
              <AppButtonWide
                style={tw`min-h-14 self-stretch`}
                onPress={() => router.push(event.permalink)}>
                <Text style={tw`text-base font-medium`}>{t('actions.takeALook')}</Text>
              </AppButtonWide>
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
