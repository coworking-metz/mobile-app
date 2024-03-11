import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import ScrollDownEasey from '@/assets/animations/lottieflow/scroll-down-easey.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const ScrollDownAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const color = (colorScheme === 'dark' ? tw.color('gray-400') : tw.color('gray-500')) as string;
    return colouriseLottie(ScrollDownEasey, {
      // top 2.arrow.Stroke 1
      'layers.0.shapes.0.it.1.c.k': color,
      // Scroll down/top_v6.Group 1.Stroke 1
      'layers.1.shapes.0.it.1.c.k': color,
      // Scroll down/top_v5.Group 1.Stroke 1
      'layers.2.shapes.0.it.1.c.k': color,
      // Scroll down/top_v3.Group 1.Stroke 1
      'layers.3.shapes.0.it.1.c.k': color,
      // Scroll down/top_v2.Group 1.Stroke 1
      'layers.4.shapes.0.it.1.c.k': color,
      // top.arrow.Stroke 1
      'layers.5.shapes.0.it.1.c.k': color,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} loop {...props} autoPlay source={colorizedSource} />;
};

export default forwardRef(ScrollDownAnimation);
