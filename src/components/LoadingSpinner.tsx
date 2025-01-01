import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

const startRotationAnimation = (durationMs: number, rotationDegree: Animated.Value): void => {
  Animated.loop(
    Animated.timing(rotationDegree, {
      toValue: 360,
      duration: durationMs,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();
};

const LoadingSpinner = ({
  style,
  durationMs = 1000,
}: {
  style?: StyleProp<ViewStyle>;
  durationMs?: number;
}): JSX.Element => {
  const rotationDegree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startRotationAnimation(durationMs, rotationDegree);
  }, [durationMs, rotationDegree]);

  return (
    <View
      accessibilityRole="progressbar"
      style={[tw`relative h-6 w-6 justify-center items-center`, style]}>
      {/* <View style={[tw`w-full h-full rounded-full border-2 opacity-25 border-black`]} /> */}

      <Animated.View
        style={[
          tw`w-full h-full rounded-full border-2 border-l-transparent border-r-transparent border-b-transparent border-t-amber-400 absolute`,
          {
            transform: [
              {
                rotateZ: rotationDegree.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

export default LoadingSpinner;
