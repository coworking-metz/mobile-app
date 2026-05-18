import dayjs from 'dayjs';
import { BlurTargetView } from 'expo-blur';
import { Image, ImageBackground } from 'expo-image';
import { useIsFocused } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import AmourFoodSquareLogo from '@/assets/images/amour-food-square.png';
import BliiidaSquareLogo from '@/assets/images/bliiida-square.png';
import CoworkingLogo from '@/assets/images/icon/icon-light-1024.png';
import AppBlurView from '@/components/AppBlurView';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { theme } from '@/helpers/colors';
import { type CalendarEvent } from '@/services/api/calendar';

export const AmourFoodIcon = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return (
    <View style={[tw`h-10 w-10 bg-white rounded-lg overflow-hidden p-1`, style]}>
      <Image source={AmourFoodSquareLogo} style={[tw`h-full w-full`]} />
    </View>
  );
};

export const CoworkingIcon = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return (
    <View
      style={[
        tw`h-10 w-10 rounded-lg overflow-hidden`,
        { backgroundColor: theme.meatBrown },
        style,
      ]}>
      <Image source={CoworkingLogo} style={[tw`h-full w-full`]} />
    </View>
  );
};

export const BliiidaIcon = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return (
    <View style={[tw`h-10 w-10 bg-black rounded-lg overflow-hidden p-0.5`, style]}>
      <Image source={BliiidaSquareLogo} style={[tw`h-full w-full`]} />
    </View>
  );
};

const CalendarEventCard = ({
  event = null,
  loading = false,
  style,
  children,
}: {
  event?: CalendarEvent | null;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) => {
  const eventIcon = useMemo(() => {
    switch (event?.calendar) {
      case 'AMOUR_FOOD':
        return <AmourFoodIcon />;
      case 'COWORKING':
        return <CoworkingIcon />;
      case 'BLIIIDA':
        return <BliiidaIcon />;
    }
    return null;
  }, [event]);

  const firstPicture = useMemo(() => {
    const [first] = event?.pictures || [];
    return first;
  }, [event]);
  const { t } = useTranslation();
  const isFocus = useIsFocused();
  const activeSince = useAppState();
  const blurTargetRef = useRef<View | null>(null);

  const date = useMemo(() => {
    if (!event) return null;

    const now = dayjs();
    if (now.isBetween(event.start, event.end)) {
      return t('home.calendar.event.ends', { duration: now.to(event.end) });
    }

    const diffFromNow = now.diff(event.start, 'hour');
    if (Math.abs(diffFromNow) < 2) {
      return dayjs(diffFromNow <= 0 ? event.start : event.end).fromNow();
    }

    if (dayjs(event.start).diff(event.end, 'hours', true) % 24 === 0) {
      return dayjs(event.start).format('dddd D MMMM');
    }

    return dayjs(event.start).calendar();
  }, [event?.start, event?.end, isFocus, activeSince]);

  return (
    <View style={[tw`relative`, style]}>
      <AppSquircleView style={tw`rounded-3xl overflow-hidden bg-gray-300 dark:bg-zinc-700`}>
        <BlurTargetView ref={blurTargetRef} style={tw`w-full h-full flex relative`}>
          <ImageBackground
            cachePolicy="memory"
            contentFit="cover"
            contentPosition="center"
            source={{
              uri: firstPicture,
              cacheKey: `${firstPicture}-${dayjs().format('YYYY-MM-DD')}`,
            }}
            style={tw`w-full h-full flex relative`}
            {...(event?.end && dayjs().isAfter(event.end) && { imageStyle: { opacity: 0.5 } })}>
            {loading ? <LoadingSkeleton height={'100%'} width={'100%'} /> : null}
          </ImageBackground>
        </BlurTargetView>

        {!loading && event ? (
          <AppBlurView
            blurTarget={blurTargetRef}
            radius={40}
            style={tw`absolute inset-x-0 bottom-0 flex flex-row gap-3 items-center px-4 py-2`}>
            {eventIcon}
            <View style={tw`flex flex-col items-stretch grow shrink basis-0`}>
              {date && (
                <AppText
                  numberOfLines={1}
                  style={tw`text-base font-light text-slate-800 dark:text-slate-300`}>
                  {`${date.slice(0, 1).toUpperCase()}${date.slice(1)}`}
                </AppText>
              )}
              <AppText
                numberOfLines={1}
                style={tw`text-xl font-medium text-gray-900 dark:text-gray-200`}>
                {event.title}
              </AppText>
            </View>
          </AppBlurView>
        ) : null}
      </AppSquircleView>

      {children}
    </View>
  );
};

export default CalendarEventCard;
