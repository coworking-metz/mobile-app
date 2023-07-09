import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import DesktopWork from '@/assets/animations/desktop-work.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const DesktopWorkAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(DesktopWork, {
        //   // Pre-comp 1.Shape Layer 3.Shape 1.Stroke 1
        // "assets.1.layers.0.shapes.0.it.1.c.k": "#000000",
        // // Pre-comp 1.Shape Layer 2.Shape 1.Stroke 1
        // "assets.1.layers.1.shapes.0.it.1.c.k": "#000000",
        // // Pre-comp 1.Shape Layer 1.Shape 1.Stroke 1
        // "assets.1.layers.2.shapes.0.it.1.c.k": "#000000",
        // // Pre-comp 1.pc.Group 1.Group 1.Fill 1
        // "assets.1.layers.3.shapes.0.it.0.it.1.c.k": "#eae2df",
        // // Pre-comp 1.pc.Group 1.Group 2.Fill 1
        // "assets.1.layers.3.shapes.0.it.1.it.1.c.k": "#bfafa7",
        // // Pre-comp 1.pc.Group 1.Group 3.Stroke 1
        // "assets.1.layers.3.shapes.0.it.2.it.1.c.k": "#eae2df",
        // // Pre-comp 1.pc.Group 1.Group 4.Stroke 1
        // "assets.1.layers.3.shapes.0.it.3.it.1.c.k": "#eae2df",
        // // Pre-comp 1.pc.Group 2.Group 1.Group 1.Group 1.Fill 1
        // "assets.1.layers.3.shapes.1.it.0.it.0.it.0.it.1.c.k": "#3d5057",
        // // Pre-comp 1.pc.Group 2.Group 1.Group 1.Group 2.Fill 1
        // "assets.1.layers.3.shapes.1.it.0.it.0.it.1.it.1.c.k": "#3d5057",
        // // Pre-comp 1.pc.Group 2.Group 1.Group 2.Fill 1
        // "assets.1.layers.3.shapes.1.it.0.it.1.it.1.c.k": "#090b0c",
        // // Pre-comp 1.pc.Group 2.Group 2.Group 1.Fill 1
        // "assets.1.layers.3.shapes.1.it.1.it.0.it.1.c.k": "#263237",
        // // Pre-comp 1.pc.Group 2.Group 2.Group 2.Fill 1
        // "assets.1.layers.3.shapes.1.it.1.it.1.it.1.c.k": "#3d5057",
        // // Pre-comp 1.pc.Group 2.Group 3.Group 1.Fill 1
        // "assets.1.layers.3.shapes.1.it.2.it.0.it.1.c.k": "#3d5057",
        // // Pre-comp 1.pc.Group 2.Group 3.Group 2.Fill 1
        // "assets.1.layers.3.shapes.1.it.2.it.1.it.1.c.k": "#090b0c",
        // // Pre-comp 1.head.Group 1.Fill 1
        // "assets.1.layers.5.shapes.0.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 2.Fill 1
        // "assets.1.layers.5.shapes.1.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 3.Group 1.Stroke 1
        // "assets.1.layers.5.shapes.2.it.0.it.1.c.k": "#000000",
        // // Pre-comp 1.head.Group 3.Group 2.Fill 1
        // "assets.1.layers.5.shapes.2.it.1.it.1.c.k": "#fcbc9b",
        // // Pre-comp 1.head.Group 4.Fill 1
        // "assets.1.layers.5.shapes.3.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 5.Group 1.Fill 1
        // "assets.1.layers.5.shapes.4.it.0.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 5.Group 2.Fill 1
        // "assets.1.layers.5.shapes.4.it.1.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 5.Group 3.Fill 1
        // "assets.1.layers.5.shapes.4.it.2.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 5.Group 4.Fill 1
        // "assets.1.layers.5.shapes.4.it.3.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 5.Group 5.Stroke 1
        // "assets.1.layers.5.shapes.4.it.4.it.1.c.k": "#000000",
        // // Pre-comp 1.head.Group 6.Fill 1
        // "assets.1.layers.5.shapes.5.it.1.c.k": "#fcbc9b",
        // // Pre-comp 1.head.Group 7.Fill 1
        // "assets.1.layers.5.shapes.6.it.1.c.k": "#e49d7d",
        // // Pre-comp 1.head.Group 8.Fill 1
        // "assets.1.layers.5.shapes.7.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 9.Fill 1
        // "assets.1.layers.5.shapes.8.it.1.c.k": "#171e21",
        // // Pre-comp 1.head.Group 10.Fill 1
        // "assets.1.layers.5.shapes.9.it.1.c.k": "#171e21",
        // // Pre-comp 1.r hand.Group 1.Group 1.Stroke 1
        // "assets.1.layers.6.shapes.0.it.0.it.1.c.k": "#ffffff",
        // // Pre-comp 1.r hand.Group 1.Group 2.Fill 1
        // "assets.1.layers.6.shapes.0.it.1.it.1.c.k": "#f76567",
        // // Pre-comp 1.r hand.Group 2.Group 1.Fill 1
        // "assets.1.layers.6.shapes.1.it.0.it.1.c.k": "#f1b999",
        // // Pre-comp 1.r hand.Group 2.Group 2.Fill 1
        // "assets.1.layers.6.shapes.1.it.1.it.1.c.k": "#f1b999",
        // // Pre-comp 1.r arm.Group 1.Stroke 1
        // "assets.1.layers.7.shapes.0.it.1.c.k": "#ffffff",
        // // Pre-comp 1.r arm.Group 2.Fill 1
        // "assets.1.layers.7.shapes.1.it.1.c.k": "#f76567",
        // // Pre-comp 1.body.Group 1.Fill 1
        // "assets.1.layers.8.shapes.0.it.1.c.k": "#fcbc9b",
        // // Pre-comp 1.body.Group 2.Fill 1
        // "assets.1.layers.8.shapes.1.it.1.c.k": "#fcbc9b",
        // // Pre-comp 1.body.Group 3.Group 1.Stroke 1
        // "assets.1.layers.8.shapes.2.it.0.it.1.c.k": "#ffffff",
        // // Pre-comp 1.body.Group 3.Group 2.Fill 1
        // "assets.1.layers.8.shapes.2.it.1.it.1.c.k": "#f76567",
        // // Pre-comp 1.l hand.Group 1.Fill 1
        // "assets.1.layers.9.shapes.0.it.1.c.k": "#f76567",
        // // Pre-comp 1.l hand.Group 2.Group 1.Fill 1
        // "assets.1.layers.9.shapes.1.it.0.it.1.c.k": "#f1b999",
        // // Pre-comp 1.l hand.Group 2.Group 2.Fill 1
        // "assets.1.layers.9.shapes.1.it.1.it.1.c.k": "#f1b999",
        // // Pre-comp 1.l arm.Group 1.Fill 1
        // "assets.1.layers.10.shapes.0.it.1.c.k": "#f76567",
        // // Pre-comp 1.r leg.Group 1.Group 1.Fill 1
        // "assets.1.layers.11.shapes.0.it.0.it.1.c.k": "#5fffd4",
        // // Pre-comp 1.r leg.Group 1.Group 2.Fill 1
        // "assets.1.layers.11.shapes.0.it.1.it.1.c.k": "#00da9f",
        // // Pre-comp 1.r leg.Group 2.Group 1.Group 1.Fill 1
        // "assets.1.layers.11.shapes.1.it.0.it.0.it.1.c.k": "#ffffff",
        // // Pre-comp 1.r leg.Group 2.Group 1.Group 2.Fill 1
        // "assets.1.layers.11.shapes.1.it.0.it.1.it.1.c.k": "#ffffff",
        // // Pre-comp 1.r leg.Group 2.Group 1.Group 3.Fill 1
        // "assets.1.layers.11.shapes.1.it.0.it.2.it.1.c.k": "#ffffff",
        // // Pre-comp 1.r leg.Group 2.Group 1.Group 4.Fill 1
        // "assets.1.layers.11.shapes.1.it.0.it.3.it.1.c.k": "#ffffff",
        // // Pre-comp 1.r leg.Group 2.Group 1.Group 5.Fill 1
        // "assets.1.layers.11.shapes.1.it.0.it.4.it.1.c.k": "#000000",
        // // Pre-comp 1.r leg.Group 2.Group 2.Fill 1
        // "assets.1.layers.11.shapes.1.it.1.it.1.c.k": "#fcbc9b",
        // // Pre-comp 1.r thigh.Group 1.Group 2.Fill 1
        // "assets.1.layers.12.shapes.0.it.0.it.1.c.k": "#00da9f",
        // // Pre-comp 1.l leg.Group 1.Group 1.Fill 1
        // "assets.1.layers.13.shapes.0.it.0.it.1.c.k": "#5fffd4",
        // // Pre-comp 1.l leg.Group 1.Group 2.Fill 1
        // "assets.1.layers.13.shapes.0.it.1.it.1.c.k": "#00b987",
        // // Pre-comp 1.l leg.Group 2.Group 1.Group 1.Fill 1
        // "assets.1.layers.13.shapes.1.it.0.it.0.it.1.c.k": "#ffffff",
        // // Pre-comp 1.l leg.Group 2.Group 1.Group 2.Fill 1
        // "assets.1.layers.13.shapes.1.it.0.it.1.it.1.c.k": "#ffffff",
        // // Pre-comp 1.l leg.Group 2.Group 1.Group 3.Fill 1
        // "assets.1.layers.13.shapes.1.it.0.it.2.it.1.c.k": "#ffffff",
        // // Pre-comp 1.l leg.Group 2.Group 1.Group 4.Fill 1
        // "assets.1.layers.13.shapes.1.it.0.it.3.it.1.c.k": "#ffffff",
        // // Pre-comp 1.l leg.Group 2.Group 1.Group 5.Fill 1
        // "assets.1.layers.13.shapes.1.it.0.it.4.it.1.c.k": "#000000",
        // // Pre-comp 1.l leg.Group 2.Group 2.Fill 1
        // "assets.1.layers.13.shapes.1.it.1.it.1.c.k": "#fcbc9b",
        // // Pre-comp 1.chair.Group 1.Fill 1
        // "assets.1.layers.14.shapes.0.it.1.c.k": "#131b1e",
        // // Pre-comp 1.chair.Group 2.Group 1.Fill 1
        // "assets.1.layers.14.shapes.1.it.0.it.1.c.k": "#131b1e",
        // // Pre-comp 1.chair.Group 2.Group 2.Fill 1
        // "assets.1.layers.14.shapes.1.it.1.it.1.c.k": "#131b1e",
        // // Pre-comp 1.chair.Group 2.Group 3.Fill 1
        // "assets.1.layers.14.shapes.1.it.2.it.1.c.k": "#131b1e",
        // // Pre-comp 1.chair.Group 2.Group 4.Fill 1
        // "assets.1.layers.14.shapes.1.it.3.it.1.c.k": "#131b1e",
        // // Pre-comp 1.chair.Group 3.Fill 1
        // "assets.1.layers.14.shapes.2.it.1.c.k": "#131b1e",
        // // Pre-comp 1.chair.Group 4.Fill 1
        // "assets.1.layers.14.shapes.3.it.1.c.k": "#fcbc9b",
        // // Pre-comp 1.chair.Group 5.Fill 1
        // "assets.1.layers.14.shapes.4.it.1.c.k": "#131b1e",
        // // Pre-comp 1.Layer 4.Group 1.Stroke 1
        // "assets.1.layers.15.shapes.0.it.1.c.k": "#bfafa7",
        // // Pre-comp 1.Layer 3.Group 1.Stroke 1
        // "assets.1.layers.16.shapes.0.it.1.c.k": "#bfafa7",
        // // Pre-comp 1.Layer 2.Group 1.Stroke 1
        // "assets.1.layers.17.shapes.0.it.1.c.k": "#bfafa7",
        // // Pre-comp 1.Layer 1.Group 1.Stroke 1
        // "assets.1.layers.18.shapes.0.it.1.c.k": "#bfafa7",
      }),
    [],
  );

  return <LottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(DesktopWorkAnimation);
