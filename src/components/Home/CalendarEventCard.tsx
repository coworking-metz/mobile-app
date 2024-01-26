import AppBlurView from '../AppBlurView';
import dayjs from 'dayjs';
import { Image, ImageBackground } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import AmourFoodSquareLogo from '@/assets/images/amour-food-square.png';
import { type CalendarEvent } from '@/services/api/calendar';

const CalendarEventCard = ({
  event = null,
  loading = false,
  style,
}: {
  event?: CalendarEvent | null;
  loading?: boolean;
  style?: StyleProps | false;
}) => {
  const categorySource = useMemo(() => {
    switch (event?.category) {
      case 'AMOUR_FOOD':
        return AmourFoodSquareLogo;
    }
    return null;
  }, [event]);

  return (
    <View style={[tw`rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-900`, style]}>
      <ImageBackground
        contentFit="cover"
        contentPosition="center"
        source={event?.picture}
        style={tw`w-full h-full flex rounded-2xl overflow-hidden relative`}
        {...(event?.end && dayjs().isAfter(event.end) && { imageStyle: { opacity: 0.5 } })}>
        {loading ? (
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={'100%'}
            width={'100%'}
          />
        ) : event ? (
          <AppBlurView
            intensity={64}
            style={tw`w-full flex flex-row items-center px-3 py-2 mt-auto`}
            tint={tw.prefixMatch('dark') ? 'dark' : 'light'}>
            {categorySource && (
              <View style={[tw`h-10 w-10 bg-white rounded-lg overflow-hidden p-1`]}>
                <Image source={categorySource} style={[tw`h-full w-full`]} />
              </View>
            )}
            <View style={tw`flex flex-col items-stretch grow shrink basis-0 ml-3`}>
              <Text
                numberOfLines={1}
                style={tw`text-base font-light text-slate-800 dark:text-slate-300`}>
                {dayjs(event.start).calendar()}
              </Text>
              <Text
                numberOfLines={1}
                style={tw`text-xl font-medium text-gray-900 dark:text-gray-200`}>
                {event.label}
              </Text>
            </View>
          </AppBlurView>
        ) : null}
      </ImageBackground>
    </View>
  );
};

export default CalendarEventCard;
