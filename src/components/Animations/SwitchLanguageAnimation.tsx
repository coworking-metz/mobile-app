import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import SwitchLanguage from '@/assets/animations/switch-language.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const SwitchLanguageAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const bulbColor = (isDark ? tw.color('amber-400') : tw.color('yellow-300')) as string;
    return colouriseLottie(SwitchLanguage, {
      // Loading.L Fill.Group 1.Stroke 1
      // 'assets.0.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // // Loading.L Fill.Group 2.Stroke 1
      // 'assets.0.layers.0.shapes.1.it.1.c.k': '#ffffff',
      // // Loading.L Fill.Group 3.Stroke 1
      // 'assets.0.layers.0.shapes.2.it.1.c.k': '#ffffff',
      // // Loading.L Fill.Group 3.Fill 1
      // 'assets.0.layers.0.shapes.2.it.2.c.k': '#ffffff',
      // // Loading.L Fill.Group 4.Stroke 1
      // 'assets.0.layers.0.shapes.3.it.1.c.k': '#ffffff',
      // // Loading.L Fill.Group 4.Fill 1
      // 'assets.0.layers.0.shapes.3.it.2.c.k': '#ffffff',
      // // Loading.L Fill.Group 5.Stroke 1
      // 'assets.0.layers.0.shapes.4.it.1.c.k': '#e23744',
      // // Loading.L Fill.Group 5.Fill 1
      // 'assets.0.layers.0.shapes.4.it.2.c.k': '#e23744',
      // // Loading.A Outlines.Group 1.Stroke 1
      // 'assets.0.layers.1.shapes.0.it.1.c.k': '#9c9c9c',
      // // Loading.A Outlines.Group 2.Stroke 1
      // 'assets.0.layers.1.shapes.1.it.1.c.k': '#9c9c9c',
      // // Loading.A Outlines.Group 3.Stroke 1
      // 'assets.0.layers.1.shapes.2.it.1.c.k': '#9c9c9c',
      // // Loading.A Fille 2.Group 1.Stroke 1
      // 'assets.0.layers.2.shapes.0.it.1.c.k': '#ffffff',
      // // Loading.A Fille 2.Group 2.Stroke 1
      // 'assets.0.layers.2.shapes.1.it.1.c.k': '#ffffff',
      // // Loading.A Fille 2.Group 3.Stroke 1
      // 'assets.0.layers.2.shapes.2.it.1.c.k': '#e23744',
      // // Loading.A Fille 2.Group 3.Fill 1
      // 'assets.0.layers.2.shapes.2.it.2.c.k': '#e23744',
      // // Loading.L-outline 2.Group 1.Stroke 1
      // 'assets.0.layers.3.shapes.0.it.1.c.k': '#9c9c9c',
      // // Loading.L-outline 2.Group 2.Stroke 1
      // 'assets.0.layers.3.shapes.1.it.1.c.k': '#9c9c9c',
      // // Loading.L-outline 2.Group 3.Stroke 1
      // 'assets.0.layers.3.shapes.2.it.1.c.k': '#9c9c9c',
      // // Loading.L-outline 2.Group 3.Fill 1
      // 'assets.0.layers.3.shapes.2.it.2.c.k': '#ffffff',
      // // Loading.L-outline 2.Group 4.Stroke 1
      // 'assets.0.layers.3.shapes.3.it.1.c.k': '#9c9c9c',
      // // Loading.L-outline 2.Group 4.Fill 1
      // 'assets.0.layers.3.shapes.3.it.2.c.k': '#ffffff',
      // // Loading.L-outline 2.Group 5.Stroke 1
      // 'assets.0.layers.3.shapes.4.it.1.c.k': '#9c9c9c',
      // // Loading.A Fille.Group 1.Stroke 1
      // 'assets.0.layers.4.shapes.0.it.1.c.k': '#ffffff',
      // // Loading.A Fille.Group 2.Stroke 1
      // 'assets.0.layers.4.shapes.1.it.1.c.k': '#ffffff',
      // // Loading.A Fille.Group 3.Stroke 1
      // 'assets.0.layers.4.shapes.2.it.1.c.k': '#e23744',
      // // Loading.A Fille.Group 3.Fill 1
      // 'assets.0.layers.4.shapes.2.it.2.c.k': '#e23744',
      // // Loading.L-outline.Group 1.Stroke 1
      // 'assets.0.layers.5.shapes.0.it.1.c.k': '#9c9c9c',
      // // Loading.L-outline.Group 2.Stroke 1
      // 'assets.0.layers.5.shapes.1.it.1.c.k': '#9c9c9c',
      // // Loading.L-outline.Group 3.Stroke 1
      // 'assets.0.layers.5.shapes.2.it.1.c.k': '#9c9c9c',
      // // Loading.L-outline.Group 3.Fill 1
      // 'assets.0.layers.5.shapes.2.it.2.c.k': '#ffffff',
      // // Loading.L-outline.Group 4.Stroke 1
      // 'assets.0.layers.5.shapes.3.it.1.c.k': '#9c9c9c',
      // // Loading.L-outline.Group 4.Fill 1
      // 'assets.0.layers.5.shapes.3.it.2.c.k': '#ffffff',
      // // Loading.L-outline.Group 5.Stroke 1
      // 'assets.0.layers.5.shapes.4.it.1.c.k': '#9c9c9c',
    });
  }, [colorScheme]);

  return <LottieView ref={ref} loop={false} speed={0.75} {...props} source={colorizedSource} />;
};

export default forwardRef(SwitchLanguageAnimation);
