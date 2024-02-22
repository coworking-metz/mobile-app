import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import ChatBubbles from '@/assets/animations/chat-bubbles.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'>;

const ChatBubblesAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    return colouriseLottie(ChatBubbles, {});
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(ChatBubblesAnimation);
