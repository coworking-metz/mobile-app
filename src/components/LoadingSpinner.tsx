import React, { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  AnimatedProps,
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';

const LoadingSpinner = ({
  style,
  beamSize = 4,
  ...props
}: AnimatedProps<{ style?: StyleProp<ViewStyle> }> & { beamSize?: 2 | 4 | 8 }) => {
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }),
    [rotation],
  );

  useEffect(() => {
    cancelAnimation(rotation);
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, {
        easing: Easing.linear,
        duration: 1000,
      }),
      Infinity,
    );
  }, []);

  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[tw`relative h-6 w-6 justify-center items-center`, style]}
      {...props}>
      <View
        style={[tw`w-full h-full rounded-full border-2 border-gray-400 dark:border-gray-500`]}
      />

      <Animated.View
        style={[
          // https://github.com/facebook/react-native/issues/19981#issuecomment-1185341829
          tw`absolute w-full h-full rounded-full border-t-amber-400 border-l-0 border-r-0 border-b-0`,
          { borderTopWidth: beamSize },
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
};

export default LoadingSpinner;
