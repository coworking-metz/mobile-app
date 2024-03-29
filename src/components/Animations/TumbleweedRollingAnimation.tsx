import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction } from 'react';
import TumbleweedRolling from '@/assets/animations/tumbleweed-rolling.json';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const CouponsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  return <LottieView ref={ref} autoPlay loop {...props} source={TumbleweedRolling} />;
};

export default forwardRef(CouponsAnimation);
