import AccountAnimation from '../Animations/AccountAnimation';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import Animated, { BounceIn, BounceOut, FadeIn, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import useAuthStore from '@/stores/auth';

const ProfilePicture = ({
  style,
  attending,
}: {
  picture?: string;
  attending?: boolean;
  style?: StyleProps;
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <Animated.View
      sharedTransitionTag="profilePicture"
      style={[tw`flex flex-col h-12 w-12 relative`, style]}>
      {user?.picture ? (
        <Image
          contentFit="cover"
          contentPosition={'top center'}
          source={user?.picture}
          style={tw`w-full h-full flex rounded-3xl overflow-hidden`}
          transition={1000}
        />
      ) : (
        <AccountAnimation
          autoPlay
          style={tw`h-full w-full rounded-3xl overflow-hidden bg-gray-200`}
        />
      )}
      {!attending && (
        <Animated.View
          entering={BounceIn.duration(1000)}
          exiting={BounceOut.duration(1000)}
          style={tw`z-10 h-5 w-5 bg-gray-100 dark:bg-black rounded-full absolute flex items-center justify-center -bottom-1 -right-1`}>
          <View style={tw`h-3 w-3 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default ProfilePicture;
