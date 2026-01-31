import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import SocialMediaReactions from '@/assets/animations/social-media-reactions.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & {
  backgroundColor?: string;
};

const SocialMediaReactionsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { backgroundColor, ...props },
  ref,
) => {
  const colorizedSource = useMemo(() => {
    const defaultBackgroundColor = '#ffffff';
    return colouriseLottie(SocialMediaReactions, {
      // // Layer 3.Group 1.Fill 1
      // 'layers.0.shapes.0.it.1.c.k': '#ffffff',
      'layers.0.shapes.0.it.1.c.k': backgroundColor ?? defaultBackgroundColor,
      // // Layer 3.Group 2.Fill 1
      // 'layers.0.shapes.1.it.1.c.k': '#ed1c24',
      // // Layer 2.Group 1.Group 1.Group 1.Fill 1
      // 'layers.1.shapes.0.it.0.it.0.it.2.c.k': '#ffffff',
      'layers.1.shapes.0.it.0.it.0.it.2.c.k': backgroundColor ?? defaultBackgroundColor,
      // // Layer 2.Group 2.Fill 1
      // 'layers.1.shapes.1.it.1.c.k': '#166cf7',
      // // Layer 1.Group 1.Group 1.Fill 1
      // 'layers.2.shapes.0.it.0.it.1.c.k': '#ffffff',
      'layers.2.shapes.0.it.0.it.1.c.k': backgroundColor ?? defaultBackgroundColor,
      // // Layer 1.Group 1.Group 2.Fill 1
      // 'layers.2.shapes.0.it.1.it.1.c.k': '#ffffff',
      'layers.2.shapes.0.it.1.it.1.c.k': backgroundColor ?? defaultBackgroundColor,
      // // Layer 1.Group 2.Fill 1
      // 'layers.2.shapes.1.it.1.c.k': '#006eb9',
    });
  }, [backgroundColor]);

  return (
    <AppLottieView
      ref={ref}
      autoPlay
      loop={false}
      progress={0}
      {...props}
      source={colorizedSource}
    />
  );
};

export default forwardRef(SocialMediaReactionsAnimation);
