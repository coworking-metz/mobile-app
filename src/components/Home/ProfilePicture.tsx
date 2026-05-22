import dayjs from 'dayjs';
import { Image, ImageStyle } from 'expo-image';
import React, { ReactNode, useMemo } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import AccountAnimation from '@/components/Animations/AccountAnimation';
import AppText from '@/components/AppText';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { invertColor } from '@/helpers/colors';
import { getInitials } from '@/helpers/text';

// https://uicolors.app/generate/F9B000
const INITIALS_BACKGROUND_COLOR_PALETTE = [
  // '#fffeea',
  // '#fff9c5',
  '#fff385',
  '#ffe646',
  '#ffd51b',
  '#f9b000',
  '#e28a00',
  '#e28a00',
  '#bb6102',
  '#984a08',
  // '#7c3d0b',
  // '#481f00',
];

const getColorFromSeed = (seed: string) => {
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(hash) % INITIALS_BACKGROUND_COLOR_PALETTE.length;
  return INITIALS_BACKGROUND_COLOR_PALETTE[index];
};

const ProfilePicture = ({
  url,
  name,
  loading = false,
  pending = false,
  style,
  initialsStyle,
  pictureStyle,
  children,
}: {
  url?: string;
  name?: string;
  pending?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  initialsStyle?: StyleProp<TextStyle>;
  pictureStyle?: StyleProp<ImageStyle>;
  children?: ReactNode;
}) => {
  const initials = useMemo(() => {
    return getInitials(name);
  }, [name]);

  return (
    <Animated.View style={[tw`relative`, style]}>
      {loading && (
        <LoadingSpinner
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={tw`absolute h-full w-full`}
        />
      )}

      <Animated.View style={tw`z-10 absolute inset-0.5 overflow-hidden`}>
        {pending ? <LoadingSkeleton height={`100%`} width={`100%`} /> : null}

        {url ? (
          <Image
            cachePolicy="memory"
            contentFit="cover"
            source={{
              uri: url,
              cacheKey: `${url}-${dayjs().format('YYYY-MM-DD')}`,
            }}
            style={[tw`absolute h-full w-full z-10`, pictureStyle]}
          />
        ) : null}

        {initials ? (
          <View
            style={[
              tw`h-full w-full flex items-center justify-center`,
              !url
                ? {
                    backgroundColor: getColorFromSeed(initials),
                  }
                : tw`bg-gray-200 dark:bg-zinc-700/50`,
              pictureStyle,
            ]}>
            <AppText
              numberOfLines={1}
              style={[
                tw`text-xl font-bold self-center m-auto`,
                initialsStyle,
                !url
                  ? { color: invertColor(getColorFromSeed(initials), true) }
                  : tw`text-gray-700 dark:text-gray-300`,
              ]}>
              {initials}
            </AppText>
          </View>
        ) : (
          <AccountAnimation
            autoPlay
            color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-900')}
            style={[tw`h-full w-full bg-gray-200 dark:bg-zinc-700/50`, pictureStyle]}
          />
        )}
      </Animated.View>

      {children}
    </Animated.View>
  );
};

export default ProfilePicture;
