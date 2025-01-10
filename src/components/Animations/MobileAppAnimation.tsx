import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import MobileApp from '@/assets/animations/mobile-app.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const MobileAppAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
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
    return colouriseLottie(MobileApp, {
      // Puce.Puce blanche.Fill 1
      // 'layers.0.shapes.0.it.1.c.k': '#ffffff',
      'layers.0.shapes.0.it.1.c.k': badgeInnerCircle,
      // // Puce.Puce bg.Stroke 1
      // 'layers.0.shapes.1.it.1.c.k': '#201d1d',
      // // Puce.Puce bg.Fill 1
      // 'layers.0.shapes.1.it.2.c.k': '#ffcc00',
      // // Notification Lines.Fill 1
      // 'layers.1.shapes.2.c.k': '#ffcc00',
      // // Badge AlloCiné.Group 14.Fill 1
      // 'layers.2.shapes.0.it.1.c.k': '#ffcc00',
      // // Badge AlloCiné.Group 13.Fill 1
      // 'layers.2.shapes.1.it.1.c.k': '#262626',
      // // Puce Stroke.Ellipse 1.Stroke 1
      // 'layers.3.shapes.0.it.1.c.k': '#000000',
      // // Puce Stroke.Ellipse 1.Fill 1
      // 'layers.3.shapes.0.it.2.c.k': '#ffffff',
      'layers.3.shapes.0.it.2.c.k': notificationBackground,
      // // Puce background.Ellipse 1.Fill 1
      // 'layers.4.shapes.0.it.1.c.k': '#ffffff',
      'layers.4.shapes.0.it.1.c.k': notificationBackground,
      // // Notification bg.Stroke 1
      // 'layers.5.shapes.1.c.k': '#201d1d',
      // // Notification bg.Fill 1
      // 'layers.5.shapes.2.c.k': '#ffffff',
      'layers.5.shapes.2.c.k': notificationBackground,
      // // Sound Down 3.Stroke 1
      // 'layers.6.shapes.2.c.k': '#201d1d',
      // // Sound Down 2.Stroke 1
      // 'layers.7.shapes.2.c.k': '#201d1d',
      // // Sound Down 1.Stroke 1
      // 'layers.8.shapes.2.c.k': '#201d1d',
      // // Sound Up 3.Stroke 1
      // 'layers.9.shapes.2.c.k': '#201d1d',
      // // Sound Up 2.Stroke 1
      // 'layers.10.shapes.2.c.k': '#201d1d',
      // // Sound Up 1.Stroke 1
      // 'layers.11.shapes.2.c.k': '#201d1d',
      // // Phone Mask.Rectangle 1.Stroke 1
      // 'layers.12.shapes.0.it.1.c.k': '#ffc400',
      // // Phone Mask.Rectangle 1.Fill 1
      // 'layers.12.shapes.0.it.2.c.k': '#ff0000',
      // // Phone.Buttons.Fill 1
      // 'layers.13.shapes.0.it.2.c.k': '#eaeaea',
      'layers.13.shapes.0.it.2.c.k': phoneButtons,
      // // Phone.Screen.Stroke 1
      // 'layers.13.shapes.1.it.1.c.k': '#201d1d',
      // // Phone.Screen.Fill 1
      // 'layers.13.shapes.1.it.2.c.k': '#eaeaea',
      'layers.13.shapes.1.it.2.c.k': phoneScreen,
      // // Phone.Background.Stroke 1
      // 'layers.13.shapes.2.it.1.c.k': '#201d1d',
      // // Phone.Background.Fill 1
      'layers.13.shapes.2.it.2.c.k': phoneBezel,
      // // Shadow badge.Stroke 1
      // 'layers.14.shapes.1.c.k': '#eaeaea',
      'layers.14.shapes.1.c.k': stillShadow,
      // // Line + Shadow.Stroke 1
      // 'layers.15.shapes.1.c.k.0.s': '#201d1d',
      'layers.15.shapes.1.c.k.0.s': animatedShadow,
      // // Line + Shadow.Stroke 1
      // 'layers.15.shapes.1.c.k.1.s': '#eaeaea',
      'layers.15.shapes.1.c.k.1.s': stillShadow,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(MobileAppAnimation);
