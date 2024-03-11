import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import WorkOnTheGo from '@/assets/animations/work-on-the-go.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const WorkOnTheGoAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(WorkOnTheGo, {
        // element.Shape Layer 3.Shape 1.Stroke 1
        'assets.1.layers.0.shapes.0.it.1.c.k': '#000000',
        // element.Shape Layer 2.Shape 1.Stroke 1
        'assets.1.layers.1.shapes.0.it.1.c.k': '#000000',
        // element.Shape Layer 1.Shape 1.Stroke 1
        'assets.1.layers.2.shapes.0.it.1.c.k': '#000000',
        // element.Layer 5.Group 1.Group 1.Group 1.Fill 1
        'assets.1.layers.3.shapes.0.it.0.it.0.it.1.c.k': '#ffffff',
        // element.Layer 5.Group 1.Group 1.Group 2.Fill 1
        'assets.1.layers.3.shapes.0.it.0.it.1.it.1.c.k': '#ffffff',
        // element.Layer 5.Group 1.Group 1.Group 3.Fill 1
        'assets.1.layers.3.shapes.0.it.0.it.2.it.1.c.k': '#ffffff',
        // element.Layer 5.Group 1.Group 2.Fill 1
        'assets.1.layers.3.shapes.0.it.1.it.1.c.k': '#cab6a7',
        // element.Layer 5.Group 1.Group 3.Fill 1
        'assets.1.layers.3.shapes.0.it.2.it.1.c.k': '#cab6a7',
        // element.Layer 4.Group 1.Group 1.Group 1.Fill 1
        'assets.1.layers.4.shapes.0.it.0.it.0.it.1.c.k': '#ffffff',
        // element.Layer 4.Group 1.Group 1.Group 2.Fill 1
        'assets.1.layers.4.shapes.0.it.0.it.1.it.1.c.k': '#ffffff',
        // element.Layer 4.Group 1.Group 1.Group 3.Fill 1
        'assets.1.layers.4.shapes.0.it.0.it.2.it.1.c.k': '#ffffff',
        // element.Layer 4.Group 1.Group 2.Fill 1
        'assets.1.layers.4.shapes.0.it.1.it.1.c.k': '#cab6a7',
        // element.Layer 4.Group 1.Group 3.Fill 1
        'assets.1.layers.4.shapes.0.it.2.it.1.c.k': '#cab6a7',
        // element.Layer 3.Group 1.Stroke 1
        'assets.1.layers.5.shapes.0.it.1.c.k': '#ffffff',
        // element.Layer 3.Group 2.Stroke 1
        'assets.1.layers.5.shapes.1.it.1.c.k': '#ffffff',
        // element.Layer 3.Group 3.Stroke 1
        'assets.1.layers.5.shapes.2.it.1.c.k': '#ffffff',
        // element.Layer 3.Group 4.Group 1.Fill 1
        'assets.1.layers.5.shapes.3.it.0.it.1.c.k': '#7c92ff',
        // element.Layer 3.Group 4.Group 2.Fill 1
        'assets.1.layers.5.shapes.3.it.1.it.1.c.k': '#7c92ff',
        // element.laptop.Group 1.Group 1.Fill 1
        'assets.1.layers.7.shapes.0.it.0.it.1.c.k': '#80969d',
        // element.laptop.Group 1.Group 2.Fill 1
        'assets.1.layers.7.shapes.0.it.1.it.1.c.k': '#090b0c',
        // element.laptop.Group 1.Group 3.Fill 1
        'assets.1.layers.7.shapes.0.it.2.it.1.c.k': '#3d5057',
        // element.laptop.Group 2.Fill 1
        'assets.1.layers.7.shapes.1.it.1.c.k': '#090b0c',
        // element.head.Group 1.Fill 1
        'assets.1.layers.8.shapes.0.it.1.c.k': '#171e21',
        // element.head.Group 2.Fill 1
        'assets.1.layers.8.shapes.1.it.1.c.k': '#171e21',
        // element.head.Group 3.Group 1.Fill 1
        'assets.1.layers.8.shapes.2.it.0.it.1.c.k': '#ffffff',
        // element.head.Group 3.Group 2.Group 1.Stroke 1
        'assets.1.layers.8.shapes.2.it.1.it.0.it.1.c.k': '#ffffff',
        // element.head.Group 3.Group 2.Group 2.Stroke 1
        'assets.1.layers.8.shapes.2.it.1.it.1.it.1.c.k': '#ffffff',
        // element.head.Group 3.Group 2.Group 3.Stroke 1
        'assets.1.layers.8.shapes.2.it.1.it.2.it.1.c.k': '#ffffff',
        // element.head.Group 3.Group 2.Group 4.Stroke 1
        'assets.1.layers.8.shapes.2.it.1.it.3.it.1.c.k': '#ffffff',
        // element.head.Group 3.Group 3.Fill 1
        'assets.1.layers.8.shapes.2.it.2.it.1.c.k': '#171e21',
        // element.head.Group 3.Group 4.Fill 1
        'assets.1.layers.8.shapes.2.it.3.it.1.c.k': '#171e21',
        // element.head.Group 3.Group 5.Fill 1
        'assets.1.layers.8.shapes.2.it.4.it.1.c.k': '#171e21',
        // element.head.Group 3.Group 6.Fill 1
        'assets.1.layers.8.shapes.2.it.5.it.1.c.k': '#171e21',
        // element.head.Group 3.Group 7.Stroke 1
        'assets.1.layers.8.shapes.2.it.6.it.1.c.k': '#171e21',
        // element.head.Group 4.Group 1.Stroke 1
        'assets.1.layers.8.shapes.3.it.0.it.1.c.k': '#171e21',
        // element.head.Group 4.Group 2.Fill 1
        'assets.1.layers.8.shapes.3.it.1.it.1.c.k': '#ca8055',
        // element.head.Group 5.Fill 1
        'assets.1.layers.8.shapes.4.it.1.c.k': '#171e21',
        // element.head.Group 6.Fill 1
        'assets.1.layers.8.shapes.5.it.1.c.k': '#ca8055',
        // element.head.Group 7.Fill 1
        'assets.1.layers.8.shapes.6.it.1.c.k': '#b16941',
        // element.l hand.Group 1.Group 1.Stroke 1
        'assets.1.layers.9.shapes.0.it.0.it.1.c.k': '#ffffff',
        // element.l hand.Group 1.Group 2.Stroke 1
        'assets.1.layers.9.shapes.0.it.1.it.1.c.k': '#9761ff',
        // element.l hand.Group 1.Group 3.Fill 1
        'assets.1.layers.9.shapes.0.it.2.it.1.c.k': '#9761ff',
        // element.l hand.Group 2.Group 2.Fill 1
        'assets.1.layers.9.shapes.1.it.0.it.1.c.k': '#ca8055',
        // element.l arm.Group 1.Stroke 1
        'assets.1.layers.10.shapes.0.it.1.c.k': '#ffffff',
        // element.l arm.Group 2.Fill 1
        'assets.1.layers.10.shapes.1.it.1.c.k': '#9761ff',
        // element.body.Group 1.Fill 1
        'assets.1.layers.11.shapes.0.it.1.c.k': '#ca8055',
        // element.body.Group 2.Fill 1
        'assets.1.layers.11.shapes.1.it.1.c.k': '#b76c48',
        // element.body.Group 3.Fill 1
        'assets.1.layers.11.shapes.2.it.1.c.k': '#ca8055',
        // element.body.Group 4.Group 1.Stroke 1
        'assets.1.layers.11.shapes.3.it.0.it.0.c.k': '#dedada',
        // element.body.Group 4.Group 2.Fill 1
        'assets.1.layers.11.shapes.3.it.1.it.1.c.k': '#9761ff',
        // element.r hand.Group 1.Group 1.Fill 1
        'assets.1.layers.12.shapes.0.it.0.it.1.c.k': '#9761ff',
        // element.r hand.Group 1.Group 2.Group 2.Fill 1
        'assets.1.layers.12.shapes.0.it.1.it.0.it.1.c.k': '#ca8055',
        // element. r arm.Group 2.Fill 1
        'assets.1.layers.13.shapes.0.it.1.c.k': '#9761ff',
        // element.l thigh.Group 2.Fill 1
        'assets.1.layers.14.shapes.0.it.1.c.k': '#ffdf57',
        // element. l leg.Group 1.Group 1.Fill 1
        'assets.1.layers.15.shapes.0.it.0.it.1.c.k': '#ffdf57',
        // element. l leg.Group 2.Group 1.Group 1.Group 1.Fill 1
        'assets.1.layers.15.shapes.1.it.0.it.0.it.0.it.1.c.k': '#3d5057',
        // element. l leg.Group 2.Group 1.Group 1.Group 2.Fill 1
        'assets.1.layers.15.shapes.1.it.0.it.0.it.1.it.1.c.k': '#090b0c',
        // element. l leg.Group 2.Group 2.Fill 1
        'assets.1.layers.15.shapes.1.it.1.it.1.c.k': '#ca8055',
        // element.r leg.Group 1.Fill 1
        'assets.1.layers.16.shapes.0.it.1.c.k': '#e4bd16',
        // element.r leg.Group 2.Group 1.Group 1.Group 1.Fill 1
        'assets.1.layers.16.shapes.1.it.0.it.0.it.0.it.1.c.k': '#3d5057',
        // element.r leg.Group 2.Group 1.Group 1.Group 2.Fill 1
        'assets.1.layers.16.shapes.1.it.0.it.0.it.1.it.1.c.k': '#090b0c',
        // element.r leg.Group 2.Group 2.Fill 1
        'assets.1.layers.16.shapes.1.it.1.it.1.c.k': '#ca8055',
        // element.Layer 2.Group 1.Fill 1
        'assets.1.layers.17.shapes.0.it.1.c.k': '#7c92ff',
        // element.Layer 2.Group 2.Fill 1
        'assets.1.layers.17.shapes.1.it.1.c.k': '#000103',
        // element.Layer 2.Group 3.Fill 1
        'assets.1.layers.17.shapes.2.it.1.c.k': '#000103',
        // element.Layer 2.Group 4.Group 1.Fill 1
        'assets.1.layers.17.shapes.3.it.0.it.1.c.k': '#f2eeea',
        // element.Layer 2.Group 4.Group 2.Fill 1
        'assets.1.layers.17.shapes.3.it.1.it.1.c.k': '#f2eeea',
        // element.Layer 2.Group 4.Group 3.Fill 1
        'assets.1.layers.17.shapes.3.it.2.it.1.c.k': '#f2eeea',
        // element.Layer 1.Group 2.Stroke 1
        'assets.1.layers.18.shapes.0.it.1.c.k': '#bfafa7',
      }),
    [],
  );

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(WorkOnTheGoAnimation);
