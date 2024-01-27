import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import LiftBarrier from '@/assets/animations/lift-barrier.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'>;

const BarrierAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const lighterColor = (isDark ? tw.color('gray-200') : tw.color('gray-300')) as string;
    const plotOutlineColor = (isDark ? tw.color('gray-400') : tw.color('gray-700')) as string;
    const darkerColor = (isDark ? tw.color('gray-300') : tw.color('gray-600')) as string;
    return colouriseLottie(LiftBarrier, {
      // 404-barrier Outlines.right-barrier.Group 1.Fill 1
      // 'layers.0.shapes.0.it.0.it.1.c.k': '#f05151',
      // 404-barrier Outlines.right-barrier.Group 2.Fill 1
      // 'layers.0.shapes.0.it.1.it.1.c.k': '#f05151',
      // 404-barrier Outlines.right-barrier.Group 3.Fill 1
      // 'layers.0.shapes.0.it.2.it.1.c.k': '#f05151',
      // 404-barrier Outlines.right-barrier.Group 4.Fill 1
      'layers.0.shapes.0.it.3.it.1.c.k': darkerColor,
      // 404-barrier Outlines.right-barrier.Group 13.Fill 1
      'layers.0.shapes.0.it.4.it.1.c.k': plotOutlineColor,
      // 404-barrier Outlines.barrier-hand.Group 5.Fill 1
      'layers.0.shapes.1.it.0.it.1.c.k': lighterColor,
      // 404-barrier Outlines.barrier-hand.Group 6.Fill 1
      'layers.0.shapes.1.it.1.it.1.c.k': darkerColor,
      // 404-barrier Outlines.barrier-hand.Group 7.Fill 1
      'layers.0.shapes.1.it.2.it.1.c.k': lighterColor,
      // 404-barrier Outlines.barrier-hand.Group 8.Fill 1
      'layers.0.shapes.1.it.3.it.1.c.k': darkerColor,
      // 404-barrier Outlines.barrier-hand.Group 9.Fill 1
      'layers.0.shapes.1.it.4.it.1.c.k': lighterColor,
      // 404-barrier Outlines.barrier-hand.Group 10.Fill 1
      'layers.0.shapes.1.it.5.it.1.c.k': darkerColor,
      // 404-barrier Outlines.barrier-hand.Group 11.Fill 1
      // 'layers.0.shapes.1.it.6.it.1.c.k': '#596775',
      // 404-barrier Outlines.barrier-hand.Group 12.Fill 1
      // 'layers.0.shapes.1.it.7.it.1.c.k': '#35404a',
      // 404-barrier Outlines.left-barrier.Group 14.Fill 1
      'layers.0.shapes.2.it.0.it.1.c.k': darkerColor,
      // 404-barrier Outlines.left-barrier.Group 15.Fill 1
      'layers.0.shapes.2.it.1.it.1.c.k': plotOutlineColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(BarrierAnimation);
