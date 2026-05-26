import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import MobileNotifications from '@/assets/animations/mobile-notifications.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const MobileNotificationsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const phoneBezel = (isDark ? tw.color('zinc-950') : tw.color('white')) as string;
    const phoneButtons = (isDark ? tw.color('zinc-700') : tw.color('gray-300')) as string;
    const phoneScreen = (isDark ? tw.color('neutral-700') : '#eaeaea') as string;
    const animatedShadow = (isDark ? tw.color('gray-400') : '#201d1d') as string;
    const stillShadow = (isDark ? tw.color('zinc-800') : '#eaeaea') as string;
    const notificationBackground = (isDark ? tw.color('neutral-700') : '#ffffff') as string;
    const badgeInnerCircle = (isDark ? tw.color('black') : '#ffffff') as string;
    return colouriseLottie(MobileNotifications, {});
  }, [colorScheme]);

  return <AppLottieView ref={ref} autoPlay {...props} source={colorizedSource} />;
};

export default forwardRef(MobileNotificationsAnimation);
