import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import LoveCalendar from '@/assets/animations/love-calendar.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'>;

const LoveCalendarAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const backgroundColor = (isDark ? tw.color('black') : tw.color('white')) as string;
    const borderColor = (isDark ? tw.color('zinc-800') : tw.color('black')) as string;
    const tearoutBackgroundColor = (isDark ? tw.color('gray-700') : tw.color('gray-300')) as string; // '#eaeaea'
    const tearoutBorderColor = (isDark ? tw.color('zinc-800') : tw.color('zinc-800')) as string; // '#231f20'
    const heartColor = (isDark ? tw.color('pink-800') : tw.color('red-600')) as string;
    const bindingColor = (isDark ? tw.color('red-800') : tw.color('red-600')) as string;
    return colouriseLottie(LoveCalendar, {
      // tearout.Group 1.Stroke 1
      'layers.0.shapes.0.it.1.c.k': tearoutBorderColor,
      // tearout.Group 1.Fill 1
      'layers.0.shapes.0.it.2.c.k': tearoutBackgroundColor,
      // Love.Group 1.Fill 1
      'layers.1.shapes.0.it.1.c.k.0.s': backgroundColor,
      // Love.Group 1.Fill 1
      'layers.1.shapes.0.it.1.c.k.1.s': heartColor,
      // Base Calendar.Group 1.Group 1.Group 1.Fill 1
      'layers.3.shapes.0.it.0.it.0.it.1.c.k': borderColor,
      // Base Calendar.Group 1.Group 2.Group 1.Fill 1
      'layers.3.shapes.0.it.1.it.0.it.1.c.k': borderColor,
      // Base Calendar.Group 2.Group 1.Group 1.Fill 1
      'layers.3.shapes.1.it.0.it.0.it.2.c.k': borderColor,
      // Base Calendar.Group 2.Group 1.Group 2.Fill 1
      'layers.3.shapes.1.it.0.it.1.it.1.c.k': backgroundColor,
      // Base Calendar.Group 2.Group 2.Group 1.Fill 1
      'layers.3.shapes.1.it.1.it.0.it.2.c.k': borderColor,
      // Base Calendar.Group 2.Group 2.Group 2.Fill 1
      'layers.3.shapes.1.it.1.it.1.it.1.c.k': bindingColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(LoveCalendarAnimation);
