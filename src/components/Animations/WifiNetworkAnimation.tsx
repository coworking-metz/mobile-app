import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import WifiNetwork from '@/assets/animations/wifi-network.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const WifiNetworkAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const activeColor = theme.blueCrayola; // originally #00d9a7
    const stalledColor = (isDark ? tw.color('zinc-700') : tw.color('gray-300')) as string; // originally #e3e3e3

    return colouriseLottie(WifiNetwork, {
      // Line3 Outlines 5.Group 1.Stroke 1
      'layers.0.shapes.0.it.1.c.k': activeColor,
      // Line2 Outlines 5.Group 1.Stroke 1
      'layers.1.shapes.0.it.1.c.k': activeColor,
      // Line1 Outlines 5.Group 1.Stroke 1
      'layers.2.shapes.0.it.1.c.k': activeColor,
      // Line3 Outlines 3.Group 1.Stroke 1
      'layers.3.shapes.0.it.1.c.k': activeColor,
      // Line2 Outlines 3.Group 1.Stroke 1
      'layers.4.shapes.0.it.1.c.k': activeColor,
      // Line1 Outlines 3.Group 1.Stroke 1
      'layers.5.shapes.0.it.1.c.k': activeColor,
      // Line3 Outlines 2.Group 1.Stroke 1
      'layers.6.shapes.0.it.1.c.k': activeColor,
      // Line2 Outlines 2.Group 1.Stroke 1
      'layers.7.shapes.0.it.1.c.k': activeColor,
      // Line1 Outlines 2.Group 1.Stroke 1
      'layers.8.shapes.0.it.1.c.k': activeColor,
      // Line3 Outlines.Group 1.Stroke 1
      'layers.9.shapes.0.it.1.c.k': activeColor,
      // Line2 Outlines.Group 1.Stroke 1
      'layers.10.shapes.0.it.1.c.k': activeColor,
      // Line1 Outlines.Group 1.Stroke 1
      'layers.11.shapes.0.it.1.c.k': activeColor,
      // Dot Outlines.Group 1.Fill 1
      'layers.12.shapes.0.it.1.c.k': activeColor,
      // Line3 Outlines 6.Group 1.Stroke 1
      'layers.13.shapes.0.it.1.c.k': stalledColor,
      // Line2 Outlines 6.Group 1.Stroke 1
      'layers.14.shapes.0.it.1.c.k': stalledColor,
      // Line1 Outlines 6.Group 1.Stroke 1
      'layers.15.shapes.0.it.1.c.k': stalledColor,
      // Dot 2 Outlines.Group 1.Fill 1
      'layers.16.shapes.0.it.1.c.k': stalledColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(WifiNetworkAnimation);
