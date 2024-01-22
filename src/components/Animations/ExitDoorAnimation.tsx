import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import ExitDoor from '@/assets/animations/exit-door.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'>;

const ExitDoorAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const primaryColor = theme.meatBrown; // '#6ee2ff'
    const backgroundColor = (
      tw.prefixMatch('dark') ? tw.color('gray-700') : tw.color('gray-300')
    ) as string; // '#e5e5e5'
    const frameColor = (
      tw.prefixMatch('dark') ? tw.color('zinc-700') : tw.color('zinc-800')
    ) as string; // '#0f2b4a'
    const reflectionColor = theme.papayaWhip; // '#e9f4f7'
    const insideColor = theme.charlestonGreen; // '#0d4f80'
    return colouriseLottie(ExitDoor, {
      // x 2 Outlines.Group 1.Fill 1
      'layers.0.shapes.0.it.1.c.k': frameColor,
      // circulito Outlines.Group 1.Fill 1
      'layers.1.shapes.0.it.3.c.k': primaryColor,
      // Door knob.pomo.Fill 1
      'layers.2.shapes.0.it.1.c.k': frameColor,
      // Door knob.pomo sombra.Fill 1
      'layers.2.shapes.1.it.1.c.k': primaryColor,
      // door Outlines.Group 1.Fill 1
      'layers.3.shapes.0.it.1.c.k': frameColor,
      // door Outlines.door side.Fill 1
      'layers.3.shapes.1.it.1.c.k': primaryColor,
      // door Outlines.Group 3.Fill 1
      'layers.3.shapes.2.it.1.c.k': reflectionColor,
      // door Outlines.Group 6.Fill 1
      'layers.3.shapes.3.it.1.c.k': '#ffffff',
      // arrow Outlines.Group 1.Fill 1
      'layers.4.shapes.0.it.1.c.k': '#ffffff',
      // arrow Outlines.Group 2.Fill 1
      'layers.4.shapes.1.it.1.c.k': primaryColor,
      // door frame Outlines.Group 1.Fill 1
      'layers.5.shapes.0.it.1.c.k': frameColor,
      // door frame Outlines.Group 2.Fill 1
      'layers.5.shapes.1.it.1.c.k': frameColor,
      // door frame Outlines.Group 3.Fill 1
      'layers.5.shapes.2.it.1.c.k': frameColor,
      // door frame Outlines.Group 4.Fill 1
      'layers.5.shapes.3.it.1.c.k': frameColor,
      // door frame Outlines.Group 5.Fill 1
      'layers.5.shapes.4.it.1.c.k': insideColor,
      // door frame Outlines.Group 6.Fill 1
      'layers.5.shapes.5.it.3.c.k': '#ffffff',
      // bg shape Outlines.Group 1.Fill 1
      'layers.6.shapes.0.it.1.c.k': backgroundColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(ExitDoorAnimation);
