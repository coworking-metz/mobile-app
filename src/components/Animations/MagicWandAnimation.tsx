import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import MagicWand from '@/assets/animations/magic-wand.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const MagicWandAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorizedSource = useMemo(() => {
    return colouriseLottie(MagicWand, {
      // Star 6.Star.Fill 1
      // 'layers.0.shapes.0.it.1.c.k': '#ffb43f',
      // // Star 5.Star.Fill 1
      // 'layers.1.shapes.0.it.1.c.k': '#ffb43f',
      // // Star 4.Star.Fill 1
      // 'layers.2.shapes.0.it.1.c.k': '#ffb43f',
      // // Star 3.Star.Fill 1
      // 'layers.3.shapes.0.it.1.c.k': '#ffb43f',
      // // Star 2.Star.Fill 1
      // 'layers.4.shapes.0.it.1.c.k': '#ffb43f',
      // // Star.Star.Fill 1
      // 'layers.5.shapes.0.it.1.c.k': '#ffb43f',
      // // Magic.Star.Fill 1
      // 'layers.6.shapes.0.it.1.c.k': '#ffb43f',
      // // Magic.Stick.Fill 1
      // 'layers.6.shapes.1.it.1.c.k': '#c1466c',
    });
  }, []);

  return <AppLottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(MagicWandAnimation);
