import AccountAnimation from '../Animations/AccountAnimation';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { View } from 'react-native';
import Animated, { BounceIn, BounceOut, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';

const ProfilePicture = ({
  url,
  loading = false,
  attending,
  style,
}: {
  url?: string;
  loading?: boolean;
  attending?: boolean;
  style?: StyleProps;
}) => {
  return (
    <View style={[tw`relative`, style]}>
      <Animated.View style={tw`h-full w-full rounded-3xl bg-gray-200 overflow-hidden`}>
        {loading ? (
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={`100%`}
            width={`100%`}
          />
        ) : url ? (
          <Animated.Image
            resizeMode="cover"
            source={{ uri: url }}
            style={tw`h-full w-full rounded-3xl bg-gray-200 dark:bg-gray-400 overflow-hidden`}
          />
        ) : (
          <AccountAnimation autoPlay style={tw`h-full w-full bg-gray-200 dark:bg-gray-300`} />
        )}
      </Animated.View>

      {attending && (
        <Animated.View
          entering={BounceIn.duration(1000).delay(300)}
          exiting={BounceOut.duration(1000)}
          style={tw`z-10 h-5 w-5 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -bottom-1 -right-1`}>
          <View style={tw`h-3 w-3 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
        </Animated.View>
      )}
    </View>
  );
};

export default ProfilePicture;
