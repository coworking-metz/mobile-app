import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import StickmanHandshake from '@/assets/animations/stickman-handshake.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const StickmanHandshakeAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const hostColor = theme.maizeCrayola; // originally '#88b8f9'
    const headColor = theme.silverSand; // originally '#88b8f9'
    return colouriseLottie(StickmanHandshake, {
      // Shape Layer 2.Shape 1.Stroke 1
      'layers.0.shapes.0.it.1.c.k': '#84f05e',
      // Group 2.Group 1.Group 1.Fill 1
      'layers.1.shapes.0.it.0.it.1.c.k': '#fffeff',
      // Layer 2.Group 2.Fill 1
      'layers.2.shapes.0.it.1.c.k': '#ee7231',
      // Shape Layer 1.Shape 1.Stroke 1
      'layers.3.shapes.0.it.1.c.k': '#84f05e',
      // Group 1.Group 1.Group 1.Fill 1
      'layers.4.shapes.0.it.0.it.1.c.k': '#fffeff',
      // Layer 1.Group 2.Fill 1
      'layers.5.shapes.0.it.1.c.k': '#ee7231',
      // head.Group 1.Fill 1
      'layers.6.shapes.0.it.1.c.k': headColor,
      // l hand.Group 1.Fill 1
      'layers.7.shapes.0.it.1.c.k': '#2f79f0',
      // l hand.Group 1.Stroke 1
      'layers.7.shapes.0.it.2.c.k': '#ffffff',
      // bag.Group 1.Fill 1
      'layers.8.shapes.0.it.1.c.k': '#fffeff',
      // bag.Group 2.Fill 1
      'layers.8.shapes.1.it.1.c.k': '#ee7231',
      // bag.Group 3.Fill 1
      'layers.8.shapes.2.it.1.c.k': '#f8cf6d',
      // bag.Group 4.Group 1.Fill 1
      'layers.8.shapes.3.it.0.it.2.c.k': '#f8cf6d',
      // body.Group 1.Fill 1
      'layers.9.shapes.0.it.1.c.k': '#2f79f0',
      // r hand.Group 1.Fill 1
      'layers.10.shapes.0.it.1.c.k': '#2f79f0',
      // l leg.Group 1.Fill 1
      'layers.11.shapes.0.it.1.c.k': '#2f79f0',
      // r leg.Group 1.Fill 1
      'layers.12.shapes.0.it.1.c.k': '#2f79f0',
      // head.Group 1.Fill 1
      'layers.13.shapes.0.it.1.c.k': headColor,
      // head.Group 2.Fill 1
      'layers.13.shapes.1.it.1.c.k': headColor,
      // r hand.Group 1.Fill 1
      'layers.14.shapes.0.it.1.c.k': hostColor,
      // r hand.Stroke 1
      'layers.14.shapes.1.c.k': '#ffffff',
      // body.Group 1.Fill 1
      'layers.15.shapes.0.it.1.c.k': hostColor,
      // l leg.Group 1.Fill 1
      'layers.16.shapes.0.it.1.c.k': hostColor,
      // r leg.Group 1.Fill 1
      'layers.17.shapes.0.it.1.c.k': hostColor,
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(StickmanHandshakeAnimation);
