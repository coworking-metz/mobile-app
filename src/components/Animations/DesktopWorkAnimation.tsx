import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import DesktopWork from '@/assets/animations/desktop-work.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const DesktopWorkAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const tshirtColor = theme.peachYellow; // '#f76567'
    const jeanFrontColor = theme.babyBlueEyes; // '#00da9f'
    const jeanBackColor = theme.frenchSkyBlue; // '#00b987'
    const jeanRollupColor = theme.azureishWhite; // '#5fffd4'
    const clockColor = colorScheme === 'dark' ? theme.silverSand : theme.charlestonGreen; // '#bfafa7'
    const chairColor = (
      colorScheme === 'dark' ? tw.color('neutral-800') : tw.color('gray-800')
    ) as string; // '#131b1e'
    const chairBackrestColor = (
      colorScheme === 'dark' ? tw.color('neutral-700') : tw.color('gray-700')
    ) as string; // '#fcbc9b'
    const deskFeetColor = (
      colorScheme === 'dark' ? tw.color('stone-400') : tw.color('amber-900')
    ) as string; // '#eae2df'
    const deskFrontColor = (
      colorScheme === 'dark' ? tw.color('stone-500') : tw.color('amber-950')
    ) as string; // '#bfafa7'
    return colouriseLottie(DesktopWork, {
      //   // Pre-comp 1.Shape Layer 3.Shape 1.Stroke 1
      // "assets.1.layers.0.shapes.0.it.1.c.k": "#000000",
      // // Pre-comp 1.Shape Layer 2.Shape 1.Stroke 1
      // "assets.1.layers.1.shapes.0.it.1.c.k": "#000000",
      // // Pre-comp 1.Shape Layer 1.Shape 1.Stroke 1
      // "assets.1.layers.2.shapes.0.it.1.c.k": "#000000",
      // // Pre-comp 1.pc.Group 1.Group 1.Fill 1
      'assets.1.layers.3.shapes.0.it.0.it.1.c.k': deskFeetColor,
      // // Pre-comp 1.pc.Group 1.Group 2.Fill 1
      'assets.1.layers.3.shapes.0.it.1.it.1.c.k': deskFrontColor,
      // // Pre-comp 1.pc.Group 1.Group 3.Stroke 1
      'assets.1.layers.3.shapes.0.it.2.it.1.c.k': deskFeetColor,
      // // Pre-comp 1.pc.Group 1.Group 4.Stroke 1
      'assets.1.layers.3.shapes.0.it.3.it.1.c.k': deskFeetColor,
      // // Pre-comp 1.pc.Group 2.Group 1.Group 1.Group 1.Fill 1
      // "assets.1.layers.3.shapes.1.it.0.it.0.it.0.it.1.c.k": "#3d5057",
      // // Pre-comp 1.pc.Group 2.Group 1.Group 1.Group 2.Fill 1
      // "assets.1.layers.3.shapes.1.it.0.it.0.it.1.it.1.c.k": "#3d5057",
      // // Pre-comp 1.pc.Group 2.Group 1.Group 2.Fill 1
      // "assets.1.layers.3.shapes.1.it.0.it.1.it.1.c.k": "#090b0c",
      // // Pre-comp 1.pc.Group 2.Group 2.Group 1.Fill 1
      // "assets.1.layers.3.shapes.1.it.1.it.0.it.1.c.k": "#263237",
      // // Pre-comp 1.pc.Group 2.Group 2.Group 2.Fill 1
      // "assets.1.layers.3.shapes.1.it.1.it.1.it.1.c.k": "#3d5057",
      // // Pre-comp 1.pc.Group 2.Group 3.Group 1.Fill 1
      // "assets.1.layers.3.shapes.1.it.2.it.0.it.1.c.k": "#3d5057",
      // // Pre-comp 1.pc.Group 2.Group 3.Group 2.Fill 1
      // "assets.1.layers.3.shapes.1.it.2.it.1.it.1.c.k": "#090b0c",
      // // Pre-comp 1.head.Group 1.Fill 1
      // "assets.1.layers.5.shapes.0.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 2.Fill 1
      // "assets.1.layers.5.shapes.1.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 3.Group 1.Stroke 1
      // "assets.1.layers.5.shapes.2.it.0.it.1.c.k": "#000000",
      // // Pre-comp 1.head.Group 3.Group 2.Fill 1
      // "assets.1.layers.5.shapes.2.it.1.it.1.c.k": "#fcbc9b",
      // // Pre-comp 1.head.Group 4.Fill 1
      // "assets.1.layers.5.shapes.3.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 5.Group 1.Fill 1
      // "assets.1.layers.5.shapes.4.it.0.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 5.Group 2.Fill 1
      // "assets.1.layers.5.shapes.4.it.1.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 5.Group 3.Fill 1
      // "assets.1.layers.5.shapes.4.it.2.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 5.Group 4.Fill 1
      // "assets.1.layers.5.shapes.4.it.3.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 5.Group 5.Stroke 1
      // "assets.1.layers.5.shapes.4.it.4.it.1.c.k": "#000000",
      // // Pre-comp 1.head.Group 6.Fill 1
      // 'assets.1.layers.5.shapes.5.it.1.c.k': '#fcbc9b',
      // // Pre-comp 1.head.Group 7.Fill 1
      // "assets.1.layers.5.shapes.6.it.1.c.k": "#e49d7d",
      // // Pre-comp 1.head.Group 8.Fill 1
      // "assets.1.layers.5.shapes.7.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 9.Fill 1
      // "assets.1.layers.5.shapes.8.it.1.c.k": "#171e21",
      // // Pre-comp 1.head.Group 10.Fill 1
      // "assets.1.layers.5.shapes.9.it.1.c.k": "#171e21",
      // // Pre-comp 1.r hand.Group 1.Group 1.Stroke 1
      // "assets.1.layers.6.shapes.0.it.0.it.1.c.k": "#ffffff",
      // // Pre-comp 1.r hand.Group 1.Group 2.Fill 1
      'assets.1.layers.6.shapes.0.it.1.it.1.c.k': tshirtColor,
      // // Pre-comp 1.r hand.Group 2.Group 1.Fill 1
      // "assets.1.layers.6.shapes.1.it.0.it.1.c.k": "#f1b999",
      // // Pre-comp 1.r hand.Group 2.Group 2.Fill 1
      // "assets.1.layers.6.shapes.1.it.1.it.1.c.k": "#f1b999",
      // // Pre-comp 1.r arm.Group 1.Stroke 1
      // "assets.1.layers.7.shapes.0.it.1.c.k": "#ffffff",
      // // Pre-comp 1.r arm.Group 2.Fill 1
      'assets.1.layers.7.shapes.1.it.1.c.k': tshirtColor,
      // // Pre-comp 1.body.Group 1.Fill 1
      // "assets.1.layers.8.shapes.0.it.1.c.k": "#fcbc9b",
      // // Pre-comp 1.body.Group 2.Fill 1
      // "assets.1.layers.8.shapes.1.it.1.c.k": "#fcbc9b",
      // // Pre-comp 1.body.Group 3.Group 1.Stroke 1
      // "assets.1.layers.8.shapes.2.it.0.it.1.c.k": "#ffffff",
      // // Pre-comp 1.body.Group 3.Group 2.Fill 1
      'assets.1.layers.8.shapes.2.it.1.it.1.c.k': tshirtColor,
      // // Pre-comp 1.l hand.Group 1.Fill 1
      'assets.1.layers.9.shapes.0.it.1.c.k': tshirtColor,
      // // Pre-comp 1.l hand.Group 2.Group 1.Fill 1
      // "assets.1.layers.9.shapes.1.it.0.it.1.c.k": "#f1b999",
      // // Pre-comp 1.l hand.Group 2.Group 2.Fill 1
      // "assets.1.layers.9.shapes.1.it.1.it.1.c.k": "#f1b999",
      // // Pre-comp 1.l arm.Group 1.Fill 1
      'assets.1.layers.10.shapes.0.it.1.c.k': tshirtColor,
      // // Pre-comp 1.r leg.Group 1.Group 1.Fill 1
      'assets.1.layers.11.shapes.0.it.0.it.1.c.k': jeanRollupColor,
      // // Pre-comp 1.r leg.Group 1.Group 2.Fill 1
      'assets.1.layers.11.shapes.0.it.1.it.1.c.k': jeanFrontColor,
      // // Pre-comp 1.r leg.Group 2.Group 1.Group 1.Fill 1
      // "assets.1.layers.11.shapes.1.it.0.it.0.it.1.c.k": "#ffffff",
      // // Pre-comp 1.r leg.Group 2.Group 1.Group 2.Fill 1
      // "assets.1.layers.11.shapes.1.it.0.it.1.it.1.c.k": "#ffffff",
      // // Pre-comp 1.r leg.Group 2.Group 1.Group 3.Fill 1
      // "assets.1.layers.11.shapes.1.it.0.it.2.it.1.c.k": "#ffffff",
      // // Pre-comp 1.r leg.Group 2.Group 1.Group 4.Fill 1
      // "assets.1.layers.11.shapes.1.it.0.it.3.it.1.c.k": "#ffffff",
      // // Pre-comp 1.r leg.Group 2.Group 1.Group 5.Fill 1
      // "assets.1.layers.11.shapes.1.it.0.it.4.it.1.c.k": "#000000",
      // // Pre-comp 1.r leg.Group 2.Group 2.Fill 1
      // "assets.1.layers.11.shapes.1.it.1.it.1.c.k": "#fcbc9b",
      // // Pre-comp 1.r thigh.Group 1.Group 2.Fill 1
      'assets.1.layers.12.shapes.0.it.0.it.1.c.k': jeanFrontColor,
      // // Pre-comp 1.l leg.Group 1.Group 1.Fill 1
      'assets.1.layers.13.shapes.0.it.0.it.1.c.k': jeanRollupColor,
      // // Pre-comp 1.l leg.Group 1.Group 2.Fill 1
      'assets.1.layers.13.shapes.0.it.1.it.1.c.k': jeanBackColor,
      // // Pre-comp 1.l leg.Group 2.Group 1.Group 1.Fill 1
      // "assets.1.layers.13.shapes.1.it.0.it.0.it.1.c.k": "#ffffff",
      // // Pre-comp 1.l leg.Group 2.Group 1.Group 2.Fill 1
      // "assets.1.layers.13.shapes.1.it.0.it.1.it.1.c.k": "#ffffff",
      // // Pre-comp 1.l leg.Group 2.Group 1.Group 3.Fill 1
      // "assets.1.layers.13.shapes.1.it.0.it.2.it.1.c.k": "#ffffff",
      // // Pre-comp 1.l leg.Group 2.Group 1.Group 4.Fill 1
      // "assets.1.layers.13.shapes.1.it.0.it.3.it.1.c.k": "#ffffff",
      // // Pre-comp 1.l leg.Group 2.Group 1.Group 5.Fill 1
      // "assets.1.layers.13.shapes.1.it.0.it.4.it.1.c.k": "#000000",
      // // Pre-comp 1.l leg.Group 2.Group 2.Fill 1
      // "assets.1.layers.13.shapes.1.it.1.it.1.c.k": "#fcbc9b",
      // // Pre-comp 1.chair.Group 1.Fill 1
      'assets.1.layers.14.shapes.0.it.1.c.k': chairColor,
      // // Pre-comp 1.chair.Group 2.Group 1.Fill 1
      'assets.1.layers.14.shapes.1.it.0.it.1.c.k': chairColor,
      // // Pre-comp 1.chair.Group 2.Group 2.Fill 1
      'assets.1.layers.14.shapes.1.it.1.it.1.c.k': chairColor,
      // // Pre-comp 1.chair.Group 2.Group 3.Fill 1
      'assets.1.layers.14.shapes.1.it.2.it.1.c.k': chairColor,
      // // Pre-comp 1.chair.Group 2.Group 4.Fill 1
      'assets.1.layers.14.shapes.1.it.3.it.1.c.k': chairColor,
      // // Pre-comp 1.chair.Group 3.Fill 1
      'assets.1.layers.14.shapes.2.it.1.c.k': chairColor,
      // // Pre-comp 1.chair.Group 4.Fill 1
      'assets.1.layers.14.shapes.3.it.1.c.k': chairBackrestColor,
      // // Pre-comp 1.chair.Group 5.Fill 1
      'assets.1.layers.14.shapes.4.it.1.c.k': chairColor,
      // // Pre-comp 1.Layer 4.Group 1.Stroke 1
      'assets.1.layers.15.shapes.0.it.1.c.k': clockColor,
      // // Pre-comp 1.Layer 3.Group 1.Stroke 1
      'assets.1.layers.16.shapes.0.it.1.c.k': clockColor,
      // // Pre-comp 1.Layer 2.Group 1.Stroke 1
      'assets.1.layers.17.shapes.0.it.1.c.k': clockColor,
      // // Pre-comp 1.Layer 1.Group 1.Stroke 1
      'assets.1.layers.18.shapes.0.it.1.c.k': clockColor,
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(DesktopWorkAnimation);
