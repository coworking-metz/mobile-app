import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';
import { Image, ImageBackground } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { type AmourFoodEvent } from '@/services/api/amour-food';

const CalendarEventCard = ({
  event = null,
  style,
}: {
  event?: AmourFoodEvent | null;
  style?: StyleProps | false;
}) => {
  const { t } = useTranslation();

  return (
    <View style={[tw`rounded-2xl overflow-hidden`, style]}>
      {event ? (
        <ImageBackground
          contentFit="cover"
          contentPosition="center"
          source={event.illustration}
          style={tw`w-full h-56 flex rounded-2xl overflow-hidden relative`}>
          <BlurView
            intensity={64}
            style={tw`w-full flex flex-row items-center px-3 py-2 mt-auto`}
            tint={tw.prefixMatch('dark') ? 'dark' : 'light'}>
            <View style={[tw`h-10 w-10 bg-white rounded-lg overflow-hidden p-1`]}>
              <Image
                source={require('@/assets/images/amour-food-square.png')}
                style={[tw`h-full w-full`]}
              />
            </View>
            <View style={tw`flex flex-col items-start shrink-1 ml-3`}>
              <Text
                numberOfLines={1}
                style={tw`text-base font-light text-slate-800 dark:text-slate-300`}>
                {dayjs(event.time).isBetween(dayjs(), dayjs().endOf('day').add(1, 'day'), 'day')
                  ? dayjs(event.time).calendar()
                  : t('home.calendar.event.date', {
                      date: new Date(event.time),
                      formatParams: {
                        date: { weekday: 'long', month: 'long', day: 'numeric' },
                      },
                    })}
              </Text>
              <Text
                numberOfLines={1}
                style={tw`text-xl font-medium text-gray-900 dark:text-gray-200`}>
                {event.nom}
              </Text>
            </View>
          </BlurView>
        </ImageBackground>
      ) : null}
    </View>
  );
};

export default CalendarEventCard;
