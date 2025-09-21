import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import ChatBubbles from '@/assets/animations/chat-bubbles.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const ChatBubblesAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorizedSource = useMemo(() => {
    return colouriseLottie(ChatBubbles, {
      // // Bubble R.Lines.Group 1.Stroke 1
      // 'assets.0.layers.0.shapes.0.it.2.c.k': '#fe818a',
      // // Bubble R.Lines.Group 2.Stroke 1
      // 'assets.0.layers.0.shapes.1.it.2.c.k': '#fe6a88',
      // // Bubble R.Lines.Group 3.Stroke 1
      // 'assets.0.layers.0.shapes.2.it.2.c.k': '#fe5586',
      // // Bubble R.Bubble R.Group 1.Fill 1
      // 'assets.0.layers.4.shapes.0.it.1.c.k': '#ffdce2',
      // // Bubble L.Lines.Group 1.Stroke 1
      // 'assets.1.layers.0.shapes.0.it.2.c.k': '#ffe4e8',
      // // Bubble L.Lines.Group 2.Stroke 1
      // 'assets.1.layers.0.shapes.1.it.2.c.k': '#ffdce2',
      // // Bubble L.Lines.Group 3.Stroke 1
      // 'assets.1.layers.0.shapes.2.it.2.c.k': '#ffcfd7',
      // // Bubble L.Dot 3.Dot.Fill 1
      // 'assets.1.layers.1.shapes.0.it.1.c.k': '#ffdce2',
      // // Bubble L.Dot 2.Dot.Fill 1
      // 'assets.1.layers.2.shapes.0.it.1.c.k': '#ffdce2',
      // // Bubble L.Dot.Dot.Fill 1
      // 'assets.1.layers.3.shapes.0.it.1.c.k': '#ffdce2',
    });
  }, []);

  return <AppLottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(ChatBubblesAnimation);
