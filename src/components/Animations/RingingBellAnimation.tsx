import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import RingingBell from '@/assets/animations/ringing-bell.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const RingingBellAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const fillColor = (isDark ? tw.color('zinc-900') : tw.color('white')) as string;
    const borderColor = (isDark ? tw.color('neutral-500') : '#352006') as string;
    return colouriseLottie(RingingBell, {
      // Notification.Notification.Fill 1
      'layers.0.shapes.0.it.1.c.k': '#ffa733',
      // Notification.bell 1 bottom.Stroke 1
      'layers.0.shapes.1.it.1.c.k': borderColor,
      // Notification.bell 1 bottom.Fill 1
      'layers.0.shapes.1.it.2.c.k': fillColor,
      // Notification.circle.Stroke 1
      'layers.0.shapes.2.it.1.c.k': borderColor,
      // Notification.circle.Fill 1
      'layers.0.shapes.2.it.2.c.k': fillColor,
      // Notification.bell 1.Stroke 1
      'layers.0.shapes.3.it.1.c.k': borderColor,
      // Notification.bell 1.Fill 1
      'layers.0.shapes.3.it.2.c.k': fillColor,
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(RingingBellAnimation);
