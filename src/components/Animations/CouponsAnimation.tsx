import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import BuyCoupons from '@/assets/animations/buy-coupons.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const CouponsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const frontCouponColor = (isDark ? theme.babyBlueEyes : tw.color('blue-200')) as string; // #ffb43f originally
    const backCouponColor = (isDark ? theme.frenchSkyBlue : tw.color('blue-300')) as string; // #ff8645 originally
    const innerColor = (isDark ? tw.color('gray-600') : tw.color('gray-400')) as string; // #ff005d originally
    const starColor = (isDark ? tw.color('gray-300') : tw.color('white')) as string; // #ffffff originally
    const dashColor = (isDark ? tw.color('zinc-900') : tw.color('white')) as string; // #ffffff originally
    return colouriseLottie(BuyCoupons, {
      // // Coupon.Star.Fill 1
      'layers.0.shapes.0.it.1.c.k': starColor,
      // // Coupon.Dash.Fill 1
      'layers.0.shapes.1.it.4.c.k': dashColor,
      // // Coupon.Pink Shape.Fill 1
      'layers.0.shapes.2.it.1.c.k': innerColor,
      // // Coupon.Yellow Shape.Fill 1
      'layers.0.shapes.3.it.1.c.k': frontCouponColor,
      // // Coupon 3.Star.Fill 1
      'layers.1.shapes.0.it.1.c.k': starColor,
      // // Coupon 3.Pink Shape.Fill 1
      'layers.1.shapes.1.it.1.c.k': innerColor,
      // // Coupon 3.Yellow Shape.Fill 1
      'layers.1.shapes.2.it.1.c.k': backCouponColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(CouponsAnimation);
