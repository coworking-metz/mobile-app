import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import HappySun from '@/assets/animations/happy-sun.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const HappySunAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const phoneBezel = (isDark ? tw.color('zinc-950') : tw.color('white')) as string;
    const phoneButtons = (isDark ? tw.color('zinc-700') : '#eaeaea') as string;
    const phoneScreen = (isDark ? tw.color('zinc-600') : '#eaeaea') as string;
    const animatedShadow = (isDark ? tw.color('gray-400') : '#201d1d') as string;
    const stillShadow = (isDark ? tw.color('zinc-800') : '#eaeaea') as string;
    const notificationBackground = (isDark ? tw.color('zinc-700') : '#ffffff') as string;
    const badgeInnerCircle = (isDark ? tw.color('black') : '#ffffff') as string;
    return colouriseLottie(HappySun, {
      // Path 6.Path 6.Fill 1
      'layers.2.shapes.0.it.2.c.k': '#cc9236',
      // Path 5.Path 5.Fill 1
      'layers.3.shapes.0.it.2.c.k': '#cc9236',
      // Path 4.Path 4.Fill 1
      'layers.4.shapes.0.it.2.c.k': '#cc9236',
      // Path 3.Path 3.Fill 1
      'layers.5.shapes.0.it.2.c.k': '#ffd073',
      // Path 2.Path 2.Fill 1
      'layers.6.shapes.0.it.2.c.k': '#f28f44',
      // Path 1.Path 1.Fill 1
      'layers.7.shapes.0.it.2.c.k': '#ffee8c',
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(HappySunAnimation);
