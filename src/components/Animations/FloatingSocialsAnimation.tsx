import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import FloatingSocials from '@/assets/animations/floating-socials.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const FloatingSocialsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorizedSource = useMemo(() => {
    return colouriseLottie(FloatingSocials, {
      // // twitter.Group 1.Fill 1
      // 'assets.1.layers.0.shapes.0.it.1.c.k': innerColor,
      // // be.Group 1.Fill 1
      // 'assets.2.layers.0.shapes.0.it.7.c.k': innerColor,
      // // link.Group 1.Fill 1
      // 'assets.3.layers.0.shapes.0.it.1.c.k': innerColor,
      // // link.Group 2.Fill 1
      // 'assets.3.layers.0.shapes.1.it.2.c.k': innerColor,
      // // facebook.Group_1.Group 1.Fill 1
      // 'assets.4.layers.0.shapes.0.it.0.it.1.c.k': innerColor,
      // // Layer 3.Group 1.Fill 1
      // 'assets.5.layers.0.shapes.0.it.1.c.k': innerColor,
      // // you.Group 1.Fill 1
      // 'assets.6.layers.0.shapes.0.it.2.c.k': innerColor,
      // // pintarest_1.pppp.Fill 1
      // 'assets.7.layers.0.shapes.0.it.1.c.k': innerColor,
      // // whats.Group 1.Fill 1
      // 'assets.8.layers.0.shapes.0.it.1.c.k': innerColor,
      // // whats.Group 2.Fill 1
      // 'assets.8.layers.0.shapes.1.it.2.c.k': innerColor,
    });
  }, []);

  return <AppLottieView ref={ref} autoPlay loop progress={0} {...props} source={colorizedSource} />;
};

export default forwardRef(FloatingSocialsAnimation);
