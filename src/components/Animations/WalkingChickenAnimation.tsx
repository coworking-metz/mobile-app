import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import WalkingChicken from '@/assets/animations/walking-chicken.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const WalkingChickenAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    return colouriseLottie(WalkingChicken, {
      // Eye.Rectangle 1.Stroke 1
      'layers.1.shapes.0.it.1.c.k': '#d2bf39',
      // Eye.Rectangle 1.Fill 1
      'layers.1.shapes.0.it.2.c.k': '#272727',
      // R Hand.Shape 1.Stroke 1
      'layers.2.shapes.0.it.1.c.k': '#d2bf39',
      // Briefcase.Shape 1.Stroke 1
      'layers.3.shapes.0.it.1.c.k': '#ff7832',
      // Briefcase.Shape 1.Fill 1
      'layers.3.shapes.0.it.2.c.k': '#b29f9b',
      // Briefcase.Rectangle 2.Stroke 1
      'layers.3.shapes.1.it.1.c.k': '#ff7832',
      // Briefcase.Rectangle 2.Fill 1
      'layers.3.shapes.1.it.2.c.k': '#b29f9b',
      // Briefcase.Rectangle 1.Stroke 1
      'layers.3.shapes.2.it.1.c.k': '#ff7832',
      // Briefcase.Rectangle 1.Fill 1
      'layers.3.shapes.2.it.2.c.k': '#998985',
      // Mouth.Mouth.Stroke 1
      'layers.4.shapes.0.it.1.c.k': '#f0712f',
      // Mouth.Mouth.Mouth 2.Stroke 1
      'layers.4.shapes.0.it.2.it.1.c.k': '#f0712f',
      // Body.Body.Stroke 1
      'layers.5.shapes.0.it.1.c.k': '#ffe845',
      // Body.Body.Fill 1
      'layers.5.shapes.0.it.2.c.k': '#f8e243',
      // R Hand 2.Shape 1.Stroke 1
      'layers.6.shapes.0.it.1.c.k': '#d2bf39',
      // R Leg 2.Shape 2.Stroke 1
      'layers.7.shapes.0.it.1.c.k': '#d2bf39',
      // R Leg.Shape 2.Stroke 1
      'layers.8.shapes.0.it.1.c.k': '#f8e243',
      // Jhuti.Jhuti.Stroke 1
      'layers.9.shapes.0.it.1.c.k': '#f0712f',
      // Jhuti.Jhuti.Jhuti 2.Stroke 1
      'layers.9.shapes.0.it.2.it.1.c.k': '#f0712f',
      // Jhuti.Jhuti.Jhuti 3.Stroke 1
      'layers.9.shapes.0.it.3.it.1.c.k': '#f0712f',
      // Jhuti.Jhuti.Jhuti 4.Stroke 1
      'layers.9.shapes.0.it.4.it.1.c.k': '#f0712f',
      // Tail.Tail.Stroke 1
      'layers.10.shapes.0.it.1.c.k': '#f8e243',
      // Shadow.Ellipse 1.Stroke 1
      'layers.11.shapes.0.it.1.c.k': '#d2bf39',
      // Shadow.Ellipse 1.Fill 1
      'layers.11.shapes.0.it.2.c.k': '#dddddd',
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(WalkingChickenAnimation);
