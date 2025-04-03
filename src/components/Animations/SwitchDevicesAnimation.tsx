import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import SwitchDevices from '@/assets/animations/switch-devices.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const SwitchDevicesAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const borderColor = (isDark ? tw.color('neutral-950') : tw.color('zinc-400')) as string; // originally '#ffffff'
    const contrastedElementsColor = (
      isDark ? tw.color('zinc-600') : tw.color('gray-700')
    ) as string; // originally '#aaaaaa'
    const screenColor = (isDark ? tw.color('zinc-600') : tw.color('gray-300')) as string; // originally '#e6e6e6'

    return colouriseLottie(SwitchDevices, {
      // Device.Grupo 1.Preenchimento 1
      'layers.1.shapes.0.it.1.c.k.0.s': borderColor,
      // Device.Grupo 1.Preenchimento 1
      'layers.1.shapes.0.it.1.c.k.0.e': contrastedElementsColor,
      // Device.Grupo 1.Preenchimento 1
      'layers.1.shapes.0.it.1.c.k.1.s': contrastedElementsColor,
      // Device.Grupo 1.Preenchimento 1
      'layers.1.shapes.0.it.1.c.k.1.e': contrastedElementsColor,
      // Device.Grupo 1.Preenchimento 1
      'layers.1.shapes.0.it.1.c.k.2.s': contrastedElementsColor,
      // Device.Grupo 1.Preenchimento 1
      'layers.1.shapes.0.it.1.c.k.2.e': borderColor,
      // Device.Grupo 2.Preenchimento 1
      'layers.1.shapes.1.it.1.c.k.0.s': screenColor,
      // Device.Grupo 2.Preenchimento 1
      'layers.1.shapes.1.it.1.c.k.0.e': contrastedElementsColor,
      // Device.Grupo 2.Preenchimento 1
      'layers.1.shapes.1.it.1.c.k.1.s': contrastedElementsColor,
      // Device.Grupo 2.Preenchimento 1
      'layers.1.shapes.1.it.1.c.k.1.e': contrastedElementsColor,
      // Device.Grupo 2.Preenchimento 1
      'layers.1.shapes.1.it.1.c.k.2.s': contrastedElementsColor,
      // Device.Grupo 2.Preenchimento 1
      'layers.1.shapes.1.it.1.c.k.2.e': screenColor,
      // Device.Grupo 3.Preenchimento 1
      'layers.1.shapes.2.it.1.c.k': screenColor,
      // Device.Grupo 4.Preenchimento 1
      'layers.1.shapes.3.it.1.c.k': borderColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(SwitchDevicesAnimation);
