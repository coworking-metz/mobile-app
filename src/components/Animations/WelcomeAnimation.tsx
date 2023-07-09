import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import tw from 'twrnc';
import WelcomingSquare from '@/assets/animations/welcoming-square.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const WelcomeAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(WelcomingSquare, {
        // Background
        'assets.0.layers.14.shapes.0.it.1.c.k': theme.meatBrown,
        // Lolo_Eyes Round.Eye3.Stroke 1
        'assets.0.layers.0.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Lolo_Eyes Round.Eye3.Fill 1
        'assets.0.layers.0.shapes.0.it.2.c.k': theme.charlestonGreen,
        // Lolo_Eyes Round.Eye1.Stroke 1
        'assets.0.layers.0.shapes.1.it.1.c.k': theme.charlestonGreen,
        // Lolo_Eyes Round.Eye1.Fill 1
        'assets.0.layers.0.shapes.1.it.2.c.k': theme.charlestonGreen,
        // Mouth.Shape 1.Stroke 1
        'assets.0.layers.1.shapes.0.it.1.c.k': theme.charlestonGreen,
        // hand_left 2.Shape 1.Stroke 1
        'assets.0.layers.3.shapes.0.it.1.c.k': theme.charlestonGreen,
        // hand_left 4.Shape 1.Stroke 1
        'assets.0.layers.4.shapes.0.it.1.c.k': theme.charlestonGreen,
        // hand_left.Shape 1.Stroke 1
        'assets.0.layers.5.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Round Body 2.Body903.Stroke 1
        'assets.0.layers.7.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Round Body 2.Body903.Fill 1
        'assets.0.layers.7.shapes.0.it.2.c.k': theme.peachYellow,
        // Round Body 3.Body903.Stroke 1
        'assets.0.layers.10.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Round Body 3.Body903.Fill 1
        'assets.0.layers.10.shapes.0.it.2.c.k': theme.peachYellow,
        // Round Body.Body903.Stroke 1
        'assets.0.layers.11.shapes.0.it.1.c.k': theme.charlestonGreen,
        // Round Body.Body903.Fill 1
        'assets.0.layers.11.shapes.0.it.2.c.k': theme.peachYellow,
        // hand_right.Shape 1.Stroke 1
        'assets.0.layers.13.shapes.0.it.1.c.k': theme.charlestonGreen,
      }),
    [],
  );

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(WelcomeAnimation);
