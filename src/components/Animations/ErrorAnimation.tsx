import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import tw from 'twrnc';
import SystemOutlineErrorIntro from '@/assets/animations/lordicon/system-outline-error-intro.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const ErrorAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorApplied = color || (tw.color('red-700') as string);
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(SystemOutlineErrorIntro, {
        // in-error..primary.design.Group 1.Fill 1
        'assets.0.layers.0.shapes.0.it.2.c.k': colorApplied,
        // in-error..primary.design.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.1.c.k': colorApplied,
        // in-error..primary.design.Group 1.Fill 1
        'assets.0.layers.2.shapes.0.it.1.c.k': colorApplied,
        // in-error..primary.design.Group 1.Stroke 1
        'assets.0.layers.3.shapes.0.it.1.c.k': colorApplied,
        // in-error..primary.design.Group 1.Stroke 1
        'assets.0.layers.4.shapes.0.it.1.c.k': colorApplied,
        // in-error..primary.design.Group 1.Stroke 1
        'assets.0.layers.5.shapes.0.it.1.c.k': colorApplied,
      }),
    [],
  );

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(ErrorAnimation);
