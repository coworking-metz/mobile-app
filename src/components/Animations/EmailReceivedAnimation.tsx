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
    const dateColor = tw.color('amber-800') as string;
    const handleColor = tw.color('neutral-900') as string;
    const calendarColor = tw.color('zinc-700') as string;
    return colouriseLottie(EmailReceived, {

    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(EmailReceivedAnimation);
