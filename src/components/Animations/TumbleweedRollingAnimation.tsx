import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import TumbleweedRolling from '@/assets/animations/tumbleweed-rolling.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const TumbleweedRollingAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => colouriseLottie(TumbleweedRolling, {}), [colorScheme]);

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(TumbleweedRollingAnimation);
