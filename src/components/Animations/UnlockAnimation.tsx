import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import tw from 'twrnc';
import UnlockSuccess from '@/assets/animations/unlock-success.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const UnlockAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorApplied = color || (tw.color('green-600') as string);
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(UnlockSuccess, {
        //   // keyhole Outlines.Group 1.Fill 1
        // "layers.0.shapes.0.it.1.c.k.0.s": "#455a64",
        // // keyhole Outlines.Group 1.Fill 1
        // "layers.0.shapes.0.it.1.c.k.0.e": "#ffffff",
        // // keyhole Outlines.Group 2.Fill 1
        // "layers.0.shapes.1.it.1.c.k": "#455a64",
        // // Tick Outlines.Group 1.Stroke 1
        // "layers.1.shapes.0.it.2.c.k": "#ffffff",
        // // Shape Layer 2.Fill 1
        // "layers.2.shapes.1.c.k": "#ffd65c",
        // // Shape Layer 3.Stroke 1
        // "layers.3.shapes.1.c.k": "#19c670",
        // // Shape Layer 1.Fill 1
        // "layers.4.shapes.1.c.k.0.s": "#ffc107",
        // // Shape Layer 1.Fill 1
        // "layers.4.shapes.1.c.k.0.e": "#19c670",
        // // Lock Handle Outlines.Group 1.Stroke 1
        // "layers.5.shapes.0.it.1.c.k": "#455a64",
      }),
    [],
  );

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(UnlockAnimation);
