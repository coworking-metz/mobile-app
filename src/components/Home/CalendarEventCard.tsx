import AppBlurView from '../AppBlurView';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Image, ImageBackground } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { BounceIn, BounceOut, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import AmourFoodSquareLogo from '@/assets/images/amour-food-square.png';
import CoworkingLogo from '@/assets/images/icon.png';
import { theme } from '@/helpers/colors';
import { type CalendarEvent } from '@/services/api/calendar';

const AmourFoodIcon = () => {
  return (
    <View style={[tw`h-10 w-10 bg-white rounded-lg overflow-hidden p-1`]}>
      <Image source={AmourFoodSquareLogo} style={[tw`h-full w-full`]} />
    </View>
  );
};

const CoworkingIcon = () => {
  return (
    <View style={[tw`h-10 w-10 rounded-lg overflow-hidden`, { backgroundColor: theme.meatBrown }]}>
      <Image source={CoworkingLogo} style={[tw`h-full w-full`]} />
    </View>
  );
};

const CalendarEventCard = ({
  event = null,
  loading = false,
  style,
  activeSince,
}: {
  event?: CalendarEvent | null;
  loading?: boolean;
  style?: StyleProps | false;
  activeSince?: string;
}) => {
  const eventIcon = useMemo(() => {
    switch (event?.calendar) {
      case 'AMOUR_FOOD':
        return <AmourFoodIcon />;
      case 'COWORKING':
        return <CoworkingIcon />;
    }
    return null;
  }, [event]);

  const firstPicture = useMemo(() => {
    const [first] = event?.pictures || [];
    return first;
  }, [event]);
  const { t } = useTranslation();
  const isFocus = useIsFocused();

  const date = useMemo(() => {
    if (!event) return null;

    const now = dayjs();
    if (now.isBetween(event.start, event.end)) {
      return t('home.calendar.event.ends', { duration: now.to(event.end) });
    }

    if (Math.abs(dayjs().diff(event.start, 'hour')) < 2) {
      return dayjs(event.start).fromNow();
    }

    return dayjs(event.start).calendar();
  }, [event?.start, event?.end, isFocus, activeSince]);

  return (
    <View style={[tw`relative rounded-2xl  bg-gray-200 dark:bg-gray-900`, style]}>
      <ImageBackground
        contentFit="cover"
        contentPosition="center"
        source={firstPicture}
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
            {eventIcon}
            <View style={tw`flex flex-col items-stretch grow shrink basis-0 ml-3`}>
              {date && (
                <Text
                  numberOfLines={1}
                  style={tw`text-base font-light text-slate-800 dark:text-slate-300`}>
                  {`${date.slice(0, 1).toUpperCase()}${date.slice(1)}`}
                </Text>
              )}
              <Text
                numberOfLines={1}
                style={tw`text-xl font-medium text-gray-900 dark:text-gray-200`}>
                {event.title}
              </Text>
            </View>
          </AppBlurView>
        ) : null}
      </ImageBackground>
      {dayjs().isBetween(event?.start, event?.end) && (
        <Animated.View
          entering={BounceIn.duration(1000).delay(300)}
          exiting={BounceOut.duration(1000)}
          style={tw`z-10 h-7 w-7 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -bottom-2 -right-2`}>
          <View style={tw`h-4 w-4 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
        </Animated.View>
      )}
    </View>
  );
};

export default CalendarEventCard;
