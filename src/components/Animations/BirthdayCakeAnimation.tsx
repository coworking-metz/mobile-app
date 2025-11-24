import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import BirthdayCake from '@/assets/animations/birthday-cake.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const BirthdayCakeAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorizedSource = useMemo(() => {
    return colouriseLottie(BirthdayCake, {
      // // l.S.S
      // 'assets.0.layers.0.shapes.0.it.1.c.k': '#ff773b',
      // // s.P.F
      // 'assets.1.layers.0.shapes.0.it.1.c.k': '#deaaf9',
      // // l.S.S
      // 'assets.1.layers.1.shapes.0.it.1.c.k': '#deaaf9',
      // // s.P.F
      // 'assets.2.layers.0.shapes.0.it.1.c.k': '#ffd039',
      // // l.S.S
      // 'assets.2.layers.1.shapes.0.it.1.c.k': '#ffd039',
      // // s.P.F
      // 'assets.3.layers.0.shapes.0.it.1.c.k': '#ff773b',
      // // l.S.S
      // 'assets.3.layers.1.shapes.0.it.1.c.k': '#ff773b',
      // // t.G.S
      // 'layers.1.shapes.0.it.1.c.k': '#f4c3c3',
      // // t.G.F
      // 'layers.1.shapes.0.it.2.c.k': '#ffffff',
      // // t.G.F
      // 'layers.1.shapes.1.it.1.c.k': '#fbdddd',
      // // t.G.S
      // 'layers.2.shapes.0.it.1.c.k': '#f4c3c3',
      // // t.G.F
      // 'layers.2.shapes.0.it.2.c.k': '#ffffff',
      // // t.G.F
      // 'layers.2.shapes.1.it.1.c.k': '#fbdddd',
      // // Y.G.F
      // 'layers.3.shapes.0.it.1.c.k': '#ffd039',
      // // r.G.F
      // 'layers.4.shapes.0.it.1.c.k': '#ff773b',
      // // C.G.F
      // 'layers.5.shapes.0.it.1.c.k': '#deaaf9',
      // // l.S.S
      // 'layers.6.shapes.0.it.1.c.k': '#ffd03a',
      // // l.S.S
      // 'layers.12.shapes.0.it.1.c.k': '#ffd039',
      // // c.E.S
      // 'layers.13.shapes.0.it.1.c.k': '#deaaf9',
      // // c.E.S
      // 'layers.14.shapes.0.it.1.c.k': '#deaaf9',
    });
  }, []);

  return <AppLottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(BirthdayCakeAnimation);
