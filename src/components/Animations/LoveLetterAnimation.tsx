import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import LoveLetter from '@/assets/animations/love-letter.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const LoveLetterAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    return colouriseLottie(LoveLetter, {
      // // right line.Group 1.Stroke 1
      // 'layers.0.shapes.0.it.1.c.k': '#512112',
      // // left line.Group 1.Stroke 1
      // 'layers.1.shapes.0.it.1.c.k': '#512112',
      // // closed flap.Group 1.Fill 1
      // 'layers.2.shapes.0.it.1.c.k': '#fbb03b',
      // // shade.Group 1.Fill 1
      // 'layers.3.shapes.0.it.1.c.k': '#e69b33',
      // // base.Group 1.Fill 1
      // 'layers.4.shapes.0.it.3.c.k': '#512112',
      // // base.Group 2.Fill 1
      // 'layers.4.shapes.1.it.1.c.k': '#fbb03b',
      // // card.Group 1.Fill 1
      // 'layers.5.shapes.0.it.1.c.k': '#ff5a79',
      // // card.Group 2.Stroke 1
      // 'layers.5.shapes.1.it.1.c.k': '#512112',
      // // card.Group 3.Fill 1
      // 'layers.5.shapes.2.it.1.c.k': '#f9ebdc',
      // // top line.Shape 1.Stroke 1
      // 'layers.6.shapes.0.it.1.c.k': '#522213',
      // // top line.Shape 1.Fill 1
      // 'layers.6.shapes.0.it.2.c.k': '#15cdee',
      // // back side.Group 1.Fill 1
      // 'layers.7.shapes.0.it.1.c.k': '#512112',
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} progress={0} {...props} source={colorizedSource} />;
};

export default forwardRef(LoveLetterAnimation);
