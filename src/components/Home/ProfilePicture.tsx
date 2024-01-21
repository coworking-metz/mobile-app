import AccountAnimation from '../Animations/AccountAnimation';
import { Image } from 'expo-image';
import React from 'react';
import Animated, { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import useAuthStore from '@/stores/auth';

const ProfilePicture = ({ style }: { picture?: string; style?: StyleProps }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <Animated.View
      sharedTransitionTag="profilePicture"
      style={[tw`relative bg-gray-200 rounded-full h-12 w-12 overflow-hidden`, style]}>
      {user?.picture ? (
        <Image
          contentFit="cover"
          contentPosition={'top center'}
          source={user.picture}
          style={tw`h-full`}
          transition={1000}
        />
      ) : (
        <AccountAnimation autoPlay style={tw`h-full w-full`} />
      )}
    </Animated.View>
  );
};

export default ProfilePicture;
