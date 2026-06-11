import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
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
    // const isDark = colorScheme === 'dark';
    return colouriseLottie(MobileNotifications, {});
  }, [colorScheme]);

  return <AppLottieView ref={ref} autoPlay {...props} source={colorizedSource} />;
};

export default forwardRef(MobileNotificationsAnimation);
