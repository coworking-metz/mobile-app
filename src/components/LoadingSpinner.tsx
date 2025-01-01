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

// const startRotationAnimation = (durationMs: number, rotationDegree: Animated.Value): void => {
//   Animated.loop(
//     Animated.timing(rotationDegree, {
//       toValue: 360,
//       duration: durationMs,
//       easing: Easing.linear,
//       useNativeDriver: true,
//     }),
//   ).start();
// };

const LoadingSpinner = ({
  style,
  ...props
}: AnimatedProps<{ style?: StyleProp<ViewStyle> }>): JSX.Element => {
  // const rotationDegree = useRef(new Animated.Value(0)).current;

  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }),
    [rotation],
  );

  useEffect(() => {
    // startRotationAnimation(durationMs, rotationDegree);
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
          tw`absolute w-full h-full rounded-full border-t-amber-400 border-t-4 border-l-0 border-r-0 border-b-0`,
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
};

export default LoadingSpinner;
