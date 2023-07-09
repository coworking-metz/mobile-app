import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import tw from 'twrnc';
import SystemOutlineInfoIntro from '@/assets/animations/lordicon/system-outline-info-intro.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const InfoAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorApplied = color || (tw.color('blue-500') as string);
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(SystemOutlineInfoIntro, {
        // in-info..primary.design.Group 1.Fill 1
        'assets.0.layers.0.shapes.0.it.2.c.k': colorApplied,
        // in-info..primary.design.Group 2.Fill 1
        'assets.0.layers.0.shapes.1.it.1.c.k': colorApplied,
        // in-info..primary.design.Group 3.Fill 1
        'assets.0.layers.0.shapes.2.it.1.c.k': colorApplied,
        // in-info..primary.design.Group 1.Stroke 1
        'assets.0.layers.1.shapes.0.it.1.c.k': colorApplied,
        // in-info..primary.design.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.2.c.k': colorApplied,
        // in-info..primary.design.Group 1.Stroke 1
        'assets.0.layers.2.shapes.0.it.1.c.k': colorApplied,
        // in-info..primary.design.Group 1.Stroke 1
        'assets.0.layers.3.shapes.0.it.1.c.k': colorApplied,
      }),
    [],
  );

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(InfoAnimation);
