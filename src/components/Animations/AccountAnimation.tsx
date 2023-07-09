import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import SystemOutlineAccountIntro from '@/assets/animations/lordicon/system-outline-account-intro.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const AccountAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorApplied = color || theme.charlestonGreen;
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(SystemOutlineAccountIntro, {
        // in-account..primary.design.Group 1.Group 1.Fill 1
        'assets.0.layers.0.shapes.0.it.0.it.2.c.k': colorApplied,
        // in-account..primary.design.Group 1.Group 2.Fill 1
        'assets.0.layers.0.shapes.0.it.1.it.3.c.k': colorApplied,
        // in-account..primary.design.Group 1.Stroke 1
        'assets.0.layers.1.shapes.0.it.1.c.k': colorApplied,
        // in-account..primary.design.Group 1.Fill 1
        'assets.0.layers.2.shapes.0.it.1.c.k': colorApplied,
        // in-account..primary.design.Group 1.Stroke 1
        'assets.0.layers.3.shapes.0.it.1.c.k': colorApplied,
        // in-account..primary.design.Group 1.Fill 1
        'assets.0.layers.4.shapes.0.it.1.c.k': colorApplied,
        // in-account..primary.design.Group 1.Stroke 1
        'assets.0.layers.5.shapes.0.it.1.c.k': colorApplied,
        // in-account..primary.design.Group 2.Stroke 1
        'assets.0.layers.5.shapes.1.it.1.c.k': colorApplied,
      }),
    [],
  );

  return <LottieView ref={ref} loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(AccountAnimation);
