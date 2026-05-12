import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import EmailReceived from '@/assets/animations/email-received.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const EmailReceivedAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const strokeColor = (
      colorScheme === 'dark' ? tw.color('neutral-200') : tw.color('slate-800')
    ) as string;
    return colouriseLottie(EmailReceived, {
      // ball Outlines 2.Group 1.Fill 1
      'assets.0.layers.0.shapes.0.it.1.c.k': '#0f73fb',
      // mail Outlines.Group 1.Group 1.Stroke 1
      'assets.1.layers.0.shapes.0.it.0.it.1.c.k': strokeColor,
      // mail Outlines.Group 1.Group 2.Stroke 1
      'assets.1.layers.0.shapes.0.it.1.it.1.c.k': strokeColor,
      // Shape Layer 1.Shape 1.Stroke 1
      'layers.0.shapes.0.it.2.c.k': strokeColor,
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(EmailReceivedAnimation);
