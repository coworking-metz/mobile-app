import LottieView, { LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

const AppLottieView: ForwardRefRenderFunction<LottieView, LottieViewProps> = (props, ref) => {
  const reduceMotion = useReducedMotion();

  return (
    <LottieView
      ref={ref}
      {...(reduceMotion && {
        progress: 1,
      })}
      {...props}
      {...(reduceMotion && {
        autoPlay: false,
      })}
    />
  );
};

export default forwardRef(AppLottieView);
