import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import PeopleMeeting from '@/assets/animations/people-meeting.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const PeopleMeetingAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(PeopleMeeting, {
        // Char.Up hand.Group 1.Fill 1
        'assets.2.layers.1.shapes.0.it.1.c.k': '#29245c',
        // Char.Body.Group 1.Fill 1
        'assets.2.layers.9.shapes.0.it.1.c.k': '#29245c',
        // Righer character right leg
        'assets.2.layers.11.shapes.0.it.1.c.k': '#14b3aa',
        // Righer character right feet
        'assets.2.layers.12.shapes.1.it.1.c.k': '#171E21',
        // Righer character left leg
        'assets.2.layers.14.shapes.0.it.1.c.k': '#14b3aa',
        // Righer character left feet
        'assets.2.layers.15.shapes.1.it.1.c.k': '#171E21',
        // Char.Up hand.Group 2.Fill 1
        'assets.2.layers.19.shapes.0.it.1.c.k': '#242052',
        // 4 Char.Isolation Mode 34.Group 1.Fill 1
        'assets.5.layers.1.shapes.0.it.1.c.k': '#c45d3d',
        // 4 Char.Isolation Mode 2.Group 1.Fill 1
        'assets.5.layers.3.shapes.0.it.1.c.k': '#5b1d0e',
        // 4 Char.Isolation Mode 36.Group 1.Stroke 1
        'assets.5.layers.8.shapes.0.it.1.c.k': '#c45d3d',
        // 4 Char.Isolation Mode 35.Group 1.Stroke 1
        'assets.5.layers.9.shapes.0.it.1.c.k': '#c45d3d',
        // 4 Char.Up hand.Group 1.Fill 1
        'assets.5.layers.14.shapes.0.it.1.c.k': '#14b3aa',
        // 4 Char.Shoes.Group 1.Group 2.Fill 1
        'assets.5.layers.16.shapes.0.it.1.it.1.c.k': '#29245c',
        // 4 Char.Shoes.Group 1.Group 2.Fill 1
        'assets.5.layers.18.shapes.0.it.1.it.1.c.k': '#29245c',
        // 4 Char.Body.Group 1.Fill 1
        'assets.5.layers.20.shapes.0.it.1.c.k': '#14b3aa',
        // 4 Char.Isolation Mode 12.Group 1.Fill 1
        'assets.5.layers.21.shapes.0.it.1.c.k': '#e5007e',
        // 4 Char.Up hand.Group 1.Fill 1
        'assets.5.layers.25.shapes.0.it.1.c.k': '#14b3aa',
        // 4 Char.Layer 5.Group 1.Stroke 1
        'assets.5.layers.28.shapes.0.it.1.c.k': '#171E21',
        // 4 Char.Layer 7.Group 1.Stroke 1
        'assets.5.layers.29.shapes.0.it.1.c.k': '#171E21',
        // 4 Char.Layer 4.Group 1.Stroke 1
        'assets.5.layers.30.shapes.0.it.1.c.k': '#171E21',
        // 4 Char.Layer 3.Group 1.Stroke 1
        'assets.5.layers.31.shapes.0.it.1.c.k': '#171E21',
        // Face.Isolation Mode 43.Group 1.Stroke 1
        'assets.6.layers.2.shapes.0.it.1.c.k': '#e5007e',
        // Face.Isolation Mode 42.Group 1.Stroke 1
        'assets.6.layers.3.shapes.0.it.1.c.k': '#e5007e',
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
        'assets.6.layers.22.shapes.0.it.1.c.k': '#171E21',
        // Face.Isolation Mode.Group 1.Fill 1
        'assets.6.layers.23.shapes.0.it.1.c.k': '#5b1d0e',
        // Char blue 2.Layer 19.Group 1.Stroke 1
        'assets.8.layers.0.shapes.0.it.1.c.k': '#171E21',
        // Char blue 2.Layer 18.Group 1.Stroke 1
        'assets.8.layers.1.shapes.0.it.1.c.k': '#171E21',
        // Char blue 2.Layer 17.Group 1.Stroke 1
        'assets.8.layers.2.shapes.0.it.1.c.k': '#171E21',
        // Char blue 2.Layer 16.Group 1.Stroke 1
        'assets.8.layers.3.shapes.0.it.1.c.k': '#171E21',
        // Char blue 2.Layer 15.Group 1.Stroke 1
        'assets.8.layers.4.shapes.0.it.1.c.k': '#171E21',
        // Char blue 2.body.Group 1.Fill 1
        'assets.8.layers.7.shapes.0.it.1.c.k': '#29245c',
        // Char blue 2.Layer 9.Group 1.Fill 1
        'assets.8.layers.8.shapes.0.it.1.c.k': '#14b3aa',
        // Char blue 2.Up hand.Group 1.Fill 1
        'assets.8.layers.9.shapes.0.it.1.c.k': '#29245c',
        // Char blue 2.Up hand 2.Group 1.Fill 1
        'assets.8.layers.13.shapes.0.it.1.c.k': '#29245c',
        // Char blue 2.Layer 7.Group 1.Fill 1
        'assets.8.layers.17.shapes.0.it.1.c.k': '#171E21',
        // Char blue 2.Layer 5.Group 1.Fill 1
        'assets.8.layers.19.shapes.0.it.1.c.k': '#14b3aa',
        // Char blue 2.Layer 2.Group 1.Fill 1
        'assets.8.layers.20.shapes.0.it.1.c.k': '#29245c',
        // Char blue 2.Leg.Group 1.Fill 1
        'assets.8.layers.21.shapes.0.it.1.c.k': '#14b3aa',
        // Char blue 2.Sheos.Group 1.Fill 1
        'assets.8.layers.22.shapes.0.it.1.c.k': '#29245c',
        // Char.Up hand.Group 1.Fill 1
        'assets.9.layers.5.shapes.0.it.1.c.k': '#e5007e',
        // Char.Body.Group 1.Fill 1
        'assets.9.layers.8.shapes.0.it.1.c.k': '#e5007e',
        // Char.Up leg.Group 1.Fill 1
        'assets.9.layers.9.shapes.0.it.1.c.k': '#151f49',
        // Char.Lo leg.Group 1.Fill 1
        'assets.9.layers.10.shapes.0.it.1.c.k': '#151f49',
        // Char.Isolation Mode 11.Group 1.Fill 1
        'assets.9.layers.11.shapes.0.it.1.c.k': '#151f49',
        // Char.Isolation Mode 12.Group 1.Fill 1
        'assets.9.layers.13.shapes.0.it.1.c.k': '#de1f70',
        // Char.Up leg.Group 1.Fill 1
        'assets.9.layers.14.shapes.0.it.1.c.k': '#151f49',
        // Char.Lo leg.Group 1.Fill 1
        'assets.9.layers.15.shapes.0.it.1.c.k': '#151f49',
        // Char.Isolation Mode 6.Group 1.Fill 1
        'assets.9.layers.16.shapes.0.it.1.c.k': '#151f49',
        // Char.Shoes.Group 1.Fill 1
        'assets.9.layers.18.shapes.0.it.1.c.k': '#de1f70',
        // Char.Isolation Mode 4.Group 1.Fill 1
        'assets.9.layers.19.shapes.0.it.1.c.k': '#151f49',
        // Char.Isolation Mode 3.Group 1.Fill 1
        'assets.9.layers.20.shapes.0.it.1.c.k': '#151f49',
        // Char.Isolation Mode 2.Group 1.Fill 1
        'assets.9.layers.21.shapes.0.it.1.c.k': '#151f49',
        // Char.Up hand 2.Group 1.Fill 1
        'assets.9.layers.24.shapes.0.it.1.c.k': '#e5007e',
        // Char.Layer 6.Group 1.Stroke 1
        'assets.9.layers.27.shapes.0.it.1.c.k': '#171E21',
        // Char.Layer 5.Group 1.Stroke 1
        'assets.9.layers.28.shapes.0.it.1.c.k': '#171E21',
        // Char.Layer 2.Group 1.Stroke 1
        'assets.9.layers.31.shapes.0.it.1.c.k': '#171E21',
        // Face.Isolation Mode 39.Group 1.Stroke 1
        'assets.10.layers.1.shapes.0.it.1.c.k': '#171E21',
        // Face.Isolation Mode 38.Group 1.Stroke 1
        'assets.10.layers.3.shapes.0.it.1.c.k': '#171E21',
        // Face.Isolation Mode 35.Group 1.Stroke 1
        'assets.10.layers.7.shapes.0.it.1.c.k': '#171E21',
        // Face.Isolation Mode 31.Group 1.Fill 1
        'assets.10.layers.12.shapes.0.it.1.c.k': '#171E21',
      }),
    [],
  );

  return <LottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(PeopleMeetingAnimation);
