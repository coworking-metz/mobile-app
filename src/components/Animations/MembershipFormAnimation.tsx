import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import MembershipFormBadged from '@/assets/animations/membership-form-badged.json';
import MembershipFormTicked from '@/assets/animations/membership-form-ticked.json';
import MembershipForm from '@/assets/animations/membership-form.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & {
  valid?: boolean;
  active?: boolean;
};

const MembershipFormAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { valid, active, ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const badgeColor = theme.meatBrown;
    const checkColor = (
      tw.prefixMatch('dark') ? tw.color('emerald-600') : tw.color('emerald-500')
    ) as string;
    const paperColor = (
      tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('slate-300')
    ) as string; // '#d9dfff'
    const backPaperColor = (
      tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-100')
    ) as string; // '#eef1ff'
    const linesColor = (
      tw.prefixMatch('dark') ? tw.color('gray-600') : tw.color('white')
    ) as string; // '#ffffff'
    const documentIndex = active ? 2 : valid ? 1 : 0;
    return colouriseLottie(
      active ? MembershipFormBadged : valid ? MembershipFormTicked : MembershipForm,
      {
        ...(valid && {
          // Check.Check.Group 1.Stroke 1
          'assets.0.layers.0.shapes.0.it.1.c.k': '#ffffff',
          // Check.Circle.Group 2.Fill 1
          'assets.0.layers.1.shapes.0.it.1.c.k': checkColor,
        }),
        ...(active && {
          // Badge.Star.Group 1.Fill 1
          'assets.1.layers.0.shapes.0.it.1.c.k': badgeColor,
          // Badge.Circle.Group 2.Fill 1
          'assets.1.layers.1.shapes.0.it.1.c.k': '#ffffff',
          // Badge.Zig Zag Circle.Group 3.Stroke 1
          'assets.1.layers.2.shapes.0.it.1.c.k': badgeColor,
          // Badge.Zig Zag Circle.Group 3.Fill 1
          'assets.1.layers.2.shapes.0.it.2.c.k': badgeColor,
        }),
        // Document.Page Front 2.Page Front.Fill 1
        [`assets.${documentIndex}.layers.0.shapes.0.it.1.c.k`]: paperColor,
        // Document.Page Line 2.Page Line.Stroke 1
        [`assets.${documentIndex}.layers.1.shapes.0.it.6.c.k`]: linesColor,
        // Document.Page Front.Page Front.Fill 1
        [`assets.${documentIndex}.layers.2.shapes.0.it.1.c.k`]: paperColor,
        // Document.Page Back 2.Page Back.Fill 1
        [`assets.${documentIndex}.layers.3.shapes.0.it.1.c.k`]: backPaperColor,
        // Document.Page Back.Page Back.Fill 1
        [`assets.${documentIndex}.layers.4.shapes.0.it.1.c.k`]: backPaperColor,
      },
    );
  }, [colorScheme, valid, active]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(MembershipFormAnimation);
