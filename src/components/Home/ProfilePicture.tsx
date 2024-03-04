import AccountAnimation from '../Animations/AccountAnimation';
import React from 'react';
import { View } from 'react-native';
import Animated, { BounceIn, BounceOut, type StyleProps } from 'react-native-reanimated';
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
    <View style={[tw`relative`, style]}>
      {user?.picture ? (
        <Animated.Image
          resizeMode="cover"
          sharedTransitionTag="profilePicture"
          source={{ uri: user?.picture }}
          style={tw`h-full w-full rounded-3xl overflow-hidden`}
        />
      ) : (
        <Animated.View
          sharedTransitionTag="profilePicture"
          style={tw`h-full w-full bg-gray-200 rounded-3xl overflow-hidden`}>
          <AccountAnimation autoPlay style={tw`h-full w-full bg-gray-200`} />
        </Animated.View>
      )}

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
