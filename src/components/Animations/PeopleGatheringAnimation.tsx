import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import PeopleGathering from '@/assets/animations/people-gathering.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const PeopleGatheringAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(PeopleGathering, {
        // Flower Pot.Layer 3.Group 1.Fill 1 (terracotta pot)
        'assets.0.layers.0.shapes.0.it.1.c.k': '#c4704f',
        // Flower Pot.Layer 2.Group 2.Fill 1 (leaves)
        'assets.0.layers.1.shapes.1.it.1.c.k': '#74ad93',
        // Char.Up hand.Group 1.Fill 1
        'assets.2.layers.1.shapes.0.it.1.c.k': '#46504e',
        // Char.Body.Group 1.Fill 1
        'assets.2.layers.9.shapes.0.it.1.c.k': '#46504e',
        // Righer character right leg
        'assets.2.layers.11.shapes.0.it.1.c.k': '#7f9ad6',
        // Righer character right feet
        'assets.2.layers.12.shapes.1.it.1.c.k': theme.charlestonGreen,
        // Righer character left leg
        'assets.2.layers.14.shapes.0.it.1.c.k': '#7f9ad6',
        // Righer character left feet
        'assets.2.layers.15.shapes.1.it.1.c.k': theme.charlestonGreen,
        // Char.Up hand.Group 2.Fill 1
        'assets.2.layers.19.shapes.0.it.1.c.k': '#3c4544',
        // 4 Char.Isolation Mode 34.Group 1.Fill 1
        'assets.5.layers.1.shapes.0.it.1.c.k': '#c45d3d',
        // 4 Char.Isolation Mode 2.Group 1.Fill 1
        'assets.5.layers.3.shapes.0.it.1.c.k': '#5b1d0e',
        // 4 Char.Isolation Mode 36.Group 1.Stroke 1
        'assets.5.layers.8.shapes.0.it.1.c.k': '#c45d3d',
        // 4 Char.Isolation Mode 35.Group 1.Stroke 1
        'assets.5.layers.9.shapes.0.it.1.c.k': '#c45d3d',
        // 4 Char.Up hand.Group 1.Fill 1
        'assets.5.layers.14.shapes.0.it.1.c.k': '#74ad93',
        // 4 Char.Shoes.Group 1.Group 2.Fill 1
        'assets.5.layers.16.shapes.0.it.1.it.1.c.k': '#46504e',
        // 4 Char.Shoes.Group 1.Group 2.Fill 1
        'assets.5.layers.18.shapes.0.it.1.it.1.c.k': '#46504e',
        // 4 Char.Body.Group 1.Fill 1
        'assets.5.layers.20.shapes.0.it.1.c.k': '#74ad93',
        // 4 Char.Isolation Mode 12.Group 1.Fill 1
        'assets.5.layers.21.shapes.0.it.1.c.k': '#c97b8e',
        // 4 Char.Up hand.Group 1.Fill 1
        'assets.5.layers.25.shapes.0.it.1.c.k': '#74ad93',
        // 4 Char.Layer 5.Group 1.Stroke 1
        'assets.5.layers.28.shapes.0.it.1.c.k': theme.charlestonGreen,
        // 4 Char.Layer 7.Group 1.Stroke 1
        'assets.5.layers.29.shapes.0.it.1.c.k': theme.charlestonGreen,
        // 4 Char.Layer 4.Group 1.Stroke 1
        'assets.5.layers.30.shapes.0.it.1.c.k': theme.charlestonGreen,
        // 4 Char.Layer 3.Group 1.Stroke 1
        'assets.5.layers.31.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode 43.Group 1.Stroke 1
        'assets.6.layers.2.shapes.0.it.1.c.k': '#c97b8e',
        // Face.Isolation Mode 42.Group 1.Stroke 1
        'assets.6.layers.3.shapes.0.it.1.c.k': '#c97b8e',
        // Face.Isolation Mode 41.Group 1.Fill 1
        'assets.6.layers.4.shapes.0.it.1.c.k': '#5b1d0e',
        // Face.Isolation Mode 48.Group 4.Fill 1
        'assets.6.layers.7.shapes.0.it.1.c.k': '#5b1d0e',
        // Face.Isolation Mode 47.Group 3.Stroke 1
        'assets.6.layers.11.shapes.0.it.1.c.k': '#fcfcfc',
        // Face.Isolation Mode 46.Group 2.Fill 1
        'assets.6.layers.12.shapes.0.it.1.c.k': '#5b1d0e',
        // Face.Isolation Mode 53.Group 8.Fill 1
        'assets.6.layers.13.shapes.0.it.1.c.k': '#5b1d0e',
        // Face.Isolation Mode 45.Group 1.Stroke 1
        'assets.6.layers.14.shapes.0.it.1.c.k': '#251813',
        // Face.Isolation Mode 52.Group 7.Stroke 1
        'assets.6.layers.18.shapes.0.it.1.c.k': '#fcfcfc',
        // Face.Isolation Mode 56.Group 11.Fill 1
        'assets.6.layers.19.shapes.0.it.1.c.k': '#5b1d0e',
        // Face.Isolation Mode 44.Group 2.Fill 1
        'assets.6.layers.21.shapes.0.it.1.c.k': '#5b1d0e',
        // Face.Isolation Mode 4.Group 1.Stroke 1
        'assets.6.layers.22.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode.Group 1.Fill 1
        'assets.6.layers.23.shapes.0.it.1.c.k': '#5b1d0e',
        // Char blue 2.Layer 19.Group 1.Stroke 1
        'assets.8.layers.0.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char blue 2.Layer 18.Group 1.Stroke 1
        'assets.8.layers.1.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char blue 2.Layer 17.Group 1.Stroke 1
        'assets.8.layers.2.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char blue 2.Layer 16.Group 1.Stroke 1
        'assets.8.layers.3.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char blue 2.Layer 15.Group 1.Stroke 1
        'assets.8.layers.4.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char blue 2.body.Group 1.Fill 1
        'assets.8.layers.7.shapes.0.it.1.c.k': '#46504e',
        // Char blue 2.Layer 9.Group 1.Fill 1
        'assets.8.layers.8.shapes.0.it.1.c.k': '#4f6fb8',
        // Char blue 2.Up hand.Group 1.Fill 1
        'assets.8.layers.9.shapes.0.it.1.c.k': '#46504e',
        // Char blue 2.Up hand 2.Group 1.Fill 1
        'assets.8.layers.13.shapes.0.it.1.c.k': '#46504e',
        // Char blue 2.Layer 7.Group 1.Fill 1
        'assets.8.layers.17.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char blue 2.Layer 5.Group 1.Fill 1
        'assets.8.layers.19.shapes.0.it.1.c.k': '#4f6fb8',
        // Char blue 2.Layer 2.Group 1.Fill 1
        'assets.8.layers.20.shapes.0.it.1.c.k': '#46504e',
        // Char blue 2.Leg.Group 1.Fill 1
        'assets.8.layers.21.shapes.0.it.1.c.k': '#4f6fb8',
        // Char blue 2.Sheos.Group 1.Fill 1
        'assets.8.layers.22.shapes.0.it.1.c.k': '#46504e',
        // Char.Up hand.Group 1.Fill 1
        'assets.9.layers.5.shapes.0.it.1.c.k': '#9e4a5a',
        // Char.Body.Group 1.Fill 1
        'assets.9.layers.8.shapes.0.it.1.c.k': '#9e4a5a',
        // Char.Up leg.Group 1.Fill 1
        'assets.9.layers.9.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Lo leg.Group 1.Fill 1
        'assets.9.layers.10.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Isolation Mode 11.Group 1.Fill 1
        'assets.9.layers.11.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Isolation Mode 12.Group 1.Fill 1
        'assets.9.layers.13.shapes.0.it.1.c.k': theme.meatBrown,
        // Char.Up leg.Group 1.Fill 1
        'assets.9.layers.14.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Lo leg.Group 1.Fill 1
        'assets.9.layers.15.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Isolation Mode 6.Group 1.Fill 1
        'assets.9.layers.16.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Shoes.Group 1.Fill 1
        'assets.9.layers.18.shapes.0.it.1.c.k': theme.meatBrown,
        // Char.Isolation Mode 4.Group 1.Fill 1
        'assets.9.layers.19.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Isolation Mode 3.Group 1.Fill 1
        'assets.9.layers.20.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Isolation Mode 2.Group 1.Fill 1
        'assets.9.layers.21.shapes.0.it.1.c.k': '#5c5f63',
        // Char.Up hand 2.Group 1.Fill 1
        'assets.9.layers.24.shapes.0.it.1.c.k': '#9e4a5a',
        // Char.Layer 6.Group 1.Stroke 1
        'assets.9.layers.27.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char.Layer 5.Group 1.Stroke 1
        'assets.9.layers.28.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char.Layer 2.Group 1.Stroke 1
        'assets.9.layers.31.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode 39.Group 1.Stroke 1
        'assets.10.layers.1.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode 38.Group 1.Stroke 1
        'assets.10.layers.3.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode 35.Group 1.Stroke 1
        'assets.10.layers.7.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode 31.Group 1.Fill 1
        'assets.10.layers.12.shapes.0.it.1.c.k': '#2b2826',
        // Flower Pot.Layer 2.Group 1.Group 1.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.0.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 2.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.1.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 3.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.2.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 4.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.3.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 5.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.4.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 6.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.5.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 7.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.6.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 8.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.7.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 9.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.8.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 10.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.9.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 11.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.10.it.0.it.1.c.k': '#46504e',
        // Flower Pot.Layer 2.Group 1.Group 12.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.11.it.0.it.1.c.k': '#46504e',
        // Char.Layer 8.Group 1.Fill 1
        'assets.1.layers.0.shapes.0.it.1.c.k': '#e6e4df',
        // Char.Layer 7.Group 1.Fill 1
        'assets.1.layers.1.shapes.0.it.1.c.k': '#b4b8b6',
        // Char.Layer 5.Group 1.Fill 1
        'assets.1.layers.3.shapes.0.it.1.c.k': '#e6e4df',
        // Char.Layer 4.Group 1.Fill 1
        'assets.1.layers.4.shapes.0.it.1.c.k': '#e6e4df',
        // Char.Layer 3.Group 1.Fill 1
        'assets.1.layers.5.shapes.0.it.1.c.k': '#e6e4df',
        // Char.Layer 2.Group 1.Fill 1
        'assets.1.layers.6.shapes.0.it.1.c.k': '#b4b8b6',
        // Char.Layer 12.Group 1.Stroke 1
        'assets.1.layers.7.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char.Layer 11.Group 1.Stroke 1
        'assets.1.layers.8.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char.Layer 10.Group 1.Stroke 1
        'assets.1.layers.9.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char.Layer 9.Group 1.Stroke 1
        'assets.1.layers.10.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char.Isolation Mode 17.Group 1.Stroke 1
        'assets.2.layers.10.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode 31.Group 1.Fill 1
        'assets.4.layers.0.shapes.0.it.1.c.k': '#2b2826',
        // Face.Isolation Mode 30.Group 1.Fill 1
        'assets.4.layers.1.shapes.0.it.1.c.k': '#2b2826',
        // Face.Isolation Mode 27.Group 1.Stroke 1
        'assets.4.layers.3.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode 26.Group 1.Fill 1
        'assets.4.layers.6.shapes.0.it.1.c.k': '#2b2826',
        // Face.Isolation Mode 24.Group 1.Fill 1
        'assets.4.layers.9.shapes.0.it.1.c.k': '#2b2826',
        // Face.Isolation Mode 13.Group 1.Fill 1
        'assets.4.layers.11.shapes.0.it.1.c.k': '#2b2826',
        // Face.Isolation Mode 6.Group 1.Fill 1
        'assets.4.layers.14.shapes.0.it.1.c.k': '#2b2826',
        // Face.Isolation Mode 5.Group 1.Fill 1
        'assets.4.layers.15.shapes.0.it.1.c.k': '#2b2826',
        // 4 Char.Isolation Mode 30.Group 1.Stroke 1
        'assets.5.layers.5.shapes.0.it.1.c.k': theme.charlestonGreen,
        // 4 Char.Isolation Mode 38.Group 1.Stroke 1
        'assets.5.layers.12.shapes.0.it.1.c.k': theme.charlestonGreen,
        // 4 Char.Isolation Mode 37.Group 1.Stroke 1
        'assets.5.layers.13.shapes.0.it.1.c.k': theme.charlestonGreen,
        // 4 Char.Layer 6.Group 1.Fill 1
        'assets.5.layers.27.shapes.0.it.1.c.k': '#b4b8b6',
        // 4 Char.Layer 2.Group 1.Fill 1
        'assets.5.layers.32.shapes.0.it.1.c.k': '#b4b8b6',
        // Face.Isolation Mode 33.Group 1.Stroke 1
        'assets.6.layers.5.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Smile'.Group 1.Stroke 1
        'assets.6.layers.6.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Face.Isolation Mode 49.Group 5.Fill 1
        'assets.6.layers.9.shapes.0.it.1.c.k': '#2b2826',
        // Face.Isolation Mode 54.Group 9.Fill 1
        'assets.6.layers.16.shapes.0.it.1.c.k': '#2b2826',
        // Hand.Isolation Mode 29.Group 1.Stroke 1
        'assets.7.layers.0.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Hand.Isolation Mode 28.Group 1.Stroke 1
        'assets.7.layers.1.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Hand.Isolation Mode 27.Group 1.Stroke 1
        'assets.7.layers.2.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Hand.Isolation Mode 26.Group 1.Stroke 1
        'assets.7.layers.3.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Char blue 2.Layer 14.Group 1.Fill 1
        'assets.8.layers.5.shapes.0.it.1.c.k': '#b4b8b6',
        // Char blue 2.Layer 12.Group 1.Fill 1
        'assets.8.layers.6.shapes.0.it.1.c.k': '#e6e4df',
        // Char blue 2.Layer 12.Group 2.Fill 1
        'assets.8.layers.6.shapes.1.it.1.c.k': '#b4b8b6',
        // Char.Isolation Mode 13.Group 1.Fill 1
        'assets.9.layers.12.shapes.0.it.1.c.k': '#2b2826',
        // Char.Isolation Mode 8.Group 1.Fill 1
        'assets.9.layers.17.shapes.0.it.1.c.k': '#2b2826',
        // Char.Layer 7.Group 1.Fill 1
        'assets.9.layers.26.shapes.0.it.1.c.k': '#b4b8b6',
        // Char.Layer 4.Group 1.Fill 1
        'assets.9.layers.29.shapes.0.it.1.c.k': '#b4b8b6',
        // Char.Layer 3.Group 1.Fill 1
        'assets.9.layers.30.shapes.0.it.1.c.k': '#e6e4df',
        // Char.Layer 3.Group 2.Fill 1
        'assets.9.layers.30.shapes.1.it.1.c.k': '#b4b8b6',
        // Face.Isolation Mode 37.Group 1.Fill 1
        'assets.10.layers.5.shapes.0.it.1.c.k': '#2b2826',
        // Face.Isolation Mode 34.Group 1.Fill 1
        'assets.10.layers.9.shapes.0.it.1.c.k': '#2b2826',
        // Hand.Isolation Mode 30.Group 1.Stroke 1
        'assets.11.layers.0.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Hand.Isolation Mode 29.Group 1.Stroke 1
        'assets.11.layers.1.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Hand.Isolation Mode 28.Group 1.Stroke 1
        'assets.11.layers.2.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Hand.Isolation Mode 27.Group 1.Stroke 1
        'assets.11.layers.3.shapes.0.it.1.c.k': theme.charlestonGreen,
      }),
    [],
  );

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(PeopleGatheringAnimation);
