import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import NotifiedMan from '@/assets/animations/notified-man.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const NotifiedManAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(NotifiedMan, {
        // main.Layer 2.Group 1.Fill 1
        'assets.0.layers.0.shapes.0.it.1.c.k': '#f76567',
        // main.Layer 2.Group 2.Group 1.Group 1.Stroke 1
        'assets.0.layers.0.shapes.1.it.0.it.0.it.1.c.k': '#ffffff',
        // main.Layer 2.Group 2.Group 1.Group 2.Stroke 1
        'assets.0.layers.0.shapes.1.it.0.it.1.it.1.c.k': '#ffffff',
        // main.Layer 2.Group 2.Group 2.Fill 1
        'assets.0.layers.0.shapes.1.it.1.it.1.c.k': '#f76567',
        // main.tab.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.1.c.k': '#fcbc9b',
        // main.tab.Group 2.Group 1.Fill 1
        'assets.0.layers.1.shapes.1.it.0.it.1.c.k': '#80969d',
        // main.tab.Group 2.Group 2.Fill 1
        'assets.0.layers.1.shapes.1.it.1.it.1.c.k': '#3d5057',
        // main.tab.Group 2.Group 3.Fill 1
        'assets.0.layers.1.shapes.1.it.2.it.1.c.k': '#090b0c',
        // main.tab.Group 2.Group 4.Fill 1
        'assets.0.layers.1.shapes.1.it.3.it.1.c.k': '#090b0c',
        // main.l hand.Group 1.Group 1.Stroke 1
        'assets.0.layers.2.shapes.0.it.0.it.1.c.k': '#efa987',
        // main.l hand.Group 1.Group 2.Fill 1
        'assets.0.layers.2.shapes.0.it.1.it.1.c.k': '#fcbc9b',
        // main.l hand.Group 2.Group 1.Fill 1
        'assets.0.layers.2.shapes.1.it.0.it.1.c.k': '#fcbc9b',
        // main.l hand.Group 2.Group 2.Fill 1
        'assets.0.layers.2.shapes.1.it.1.it.1.c.k': '#fcbc9b',
        // main.Shape Layer 1.Shape 1.Fill 1
        'assets.0.layers.3.shapes.0.it.1.c.k': '#e7db13',
        // main.Layer 3.Group 1.Fill 1
        'assets.0.layers.4.shapes.0.it.1.c.k': '#f76567',
        // main.Layer 3.Group 2.Group 1.Group 1.Stroke 1
        'assets.0.layers.4.shapes.1.it.0.it.0.it.1.c.k': '#ffffff',
        // main.Layer 3.Group 2.Group 1.Group 2.Stroke 1
        'assets.0.layers.4.shapes.1.it.0.it.1.it.1.c.k': '#ffffff',
        // main.Layer 3.Group 2.Group 2.Fill 1
        'assets.0.layers.4.shapes.1.it.1.it.1.c.k': '#f76567',
        // main.l arm.Group 1.Group 1.Stroke 1
        'assets.0.layers.5.shapes.0.it.0.it.1.c.k': '#ffffff',
        // main.l arm.Group 1.Group 2.Fill 1
        'assets.0.layers.5.shapes.0.it.1.it.1.c.k': '#9761ff',
        // main.l arm.Group 2.Fill 1
        'assets.0.layers.5.shapes.1.it.1.c.k': '#fcbc9b',
        // main.head.Group 1.Group 1.Group 1.Stroke 1
        'assets.0.layers.6.shapes.0.it.0.it.0.it.1.c.k': '#171e21',
        // main.head.Group 1.Group 1.Group 2.Fill 1
        'assets.0.layers.6.shapes.0.it.0.it.1.it.1.c.k': '#fcbc9b',
        // main.head.Group 2.Fill 1
        'assets.0.layers.6.shapes.1.it.1.c.k': '#471f1f',
        // main.head.Group 3.Group 1.Fill 1
        'assets.0.layers.6.shapes.2.it.0.it.1.c.k': '#ffffff',
        // main.head.Group 3.Group 2.Fill 1
        'assets.0.layers.6.shapes.2.it.1.it.1.c.k': '#171e21',
        // main.head.Group 3.Group 3.Fill 1
        'assets.0.layers.6.shapes.2.it.2.it.1.c.k': '#171e21',
        // main.head.Group 3.Group 4.Fill 1
        'assets.0.layers.6.shapes.2.it.3.it.1.c.k': '#171e21',
        // main.head.Group 3.Group 5.Fill 1
        'assets.0.layers.6.shapes.2.it.4.it.1.c.k': '#171e21',
        // main.head.Group 3.Group 6.Stroke 1
        'assets.0.layers.6.shapes.2.it.5.it.1.c.k': '#171e21',
        // main.head.Group 4.Fill 1
        'assets.0.layers.6.shapes.3.it.1.c.k': '#fcbc9b',
        // main.head.Group 5.Fill 1
        'assets.0.layers.6.shapes.4.it.1.c.k': '#efa987',
        // main.head.Group 6.Fill 1
        'assets.0.layers.6.shapes.5.it.1.c.k': '#471f1f',
        // main.head.Group 7.Fill 1
        'assets.0.layers.6.shapes.6.it.1.c.k': '#471f1f',
        // main.body.Group 1.Fill 1
        'assets.0.layers.7.shapes.0.it.1.c.k': '#efa987',
        // main.body.Group 2.Fill 1
        'assets.0.layers.7.shapes.1.it.1.c.k': '#fcbc9b',
        // main.body.Group 3.Group 1.Stroke 1
        'assets.0.layers.7.shapes.2.it.0.it.1.c.k': '#ffffff',
        // main.body.Group 3.Group 2.Fill 1
        'assets.0.layers.7.shapes.2.it.1.it.1.c.k': '#9761ff',
        // main.r arm.Group 1.Fill 1
        'assets.0.layers.8.shapes.0.it.1.c.k': '#9761ff',
        // main.r arm.Group 2.Fill 1
        'assets.0.layers.8.shapes.1.it.1.c.k': '#ffac9d',
        // main.l leg.Group 1.Group 1.Stroke 1
        'assets.0.layers.9.shapes.0.it.0.it.0.c.k': '#ffffff',
        // main.l leg.Group 1.Group 2.Fill 1
        'assets.0.layers.9.shapes.0.it.1.it.1.c.k': '#00da9f',
        // main.l leg.Group 2.Group 1.Group 1.Group 1.Stroke 1
        'assets.0.layers.9.shapes.1.it.0.it.0.it.0.it.1.c.k': '#ffffff',
        // main.l leg.Group 2.Group 1.Group 1.Group 2.Stroke 1
        'assets.0.layers.9.shapes.1.it.0.it.0.it.1.it.1.c.k': '#ffffff',
        // main.l leg.Group 2.Group 1.Group 1.Group 3.Stroke 1
        'assets.0.layers.9.shapes.1.it.0.it.0.it.2.it.1.c.k': '#ffffff',
        // main.l leg.Group 2.Group 1.Group 2.Group 1.Fill 1
        'assets.0.layers.9.shapes.1.it.0.it.1.it.0.it.1.c.k': '#ffffff',
        // main.l leg.Group 2.Group 1.Group 2.Group 2.Fill 1
        'assets.0.layers.9.shapes.1.it.0.it.1.it.1.it.1.c.k': '#000000',
        // main.l leg.Group 2.Group 2.Fill 1
        'assets.0.layers.9.shapes.1.it.1.it.1.c.k': '#fcbc9b',
        // main.r leg.Group 1.Group 1.Stroke 1
        'assets.0.layers.10.shapes.0.it.0.it.1.c.k': '#ffffff',
        // main.r leg.Group 1.Group 2.Fill 1
        'assets.0.layers.10.shapes.0.it.1.it.1.c.k': '#00da9f',
        // main.r leg.Group 2.Group 1.Group 1.Group 1.Stroke 1
        'assets.0.layers.10.shapes.1.it.0.it.0.it.0.it.1.c.k': '#ffffff',
        // main.r leg.Group 2.Group 1.Group 1.Group 2.Stroke 1
        'assets.0.layers.10.shapes.1.it.0.it.0.it.1.it.1.c.k': '#ffffff',
        // main.r leg.Group 2.Group 1.Group 1.Group 3.Stroke 1
        'assets.0.layers.10.shapes.1.it.0.it.0.it.2.it.1.c.k': '#ffffff',
        // main.r leg.Group 2.Group 1.Group 2.Group 1.Fill 1
        'assets.0.layers.10.shapes.1.it.0.it.1.it.0.it.1.c.k': '#ffffff',
        // main.r leg.Group 2.Group 1.Group 2.Group 2.Fill 1
        'assets.0.layers.10.shapes.1.it.0.it.1.it.1.it.1.c.k': '#000000',
        // main.r leg.Group 2.Group 2.Fill 1
        'assets.0.layers.10.shapes.1.it.1.it.1.c.k': '#fcbc9b',
        // main.Layer 1.Group 1.Stroke 1
        'assets.0.layers.11.shapes.0.it.1.c.k': '#bfafa7',
      }),
    [],
  );

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(NotifiedManAnimation);
