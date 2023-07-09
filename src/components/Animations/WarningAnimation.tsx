import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { type ForwardRefRenderFunction, useMemo } from 'react';
import tw from 'twrnc';
import SystemOutlineWarningIntro from '@/assets/animations/lordicon/system-outline-warning-intro.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const WarningAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorApplied = color || (tw.color('amber-600') as string);
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(SystemOutlineWarningIntro, {
        // in-warning..primary.design.Group 1.Fill 1
        'assets.0.layers.0.shapes.0.it.2.c.k': colorApplied,
        // in-warning..primary.design.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.1.c.k': colorApplied,
        // in-warning..primary.design.Group 1.Fill 1
        'assets.0.layers.2.shapes.0.it.1.c.k': colorApplied,
        // in-warning..primary.design.Group 1.Stroke 1
        'assets.0.layers.4.shapes.0.it.1.c.k': colorApplied,
        // in-warning..primary.design.Group 1.Stroke 1
        'assets.0.layers.5.shapes.0.it.1.c.k': colorApplied,
        // in-warning..primary.design.Group 1.Stroke 1
        'assets.0.layers.6.shapes.0.it.1.c.k': colorApplied,
      }),
    [],
  );

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default WarningAnimation;
