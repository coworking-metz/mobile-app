import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import tw from 'twrnc';
import WiredOutlineVerticalLoader from '@/assets/animations/lordicon/wired-outline-vertical-loader.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const VerticalLoadingAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(() => {
    const colorApplied = color || (tw.color('gray-600') as string);
    return colouriseLottie(WiredOutlineVerticalLoader, {
      // Shape Layer 4.Ellipse 1.Stroke 1
      'layers.1.shapes.0.it.2.c.k': colorApplied,
      // Shape Layer 2.Ellipse 1.Stroke 1
      'layers.2.shapes.0.it.2.c.k': colorApplied,
      // Shape Layer 3.Ellipse 1.Stroke 1
      'layers.3.shapes.0.it.2.c.k': colorApplied,
      // Shape Layer 1.Ellipse 1.Stroke 1
      'layers.4.shapes.0.it.2.c.k': colorApplied,
    });
  }, [color]);

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(VerticalLoadingAnimation);
