import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, type ViewProps } from 'react-native';
import Animated, {
  AnimatedProps,
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';

const LoadingProgressBar = ({
  style,
  width = 80,
}: {
  width?: number;
  style?: AnimatedProps<ViewProps>['style'];
}) => {
  const [fullWidth, setFullWidth] = useState(0);
  const translation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: interpolate(translation.value, [0, 1], [-width, fullWidth]) }],
    }),
    [translation, fullWidth],
  );

  useEffect(() => {
    cancelAnimation(translation);
    translation.value = 0;
    translation.value = withRepeat(
      withTiming(1, {
        easing: Easing.linear,
        duration: 1_500,
      }),
      Infinity,
    );
  }, []);

  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[tw`relative h-[px] overflow-hidden`, style]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setFullWidth(nativeEvent.layout.width)}>
      <Animated.View
        style={[
          // https://github.com/facebook/react-native/issues/19981#issuecomment-1185341829
          tw`absolute h-full bg-amber-400`,
          !isNil(width) && { width },
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
};

export default LoadingProgressBar;
