import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import UnlockSuccess from '@/assets/animations/unlock-success.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const UnlockAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const colorApplied =
      color ||
      ((colorScheme === 'dark' ? tw.color('emerald-700') : tw.color('emerald-600')) as string);
    return colouriseLottie(UnlockSuccess, {
      // // keyhole Outlines.Group 1.Fill 1
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
      'layers.3.shapes.1.c.k': colorApplied,
      // // Shape Layer 1.Fill 1
      // "layers.4.shapes.1.c.k.0.s": "#ffc107",
      // // Shape Layer 1.Fill 1
      // "layers.4.shapes.1.c.k.0.e": "#19c670",
      'layers.4.shapes.1.c.k.0.e': colorApplied,
      // // Lock Handle Outlines.Group 1.Stroke 1
      // "layers.5.shapes.0.it.1.c.k": "#455a64",
    });
  }, [color, colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(UnlockAnimation);
