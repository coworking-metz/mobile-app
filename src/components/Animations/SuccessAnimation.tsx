import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import tw from 'twrnc';
import SystemOutlineCheckIntro from '@/assets/animations/lordicon/system-outline-check-intro.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const SuccessAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(() => {
    const colorApplied = color || (tw.color('emerald-600') as string);
    return colouriseLottie(SystemOutlineCheckIntro, {
      // in-check..primary.design.Group 1.Fill 1
      'assets.0.layers.0.shapes.0.it.1.c.k': colorApplied,
      // in-check..primary.design.Group 1.Stroke 1
      'assets.0.layers.1.shapes.0.it.2.c.k': colorApplied,
      // in-check..primary.design.Group 1.Stroke 1
      'assets.0.layers.2.shapes.0.it.1.c.k': colorApplied,
      // in-check..primary.design.Group 1.Fill 1
      'assets.0.layers.3.shapes.0.it.2.c.k': colorApplied,
      // in-check..primary.design.Group 2.Fill 1
      'assets.0.layers.3.shapes.1.it.1.c.k': colorApplied,
    });
  }, [color]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(SuccessAnimation);
