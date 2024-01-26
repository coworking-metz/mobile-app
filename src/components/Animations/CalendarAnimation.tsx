import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import CalendarSubscription from '@/assets/animations/calendar-subscription.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const CalendarAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const calendarBackgroundColor = (
      tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')
    ) as string;
    const calendarHeaderColor = (
      tw.prefixMatch('dark') ? tw.color('zinc-400') : '#e8e8e8'
    ) as string;
    const calendarBorderColor = (
      tw.prefixMatch('dark') ? tw.color('gray-200') : '#484848'
    ) as string;
    const cityBackgroundColor = (
      tw.prefixMatch('dark') ? tw.color('zinc-800') : '#f5f5f5'
    ) as string;
    return colouriseLottie(CalendarSubscription, {
      // estrellas/Loading-ilustracion contornos 4.Grupo 1.Trazo 1
      'assets.0.layers.0.shapes.0.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos 4.Grupo 2.Trazo 1
      'assets.0.layers.0.shapes.1.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos 5.Grupo 1.Trazo 1
      'assets.0.layers.1.shapes.0.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos 5.Grupo 2.Trazo 1
      'assets.0.layers.1.shapes.1.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos 3.Grupo 1.Trazo 1
      'assets.0.layers.2.shapes.0.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos 3.Grupo 2.Trazo 1
      'assets.0.layers.2.shapes.1.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos 2.Grupo 1.Trazo 1
      'assets.0.layers.3.shapes.0.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos 2.Grupo 2.Trazo 1
      'assets.0.layers.3.shapes.1.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos.Grupo 1.Trazo 1
      'assets.0.layers.4.shapes.0.it.1.c.k': '#ffc107',
      // estrellas/Loading-ilustracion contornos.Grupo 2.Trazo 1
      'assets.0.layers.4.shapes.1.it.1.c.k': '#ffc107',
      // 1/calendario contornos.Grupo 1.Relleno 1
      'assets.1.layers.0.shapes.0.it.1.c.k': '#ffd146',
      // 7/calendario contornos.Grupo 1.Relleno 1
      'assets.1.layers.1.shapes.0.it.1.c.k': '#ffd146',
      // dia/calendario contornos.Grupo 1.Relleno 1
      'assets.1.layers.2.shapes.0.it.1.c.k': '#f1b605',
      // 5/calendario contornos.Grupo 1.Relleno 1
      'assets.1.layers.3.shapes.0.it.1.c.k': '#ffd146',
      // 4/calendario contornos.Grupo 1.Relleno 1
      'assets.1.layers.4.shapes.0.it.1.c.k': '#ffd146',
      // 3/calendario contornos 2.Grupo 1.Relleno 1
      'assets.1.layers.5.shapes.0.it.1.c.k': '#ffd146',
      // 3/calendario contornos.Grupo 1.Relleno 1
      'assets.1.layers.6.shapes.0.it.1.c.k': '#ffd146',
      // 2/calendario contornos.Grupo 1.Relleno 1
      'assets.1.layers.7.shapes.0.it.1.c.k': '#ffd146',
      // check/calendario contornos.Grupo 1.Trazo 1
      'layers.1.shapes.0.it.1.c.k': '#ffffff',
      // calendario/calendario contornos.Grupo 1.Trazo 1
      'layers.3.shapes.0.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 2.Trazo 1
      'layers.3.shapes.1.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 3.Trazo 1
      'layers.3.shapes.2.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 4.Trazo 1
      'layers.3.shapes.3.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 5.Trazo 1
      'layers.3.shapes.4.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 6.Trazo 1
      'layers.3.shapes.5.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 7.Trazo 1
      'layers.3.shapes.6.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 8.Trazo 1
      'layers.3.shapes.7.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 9.Relleno 1
      'layers.3.shapes.8.it.1.c.k': calendarBackgroundColor,
      // calendario/calendario contornos.Grupo 10.Trazo 1
      'layers.3.shapes.9.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 11.Relleno 1
      'layers.3.shapes.10.it.1.c.k': calendarBackgroundColor,
      // calendario/calendario contornos.Grupo 12.Trazo 1
      'layers.3.shapes.11.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 13.Relleno 1
      'layers.3.shapes.12.it.1.c.k': calendarBackgroundColor,
      // calendario/calendario contornos.Grupo 14.Trazo 1
      'layers.3.shapes.13.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 15.Relleno 1
      'layers.3.shapes.14.it.1.c.k': calendarBackgroundColor,
      // calendario/calendario contornos.Grupo 16.Trazo 1
      'layers.3.shapes.15.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 17.Relleno 1
      'layers.3.shapes.16.it.1.c.k': calendarBackgroundColor,
      // calendario/calendario contornos.Grupo 18.Trazo 1
      'layers.3.shapes.17.it.1.c.k': calendarBorderColor,
      // calendario/calendario contornos.Grupo 19.Relleno 1
      'layers.3.shapes.18.it.1.c.k': calendarBackgroundColor,
      // calendario/calendario contornos.Grupo 20.Relleno 1
      'layers.3.shapes.19.it.1.c.k': calendarHeaderColor,
      // calendario/calendario contornos.Grupo 21.Relleno 1
      'layers.3.shapes.20.it.1.c.k': calendarBackgroundColor,
      // fondo/calendario contornos.Grupo 1.Relleno 1
      'layers.4.shapes.0.it.1.c.k': cityBackgroundColor,
    });
  }, [color, colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(CalendarAnimation);
