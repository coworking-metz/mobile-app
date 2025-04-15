import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import FloatingSocials from '@/assets/animations/floating-socials.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const FloatingSocialsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const innerColor = (isDark ? tw.color('black') : tw.color('white')) as string; // "#ffffff" originally
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
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(FloatingSocialsAnimation);
