import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import tw from 'twrnc';
import Medal from '@/assets/animations/medal-ticked.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const MedalTickedAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  // const colorizedSource = useMemo(() => {
  //   const colorApplied = color || (tw.color('gray-600') as string);
  //   return colouriseLottie(Medal, {
  //     // // Coupon.Star.Fill 1
  //     // "layers.0.shapes.0.it.1.c.k": "#ffffff",
  //     // // Coupon.Dash.Fill 1
  //     // "layers.0.shapes.1.it.4.c.k": "#ffffff",
  //     // // Coupon.Pink Shape.Fill 1
  //     // "layers.0.shapes.2.it.1.c.k": "#ff005d",
  //     // // Coupon.Yellow Shape.Fill 1
  //     // "layers.0.shapes.3.it.1.c.k": "#ffb43f",
  //     // // Coupon 3.Star.Fill 1
  //     // "layers.1.shapes.0.it.1.c.k": "#ffffff",
  //     // // Coupon 3.Pink Shape.Fill 1
  //     // "layers.1.shapes.1.it.1.c.k": "#ff005d",
  //     // // Coupon 3.Yellow Shape.Fill 1
  //     // "layers.1.shapes.2.it.1.c.k": "#ff8645",
  //   });
  // }, [color]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={Medal} />;
};

export default forwardRef(MedalTickedAnimation);
