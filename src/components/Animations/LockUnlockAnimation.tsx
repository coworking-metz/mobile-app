import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import LockUnlock from '@/assets/animations/lock-unlock.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const LockUnlockAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const iconColor = colorScheme === 'dark' ? tw.color('gray-400') : tw.color('gray-700');
    const colorApplied = color || (iconColor as string);
    return colouriseLottie(LockUnlock, {
      // accent.Shape 3.Stroke 1
      'layers.0.shapes.0.it.1.c.k': colorApplied,
      // accent.Shape 2.Stroke 1
      'layers.0.shapes.1.it.1.c.k': colorApplied,
      // accent.Shape 1.Stroke 1
      'layers.0.shapes.2.it.1.c.k': colorApplied,
      // accent.Shape 3.Stroke 1
      'layers.1.shapes.0.it.1.c.k': colorApplied,
      // accent.Shape 2.Stroke 1
      'layers.1.shapes.1.it.1.c.k': colorApplied,
      // accent.Shape 1.Stroke 1
      'layers.1.shapes.2.it.1.c.k': colorApplied,
      // handle.Ellipse 1.Stroke 1
      'layers.2.shapes.0.it.1.c.k': colorApplied,
      // lock.Fill 1.Fill 1
      'layers.3.shapes.0.it.3.c.k': colorApplied,
    });
  }, [colorScheme, color]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(LockUnlockAnimation);
