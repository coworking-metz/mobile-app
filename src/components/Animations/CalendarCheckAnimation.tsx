import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import CalendarCheck from '@/assets/animations/calendar-check.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const CalendarCheckAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const dateColor = tw.color('amber-800') as string;
    const handleColor = tw.color('neutral-900') as string;
    const calendarColor = tw.color('zinc-700') as string;
    return colouriseLottie(CalendarCheck, {
      // Miunute.Minute.Stroke 1
      'layers.1.shapes.0.it.1.c.k': dateColor,
      // Hour.Hour.Stroke 1
      'layers.2.shapes.0.it.1.c.k': dateColor,
      // Clock Outer.Clock outer.Inner.Stroke 1
      'layers.3.shapes.0.it.0.it.1.c.k': dateColor,
      // Day.Hero Date.Stroke 1
      'layers.4.shapes.0.it.1.c.k': dateColor,
      // Matte.Clock outer.Inner.Fill 2
      'layers.5.shapes.0.it.0.it.1.c.k': dateColor,
      // Matte.Clock outer.Inner.Stroke 1
      'layers.5.shapes.0.it.0.it.2.c.k': calendarColor,
      // Calendar.Group 1.Stroke 1
      'layers.6.shapes.0.it.1.c.k': handleColor,
      // Calendar.Group 2.Stroke 2
      'layers.6.shapes.1.it.1.c.k': handleColor,
      // Calendar.Stroke 1
      'layers.6.shapes.16.c.k': calendarColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(CalendarCheckAnimation);
