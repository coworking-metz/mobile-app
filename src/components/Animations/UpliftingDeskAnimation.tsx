import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import UpliftingDesk from '@/assets/animations/uplifting-desk.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const UpliftingDeskAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorizedSource = useMemo(() => {
    return colouriseLottie(UpliftingDesk, {
      // // Layer 1 Outlines.Group 21.Group 2.Fill 1
      // 'layers.0.shapes.0.it.0.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 4.Fill 1
      // 'layers.0.shapes.0.it.1.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 6.Fill 1
      // 'layers.0.shapes.0.it.2.it.3.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 7.Fill 1
      // 'layers.0.shapes.0.it.3.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 8.Fill 1
      // 'layers.0.shapes.0.it.4.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 9.Fill 1
      // 'layers.0.shapes.0.it.5.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 10.Fill 1
      // 'layers.0.shapes.0.it.6.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 11.Fill 1
      // 'layers.0.shapes.0.it.7.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 12.Fill 1
      // 'layers.0.shapes.0.it.8.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 13.Fill 1
      // 'layers.0.shapes.0.it.9.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 15.Fill 1
      // 'layers.0.shapes.0.it.10.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 17.Fill 1
      // 'layers.0.shapes.0.it.11.it.1.c.k': '#000000',
      // // Layer 1 Outlines.Group 21.Group 19.Fill 1
      // 'layers.0.shapes.0.it.12.it.1.c.k': '#000000',
      // // Layer 1 Outlines 2.Group 22.Group 1.Fill 1
      // 'layers.1.shapes.0.it.0.it.1.c.k': '#8a5100',
      // // Layer 1 Outlines 2.Group 22.Group 3.Fill 1
      // 'layers.1.shapes.0.it.1.it.1.c.k': '#808080',
      // // Layer 1 Outlines 2.Group 22.Group 5.Fill 1
      // 'layers.1.shapes.0.it.2.it.1.c.k': '#808080',
      // // Layer 1 Outlines 2.Group 22.Group 14.Fill 1
      // 'layers.1.shapes.0.it.3.it.1.c.k': '#808080',
      // // Layer 1 Outlines 2.Group 22.Group 16.Fill 1
      // 'layers.1.shapes.0.it.4.it.1.c.k': '#808080',
      // // Layer 1 Outlines 2.Group 22.Group 18.Fill 1
      // 'layers.1.shapes.0.it.5.it.1.c.k': '#808080',
      // // Layer 1 Outlines 2.Group 22.Group 20.Fill 1
      // 'layers.1.shapes.0.it.6.it.1.c.k': '#808080',
    });
  }, []);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(UpliftingDeskAnimation);
