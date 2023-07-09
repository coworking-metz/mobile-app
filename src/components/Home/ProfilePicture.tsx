import AccountAnimation from '../Animations/AccountAnimation';
import { Image } from 'expo-image';
import React from 'react';
import Animated, { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import useUserStore from '@/stores/user';

const ProfilePicture = ({ style }: { style?: StyleProps }) => {
  const userPicture = useUserStore((state) => state.profile?.picture);
  return (
    <Animated.View
      sharedTransitionTag="profilePicture"
      style={[tw`relative bg-gray-200 rounded-full h-12 w-12 overflow-hidden`, style]}>
      {userPicture ? (
        <Image
          contentFit="cover"
          contentPosition={'top center'}
          source={userPicture}
          // style={tw`absolute top-0 left-0 bottom-0 right-0 h-[150%]`}
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
