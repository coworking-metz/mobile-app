import { Image } from 'expo-image';
import React, { ReactNode, useMemo } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { BounceIn, BounceOut, FadeIn, FadeOut } from 'react-native-reanimated';
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
  attending,
  style,
  initialsStyle,
  children,
}: {
  url?: string;
  name?: string;
  pending?: boolean;
  loading?: boolean;
  attending?: boolean;
  style?: StyleProp<ViewStyle>;
  initialsStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
}) => {
  const initials = useMemo(() => {
    return getInitials(name);
  }, [name]);

  return (
    <View style={[tw`relative`, style]}>
      {loading && (
        <LoadingSpinner
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={tw`absolute h-full w-full`}
        />
      )}

      <Animated.View
        style={tw`z-10 absolute rounded-3xl inset-0.5 bg-gray-300 dark:bg-gray-700 overflow-hidden`}>
        {pending ? (
          <LoadingSkeleton height={`100%`} width={`100%`} />
        ) : url ? (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{ uri: url }}
            style={tw`h-full w-full`}
          />
        ) : initials ? (
          <View
            style={[
              tw`h-full w-full flex items-center justify-center`,
              {
                backgroundColor: getColorFromSeed(initials),
              },
            ]}>
            <AppText
              numberOfLines={1}
              style={[
                tw`text-xl font-bold self-center m-auto`,
                initialsStyle,
                {
                  color: invertColor(getColorFromSeed(initials), true),
                },
              ]}>
              {initials}
            </AppText>
          </View>
        ) : (
          <AccountAnimation autoPlay style={tw`h-full w-full bg-gray-200 dark:bg-gray-300`} />
        )}
      </Animated.View>

      {attending && (
        <Animated.View
          entering={BounceIn.duration(1000).delay(300)}
          exiting={BounceOut.duration(1000)}
          style={tw`z-10 h-5 w-5 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -bottom-0.5 -right-0.5`}>
          <View style={tw`h-3 w-3 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
        </Animated.View>
      )}

      {children}
    </View>
  );
};

export default ProfilePicture;
