import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import ToggleSwitch from '@/assets/animations/toggle-switch.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const ToggleSwitchAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const enabledSwitchColor = theme.meatBrown;
    const disabledSwitchColor = (isDark ? tw.color('slate-500') : tw.color('slate-400')) as string;
    const borderColor = (isDark ? tw.color('gray-200') : tw.color('gray-800')) as string;
    const cursorColor = (isDark ? tw.color('gray-200') : tw.color('gray-800')) as string;
    return colouriseLottie(ToggleSwitch, {
      // main.Shape Layer 2.Shape 3.Stroke 1
      'assets.0.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // main.Shape Layer 2.Shape 3.Fill 1
      'assets.0.layers.0.shapes.0.it.2.c.k': '#ffffff',
      // main.Shape Layer 2.Shape 2.Stroke 1
      'assets.0.layers.0.shapes.1.it.1.c.k': '#ffffff',
      // main.Shape Layer 2.Shape 2.Fill 1
      'assets.0.layers.0.shapes.1.it.2.c.k': '#ffffff',
      // main.Shape Layer 2.Shape 1.Stroke 1
      'assets.0.layers.0.shapes.2.it.1.c.k': '#ffffff',
      // main.Shape Layer 2.Shape 1.Fill 1
      'assets.0.layers.0.shapes.2.it.2.c.k': '#ffffff',
      // main.pointer.Shape 1.Fill 1
      // 'assets.0.layers.1.shapes.0.it.1.c.k': '#708d81',
      'assets.0.layers.1.shapes.0.it.1.c.k': cursorColor,
      // main.mouth.Shape 1.Fill 1
      'assets.0.layers.3.shapes.0.it.1.c.k': '#ffffff',
      // main.mouth.Ellipse 2.Fill 1
      'assets.0.layers.3.shapes.1.it.1.c.k': '#ffffff',
      // main.mouth.Ellipse 1.Fill 1
      'assets.0.layers.3.shapes.2.it.1.c.k': '#ffffff',
      // main.head.Ellipse 1.Fill 1
      // 'assets.0.layers.4.shapes.0.it.1.c.k.0.s': '#bf0603',
      'assets.0.layers.4.shapes.0.it.1.c.k.0.s': disabledSwitchColor,
      // main.head.Ellipse 1.Fill 1
      // 'assets.0.layers.4.shapes.0.it.1.c.k.1.s': '#001427',
      'assets.0.layers.4.shapes.0.it.1.c.k.1.s': enabledSwitchColor,
      // main.head.Ellipse 1.Fill 1
      // 'assets.0.layers.4.shapes.0.it.1.c.k.2.s': '#001427',
      'assets.0.layers.4.shapes.0.it.1.c.k.2.s': enabledSwitchColor,
      // main.head.Ellipse 1.Fill 1
      // 'assets.0.layers.4.shapes.0.it.1.c.k.3.s': '#bf0603',
      'assets.0.layers.4.shapes.0.it.1.c.k.3.s': disabledSwitchColor,
      // main.l leg.Shape 1.Stroke 1
      // 'assets.0.layers.5.shapes.0.it.1.c.k': '#023047',
      'assets.0.layers.5.shapes.0.it.1.c.k': enabledSwitchColor,
      // main.r leg.Shape 1.Stroke 1
      // 'assets.0.layers.6.shapes.0.it.1.c.k': '#023047',
      'assets.0.layers.6.shapes.0.it.1.c.k': enabledSwitchColor,
      // main.Shape Layer 3.Rectangle 1.Stroke 1
      // 'assets.0.layers.7.shapes.0.it.1.c.k': '#f4d58d',
      'assets.0.layers.7.shapes.0.it.1.c.k': borderColor,
      // main.Shape Layer 1.Rectangle 1.Fill 1
      // 'assets.0.layers.8.shapes.0.it.1.c.k': '#f4d58d',
      'assets.0.layers.8.shapes.0.it.1.c.k': borderColor,
      // Pre-comp 1.Shape Layer 7.Ellipse 1.Fill 1
      'assets.1.layers.0.shapes.0.it.1.c.k': '#f4d58d',
      // Pre-comp 1.Shape Layer 6.Ellipse 1.Fill 1
      'assets.1.layers.1.shapes.0.it.1.c.k': '#f4d58d',
      // Pre-comp 1.Shape Layer 5.Ellipse 1.Fill 1
      'assets.1.layers.2.shapes.0.it.1.c.k': '#f4d58d',
      // Pre-comp 1.Shape Layer 4.Ellipse 1.Fill 1
      'assets.1.layers.3.shapes.0.it.1.c.k': '#f4d58d',
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay {...props} source={colorizedSource} />;
};

export default forwardRef(ToggleSwitchAnimation);
