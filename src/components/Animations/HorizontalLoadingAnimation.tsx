import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import WiredOutlineHorizontalLoader from '@/assets/animations/lordicon/wired-outline-horizontal-loader.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const HorizontalLoadingAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const colorApplied =
      color || (isDark ? (tw.color('zinc-300') as string) : (tw.color('gray-700') as string));
    return colouriseLottie(WiredOutlineHorizontalLoader, {
      // Shape Layer 4.Ellipse 1.Stroke 1
      'layers.0.shapes.0.it.2.c.k': colorApplied,
      // Shape Layer 2.Ellipse 1.Stroke 1
      'layers.1.shapes.0.it.2.c.k': colorApplied,
      // Shape Layer 3.Ellipse 1.Stroke 1
      'layers.2.shapes.0.it.2.c.k': colorApplied,
      // Shape Layer 1.Ellipse 1.Stroke 1
      'layers.3.shapes.0.it.2.c.k': colorApplied,
    });
  }, [color, colorScheme]);

  return <AppLottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(HorizontalLoadingAnimation);
