import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import WorkingGirlOnComputer from '@/assets/animations/working-girl-on-computer.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const WorkingGirlOnComputerAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const deskFeetColor = (isDark ? tw.color('amber-950') : tw.color('amber-950')) as string;
    const deskFrontSideColor = (isDark ? tw.color('amber-900') : tw.color('amber-900')) as string;
    const chairColor = (isDark ? tw.color('neutral-800') : tw.color('gray-800')) as string;
    const chairBackrestColor = (isDark ? tw.color('neutral-700') : tw.color('gray-700')) as string;
    return colouriseLottie(WorkingGirlOnComputer, {
      // // Layer 2.Group 1.Fill 1
      // "assets.0.layers.0.shapes.0.it.1.c.k": "#ffd15c",
      // // Layer 2.Group 2.Fill 1
      // "assets.0.layers.0.shapes.1.it.1.c.k": "#ffd15c",
      // // Layer 2.Group 3.Fill 1
      // "assets.0.layers.0.shapes.2.it.1.c.k": "#ffd15c",
      // // Layer 2.Group 4.Fill 1
      // "assets.0.layers.0.shapes.3.it.1.c.k": "#ffd15c",
      // // Layer 2.Group 5.Fill 1
      // "assets.0.layers.0.shapes.4.it.1.c.k": "#ffd15c",
      // // Layer 2.Group 6.Fill 1
      // "assets.0.layers.0.shapes.5.it.1.c.k": "#ffd15c",
      // // Layer 2.Group 7.Fill 1
      // "assets.0.layers.0.shapes.6.it.1.c.k": "#ffd15c",
      // // Layer 1.Group 1.Group 1.Fill 1
      // "assets.0.layers.1.shapes.0.it.0.it.1.c.k": "#415a6b",
      // // Layer 1.Group 1.Group 2.Fill 1
      // "assets.0.layers.1.shapes.0.it.1.it.1.c.k": "#415a6b",
      // // Layer 1.Group 2.Group 1.Fill 1
      // "assets.0.layers.1.shapes.1.it.0.it.1.c.k": "#344a5e",
      // // Layer 1.Group 2.Group 2.Fill 1
      // "assets.0.layers.1.shapes.1.it.1.it.1.c.k": "#344a5e",
      // // Layer 1.Group 3.Fill 1
      // "assets.0.layers.1.shapes.2.it.1.c.k": "#ffffff",
      // // Layer 1.Group 4.Fill 1
      // "assets.0.layers.1.shapes.3.it.1.c.k": "#ffd15c",
      // // OBJECTS 39.Group 1.Group 1.Group 1.Group 1.Fill 1
      // "assets.0.layers.2.shapes.0.it.0.it.0.it.0.it.1.c.k": "#8e8e8e",
      'assets.0.layers.2.shapes.0.it.0.it.0.it.0.it.1.c.k': '#d3d3d3',
      // // OBJECTS 39.Group 1.Group 2.Group 1.Group 1.Fill 1
      // "assets.0.layers.2.shapes.0.it.1.it.0.it.0.it.1.c.k": "#8e8e8e",
      'assets.0.layers.2.shapes.0.it.1.it.0.it.0.it.1.c.k': '#d3d3d3',
      // // OBJECTS 39.Group 2.Group 1.Group 1.Fill 1
      // "assets.0.layers.2.shapes.1.it.0.it.0.it.1.c.k": "#b2b2b2",
      // // OBJECTS 39.Group 2.Group 1.Group 2.Fill 1
      // "assets.0.layers.2.shapes.1.it.0.it.1.it.1.c.k": "#b2b2b2",
      // // OBJECTS 39.Group 2.Group 2.Fill 1
      // "assets.0.layers.2.shapes.1.it.1.it.1.c.k": "#8e8e8e",
      // // OBJECTS 39.Group 3.Group 1.Fill 1
      // "assets.0.layers.2.shapes.2.it.0.it.1.c.k": "#d3d3d3",
      // // OBJECTS 39.Group 3.Group 2.Fill 1
      // "assets.0.layers.2.shapes.2.it.1.it.1.c.k": "#b2b2b2",
      // // OBJECTS.Group 1.Fill 1
      // "assets.0.layers.3.shapes.0.it.1.c.k": "#111d36",
      'assets.0.layers.3.shapes.0.it.1.c.k': deskFeetColor,
      // // OBJECTS.Group 2.Fill 1
      // "assets.0.layers.3.shapes.1.it.1.c.k": "#24385b",
      'assets.0.layers.3.shapes.1.it.1.c.k': deskFrontSideColor,
      // // OBJECTS.Group 3.Fill 1
      // "assets.0.layers.3.shapes.2.it.1.c.k": "#111d36",
      'assets.0.layers.3.shapes.2.it.1.c.k': deskFeetColor,
      // // OBJECTS.Group 4.Fill 1
      // "assets.0.layers.3.shapes.3.it.1.c.k": "#111d36",
      'assets.0.layers.3.shapes.3.it.1.c.k': deskFeetColor,
      // // OBJECTS.Group 5.Fill 1
      // "assets.0.layers.3.shapes.4.it.1.c.k": "#111d36",
      'assets.0.layers.3.shapes.4.it.1.c.k': deskFeetColor,
      // // OBJECTS.Group 6.Fill 1
      // "assets.0.layers.3.shapes.5.it.1.c.k": "#111d36",
      'assets.0.layers.3.shapes.5.it.1.c.k': deskFeetColor,
      // // Leg.Group 1.Fill 1
      // "assets.0.layers.4.shapes.0.it.1.c.k": "#72899b",
      // // Leg.Group 2.Fill 1
      // "assets.0.layers.4.shapes.1.it.1.c.k": "#72899b",
      // // Thigh.Group 1.Fill 1
      // "assets.0.layers.5.shapes.0.it.1.c.k": "#72899b",
      // // Thigh.Group 2.Fill 1
      // "assets.0.layers.5.shapes.1.it.1.c.k": "#72899b",
      // // Shoe.Group 1.Fill 1
      // "assets.0.layers.6.shapes.0.it.1.c.k": "#ebeff2",
      // // Shoe.Group 2.Fill 1
      // "assets.0.layers.6.shapes.1.it.1.c.k": "#111d36",
      // // Leg shoe.Group 1.Fill 1
      // "assets.0.layers.7.shapes.0.it.1.c.k": "#e0aa86",
      // // OBJECTS 34.Group 1.Fill 1
      // "assets.0.layers.8.shapes.0.it.1.c.k": "#3b4c5b",
      // // OBJECTS 34.Group 2.Fill 1
      // "assets.0.layers.8.shapes.1.it.1.c.k": "#495a6c",
      // // Band shoe.Group 1.Fill 1
      // "assets.0.layers.9.shapes.0.it.1.c.k": "#ebeff2",
      // // Band shoe.Group 2.Fill 1
      // "assets.0.layers.9.shapes.1.it.1.c.k": "#111d36",
      // // band Leg.Group 1.Fill 1
      // "assets.0.layers.10.shapes.0.it.1.c.k": "#e0aa86",
      // // OBJECTS 31.Group 1.Fill 1
      // "assets.0.layers.11.shapes.0.it.1.c.k": "#40507f",
      // // Right glass.Group 1.Stroke 1
      // "assets.0.layers.12.shapes.0.it.1.c.k": "#000103",
      // // OBJECTS 29.Group 1.Stroke 1
      // "assets.0.layers.13.shapes.0.it.1.c.k": "#ffd00d",
      // // Key Board.Group 1.Fill 1
      // "assets.0.layers.14.shapes.0.it.1.c.k": "#b2b2b2",
      // // 1st Finger.Group 1.Fill 1
      // "assets.0.layers.15.shapes.0.it.1.c.k": "#e0aa86",
      // // OBJECTS 26.Group 1.Fill 1
      // "assets.0.layers.16.shapes.0.it.1.c.k": "#e0aa86",
      // // 2nd Finger.Group 1.Fill 1
      // "assets.0.layers.17.shapes.0.it.1.c.k": "#dd997a",
      // // 3rd Finger.Group 1.Group 1.Fill 1
      // "assets.0.layers.18.shapes.0.it.0.it.1.c.k": "#d69074",
      // // 4th Finger.Group 1.Fill 1
      // "assets.0.layers.19.shapes.0.it.1.c.k": "#ce8a72",
      // // Hijab.Group 1.Group 1.Fill 1
      // "assets.0.layers.20.shapes.0.it.0.it.1.c.k": "#40507f",
      // // Hijab.Group 2.Group 1.Fill 1
      // "assets.0.layers.20.shapes.1.it.0.it.1.c.k": "#40507f",
      // // Hijab.Group 3.Group 1.Fill 1
      // "assets.0.layers.20.shapes.2.it.0.it.1.c.k": "#6876aa",
      // // Hijab.Group 4.Group 1.Fill 1
      // "assets.0.layers.20.shapes.3.it.0.it.1.c.k": "#6876aa",
      // // Left glass.Group 1.Stroke 1
      // "assets.0.layers.21.shapes.0.it.1.c.k": "#000103",
      // // OBJECTS 21.Group 1.Group 1.Stroke 1
      // "assets.0.layers.22.shapes.0.it.0.it.1.c.k": "#40507f",
      // // OBJECTS 21.Group 1.Group 2.Fill 1
      // "assets.0.layers.22.shapes.0.it.1.it.1.c.k": "#6876aa",
      // // OBJECTS 21.Group 2.Group 1.Stroke 1
      // "assets.0.layers.22.shapes.1.it.0.it.1.c.k": "#6876aa",
      // // OBJECTS 21.Group 2.Group 2.Group 1.Stroke 1
      // "assets.0.layers.22.shapes.1.it.1.it.0.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 2.Group 2.Group 2.Stroke 1
      // "assets.0.layers.22.shapes.1.it.1.it.1.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 2.Group 2.Group 3.Stroke 1
      // "assets.0.layers.22.shapes.1.it.1.it.2.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 2.Group 2.Group 4.Stroke 1
      // "assets.0.layers.22.shapes.1.it.1.it.3.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 2.Group 2.Group 5.Stroke 1
      // "assets.0.layers.22.shapes.1.it.1.it.4.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 2.Group 2.Group 6.Stroke 1
      // "assets.0.layers.22.shapes.1.it.1.it.5.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 2.Group 3.Fill 1
      // "assets.0.layers.22.shapes.1.it.2.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 2.Group 4.Group 1.Group 1.Fill 1
      // "assets.0.layers.22.shapes.1.it.3.it.0.it.0.it.1.c.k": "#06112f",
      // // OBJECTS 21.Group 2.Group 4.Group 2.Fill 1
      // "assets.0.layers.22.shapes.1.it.3.it.1.it.1.c.k": "#e0aa86",
      // // OBJECTS 21.Group 3.Fill 1
      // "assets.0.layers.22.shapes.2.it.1.c.k": "#e0aa86",
      // // OBJECTS 21.Group 4.Group 1.Group 1.Group 1.Stroke 1
      // "assets.0.layers.22.shapes.3.it.0.it.0.it.0.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 4.Group 1.Group 1.Group 2.Stroke 1
      // "assets.0.layers.22.shapes.3.it.0.it.0.it.1.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 4.Group 1.Group 1.Group 3.Stroke 1
      // "assets.0.layers.22.shapes.3.it.0.it.0.it.2.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 4.Group 1.Group 1.Group 4.Stroke 1
      // "assets.0.layers.22.shapes.3.it.0.it.0.it.3.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 4.Group 1.Group 1.Group 5.Stroke 1
      // "assets.0.layers.22.shapes.3.it.0.it.0.it.4.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 4.Group 1.Group 1.Group 6.Stroke 1
      // "assets.0.layers.22.shapes.3.it.0.it.0.it.5.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 4.Group 1.Group 1.Group 7.Stroke 1
      // "assets.0.layers.22.shapes.3.it.0.it.0.it.6.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 4.Group 1.Group 2.Stroke 1
      // "assets.0.layers.22.shapes.3.it.0.it.1.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 4.Group 2.Group 1.Stroke 1
      // "assets.0.layers.22.shapes.3.it.1.it.0.it.1.c.k": "#6876aa",
      // // OBJECTS 21.Group 4.Group 2.Group 2.Stroke 1
      // "assets.0.layers.22.shapes.3.it.1.it.1.it.1.c.k": "#6876aa",
      // // OBJECTS 21.Group 4.Group 2.Group 3.Fill 1
      // "assets.0.layers.22.shapes.3.it.1.it.2.it.1.c.k": "#06112f",
      // // OBJECTS 21.Group 5.Group 1.Fill 1
      // "assets.0.layers.22.shapes.4.it.0.it.1.c.k": "#d8a082",
      // // OBJECTS 21.Group 6.Group 1.Fill 1
      // "assets.0.layers.22.shapes.5.it.0.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 6.Group 2.Stroke 1
      // "assets.0.layers.22.shapes.5.it.1.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 6.Group 3.Stroke 1
      // "assets.0.layers.22.shapes.5.it.2.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 6.Group 4.Stroke 1
      // "assets.0.layers.22.shapes.5.it.3.it.1.c.k": "#ebeff2",
      // // OBJECTS 21.Group 6.Group 5.Group 1.Fill 1
      // "assets.0.layers.22.shapes.5.it.4.it.0.it.1.c.k": "#06112f",
      // // OBJECTS 21.Group 6.Group 5.Group 2.Fill 1
      // "assets.0.layers.22.shapes.5.it.4.it.1.it.1.c.k": "#d8a082",
      // // Hair.Group 1.Fill 1
      // "assets.0.layers.23.shapes.0.it.1.c.k": "#000103",
      // // Hair.Group 2.Fill 1
      // "assets.0.layers.23.shapes.1.it.1.c.k": "#000103",
      // // Glass between line.Group 1.Stroke 1
      // "assets.0.layers.24.shapes.0.it.1.c.k": "#000103",
      // // Left glass support.Group 1.Stroke 1
      // "assets.0.layers.25.shapes.0.it.1.c.k": "#000103",
      // // OBJECTS 17.Group 1.Fill 1
      // "assets.0.layers.26.shapes.0.it.1.c.k": "#f2ccb7",
      // // OBJECTS 16.Group 1.Fill 1
      // "assets.0.layers.27.shapes.0.it.1.c.k": "#000103",
      // // Lip.Group 1.Stroke 1
      // "assets.0.layers.28.shapes.0.it.1.c.k": "#ff0000",
      // // Right eyebrow.Group 1.Fill 1
      // "assets.0.layers.29.shapes.0.it.1.c.k": "#000103",
      // // Left eyebrow.Group 1.Fill 1
      // "assets.0.layers.30.shapes.0.it.1.c.k": "#000103",
      // // Nose.Group 1.Stroke 1
      // "assets.0.layers.31.shapes.0.it.1.c.k": "#000000",
      // // Left eyeball.Group 1.Fill 1
      // "assets.0.layers.32.shapes.0.it.1.c.k": "#000103",
      // // Right eyeball.Group 1.Fill 1
      // "assets.0.layers.33.shapes.0.it.1.c.k": "#000103",
      // // Hair.Group 1.Group 1.Group 1.Group 1.Stroke 1
      // "assets.0.layers.34.shapes.0.it.0.it.0.it.0.it.1.c.k": "#000000",
      // // Hair.Group 1.Group 1.Group 1.Group 2.Fill 1
      // "assets.0.layers.34.shapes.0.it.0.it.0.it.1.it.1.c.k": "#e0aa86",
      // // Hair.Group 1.Group 1.Group 2.Fill 1
      // "assets.0.layers.34.shapes.0.it.0.it.1.it.1.c.k": "#e0aa86",
      // // Hair.Group 1.Group 2.Stroke 1
      // "assets.0.layers.34.shapes.0.it.1.it.1.c.k": "#000103",
      // // Hair.Group 1.Group 3.Group 1.Fill 1
      // "assets.0.layers.34.shapes.0.it.2.it.0.it.1.c.k": "#f2ccb7",
      // // Hair.Group 2.Group 1.Fill 1
      // "assets.0.layers.34.shapes.1.it.0.it.1.c.k": "#000103",
      // // 1st finger.Group 1.Fill 1
      // "assets.0.layers.35.shapes.0.it.1.c.k": "#d8a082",
      // // OBJECTS 5.Group 1.Fill 1
      // "assets.0.layers.36.shapes.0.it.1.c.k": "#d8a082",
      // // 2nd Finger.Group 1.Fill 1
      // "assets.0.layers.37.shapes.0.it.1.c.k": "#dd997a",
      // // 3rd finger.Group 1.Group 1.Fill 1
      // "assets.0.layers.38.shapes.0.it.0.it.1.c.k": "#d69074",
      // // Ring.Group 1.Stroke 1
      // "assets.0.layers.39.shapes.0.it.1.c.k": "#ffef66",
      // // 4th finger.Group 1.Fill 1
      // "assets.0.layers.40.shapes.0.it.1.c.k": "#ce8a72",
      // // OBJECTS 40.Group 1.Fill 1
      // "assets.0.layers.41.shapes.0.it.1.c.k": "#111d36",
      'assets.0.layers.41.shapes.0.it.1.c.k': chairColor,
      // // OBJECTS 40.Group 2.Group 1.Fill 1
      // "assets.0.layers.41.shapes.1.it.0.it.1.c.k": "#111d36",
      'assets.0.layers.41.shapes.1.it.0.it.1.c.k': chairColor,
      // // OBJECTS 40.Group 2.Group 2.Fill 1
      // "assets.0.layers.41.shapes.1.it.1.it.1.c.k": "#111d36",
      'assets.0.layers.41.shapes.1.it.1.it.1.c.k': chairColor,
      // // OBJECTS 40.Group 2.Group 3.Fill 1
      // "assets.0.layers.41.shapes.1.it.2.it.1.c.k": "#111d36",
      'assets.0.layers.41.shapes.1.it.2.it.1.c.k': chairColor,
      // // OBJECTS 40.Group 2.Group 4.Fill 1
      // "assets.0.layers.41.shapes.1.it.3.it.1.c.k": "#111d36",
      'assets.0.layers.41.shapes.1.it.3.it.1.c.k': chairColor,
      // // OBJECTS 40.Group 3.Fill 1
      // "assets.0.layers.41.shapes.2.it.1.c.k": "#c1ccff",
      'assets.0.layers.41.shapes.2.it.1.c.k': chairBackrestColor,
      // // OBJECTS 40.Group 4.Fill 1
      // "assets.0.layers.41.shapes.3.it.1.c.k": "#111d36",
      'assets.0.layers.41.shapes.3.it.1.c.k': chairColor,
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(WorkingGirlOnComputerAnimation);
