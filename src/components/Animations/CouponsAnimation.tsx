import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import tw from 'twrnc';
import BuyCoupons from '@/assets/animations/buy-coupons.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const CouponsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(() => {
    return colouriseLottie(BuyCoupons, {
      // // Coupon.Star.Fill 1
      // "layers.0.shapes.0.it.1.c.k": "#ffffff",
      // // Coupon.Dash.Fill 1
      // "layers.0.shapes.1.it.4.c.k": "#ffffff",
      // // Coupon.Pink Shape.Fill 1
      // "layers.0.shapes.2.it.1.c.k": "#ff005d",
      // // Coupon.Yellow Shape.Fill 1
      // "layers.0.shapes.3.it.1.c.k": "#ffb43f",
      // // Coupon 3.Star.Fill 1
      // "layers.1.shapes.0.it.1.c.k": "#ffffff",
      // // Coupon 3.Pink Shape.Fill 1
      // "layers.1.shapes.1.it.1.c.k": "#ff005d",
      // // Coupon 3.Yellow Shape.Fill 1
      // "layers.1.shapes.2.it.1.c.k": "#ff8645",
    });
  }, [color]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(CouponsAnimation);
