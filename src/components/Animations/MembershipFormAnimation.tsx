import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import MembershipForm from '@/assets/animations/membership-form.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'>;

const MembershipFormAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const badgeColor = theme.meatBrown;
    const paperColor = (
      tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('slate-300')
    ) as string; // '#d9dfff'
    const backPaperColor = (
      tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-100')
    ) as string; // '#eef1ff'
    const linesColor = (
      tw.prefixMatch('dark') ? tw.color('gray-600') : tw.color('white')
    ) as string; // '#ffffff'
    return colouriseLottie(MembershipForm, {
      // Badge.Star.Group 1.Fill 1
      'assets.0.layers.0.shapes.0.it.1.c.k': badgeColor,
      // Badge.Circle.Group 2.Fill 1
      'assets.0.layers.1.shapes.0.it.1.c.k': '#ffffff',
      // Badge.Zig Zag Circle.Group 3.Stroke 1
      'assets.0.layers.2.shapes.0.it.1.c.k': badgeColor,
      // Badge.Zig Zag Circle.Group 3.Fill 1
      'assets.0.layers.2.shapes.0.it.2.c.k': badgeColor,
      // Document.Page Front 2.Page Front.Fill 1
      'assets.1.layers.0.shapes.0.it.1.c.k': paperColor,
      // Document.Page Line 2.Page Line.Stroke 1
      'assets.1.layers.1.shapes.0.it.6.c.k': linesColor,
      // Document.Page Front.Page Front.Fill 1
      'assets.1.layers.2.shapes.0.it.1.c.k': paperColor,
      // Document.Page Back 2.Page Back.Fill 1
      'assets.1.layers.3.shapes.0.it.1.c.k': backPaperColor,
      // Document.Page Back.Page Back.Fill 1
      'assets.1.layers.4.shapes.0.it.1.c.k': backPaperColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(MembershipFormAnimation);
