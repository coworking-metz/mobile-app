import { useLocalSearchParams, useRouter } from 'expo-router';
import { isNil } from 'lodash';
import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import ModalLayout from '@/components/ModalLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
import ZoombableImage from '@/components/ZoomableImage';
import { theme } from '@/helpers/colors';
import { type CalendarEvent } from '@/services/api/calendar';
import useCalendarStore from '@/stores/calendar';

export default function Page() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();
  const calendarStore = useCalendarStore();

  const event = useMemo<CalendarEvent | null>(() => {
    return (!isNil(id) && calendarStore.events.find((event) => `${event.id}` === `${id}`)) || null;
  }, [calendarStore.events]);

  return (
    <ModalLayout from="/events/calendar" title={event?.label || ''}>
      {event ? (
        <>
          <View style={tw`flex flex-col grow items-stretch w-full`}>
            <ZoombableImage
              contentFit="cover"
              source={event.picture}
              style={tw`h-40 mx-4 rounded-2xl bg-gray-200 dark:bg-gray-900`}
              transition={300}
            />
            <Text style={tw`text-xl text-slate-500 dark:text-slate-400 mx-6 mt-4`}>
              {t('events.detail.date', {
                date: new Date(event.start),
                formatParams: {
                  date: { weekday: 'long', month: 'long', day: 'numeric' },
                },
              })}
            </Text>
            {event.location ? (
              <ServiceRow
                label={event.location}
                prefixIcon="map-marker-outline"
                style={tw`mx-3 px-3`}
                suffixIcon="directions"
              />
            ) : null}
            {event.description ? (
              <Text style={tw`text-base text-gray-500 mx-6 mt-2`}>{event.description}</Text>
            ) : null}
          </View>

          {event.url ? (
            <View style={tw`mx-6 mt-auto pt-6 pb-2`}>
              <Button
                backgroundColor={theme.darkVanilla}
                style={tw`min-h-14 self-stretch`}
                onPress={() => router.push(event.url)}>
                <Text style={tw`text-base font-medium`}>{t('actions.takeALook')}</Text>
              </Button>
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
              style={tw`text-base text-center text-slate-500 dark:text-slate-400`}>
              {t('notFound.description')}
            </Animated.Text>
          </View>
        </>
      )}
    </ModalLayout>
  );
}
