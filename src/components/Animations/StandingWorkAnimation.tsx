import LottieView, { type AnimatedLottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import StandingWork from '@/assets/animations/standing-work.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<AnimatedLottieViewProps, 'source'> & { color?: string };

const StandingWorkAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(StandingWork, {
        // Layer 4.Group 1.Group 1.Fill 1
      // "layers.0.shapes.0.it.0.it.1.c.k": "#ffffff",
      // // Layer 4.Group 1.Group 2.Fill 1
      // "layers.0.shapes.0.it.1.it.1.c.k": "#ffffff",
      // // Layer 4.Group 1.Group 3.Fill 1
      // "layers.0.shapes.0.it.2.it.1.c.k": "#ffffff",
      // // Layer 4.Group 2.Group 1.Fill 1
      // "layers.0.shapes.1.it.0.it.1.c.k": "#7c92ff",
      // // Layer 3.Group 1.Group 1.Fill 1
      // "layers.1.shapes.0.it.0.it.1.c.k": "#ffffff",
      // // Layer 3.Group 1.Group 2.Fill 1
      // "layers.1.shapes.0.it.1.it.1.c.k": "#ffffff",
      // // Layer 3.Group 1.Group 3.Fill 1
      // "layers.1.shapes.0.it.2.it.1.c.k": "#ffffff",
      // // Layer 3.Group 2.Group 1.Fill 1
      // "layers.1.shapes.1.it.0.it.1.c.k": "#7c92ff",
      // // Layer 5.Group 1.Group 1.Stroke 1
      // "layers.2.shapes.0.it.0.it.1.c.k": "#ffffff",
      // // Layer 5.Group 1.Group 2.Fill 1
      // "layers.2.shapes.0.it.1.it.1.c.k": "#7b8dff",
      // // Layer 5.Group 2.Group 1.Group 1.Fill 1
      // "layers.2.shapes.1.it.0.it.0.it.1.c.k": "#ffdf57",
      // // Layer 5.Group 2.Group 1.Group 2.Fill 1
      // "layers.2.shapes.1.it.0.it.1.it.1.c.k": "#ffdf57",
      // // Layer 2.Group 1.Group 1.Stroke 1
      // "layers.3.shapes.0.it.0.it.1.c.k": "#ffffff",
      // // Layer 2.Group 1.Group 2.Fill 1
      // "layers.3.shapes.0.it.1.it.1.c.k": "#7b8dff",
      // // Layer 2.Group 2.Group 1.Group 1.Fill 1
      // "layers.3.shapes.1.it.0.it.0.it.1.c.k": "#ffdf57",
      // // Layer 2.Group 2.Group 1.Group 2.Fill 1
      // "layers.3.shapes.1.it.0.it.1.it.1.c.k": "#ffdf57",
      // // laptop.Group 1.Group 1.Fill 1
      // "layers.4.shapes.0.it.0.it.1.c.k": "#ffffff",
      // // laptop.Group 1.Group 2.Fill 1
      // "layers.4.shapes.0.it.1.it.1.c.k": "#263237",
      // // laptop.Group 2.Fill 1
      // "layers.4.shapes.1.it.1.c.k": "#131b1e",
      // // face.Group 1.Fill 1
      // "layers.5.shapes.0.it.1.c.k": "#ffffff",
      // // face.Group 2.Fill 1
      // "layers.5.shapes.1.it.1.c.k": "#171e21",
      // // face.Group 3.Fill 1
      // "layers.5.shapes.2.it.1.c.k": "#171e21",
      // // face.Group 4.Fill 1
      // "layers.5.shapes.3.it.1.c.k": "#171e21",
      // // face.Group 5.Fill 1
      // "layers.5.shapes.4.it.1.c.k": "#171e21",
      // // face.Group 6.Stroke 1
      // "layers.5.shapes.5.it.1.c.k": "#171e21",
      // // r ear.Group 1.Stroke 1
      // "layers.6.shapes.0.it.1.c.k": "#171e21",
      // // r ear.Group 2.Fill 1
      // "layers.6.shapes.1.it.1.c.k": "#fcbc9b",
      // // head.Group 1.Fill 1
      // "layers.7.shapes.0.it.1.c.k": "#471f1f",
      // // head.Group 2.Fill 1
      // "layers.7.shapes.1.it.1.c.k": "#471f1f",
      // // head.Group 3.Fill 1
      // "layers.7.shapes.2.it.1.c.k": "#fcbc9b",
      // // head.Group 4.Fill 1
      // "layers.7.shapes.3.it.1.c.k": "#471f1f",
      // // l ear.Group 1.Fill 1
      // "layers.8.shapes.0.it.1.c.k": "#efa987",
      // // r arm.Group 1.Stroke 1
      // "layers.9.shapes.0.it.1.c.k": "#009f74",
      // // r arm.Group 2.Fill 1
      // "layers.9.shapes.1.it.1.c.k": "#69f9d2",
      // // r arm.Group 3.Fill 1
      // "layers.9.shapes.2.it.1.c.k": "#00da9f",
      // // r hand.Group 1.Fill 1
      // "layers.10.shapes.0.it.1.c.k": "#fcbc9b",
      // // r hand.Group 2.Fill 1
      // "layers.10.shapes.1.it.1.c.k": "#fcbc9b",
      // // body.Group 1.Group 1.Fill 1
      // "layers.11.shapes.0.it.0.it.1.c.k": "#00da9f",
      // // body.Group 1.Group 2.Group 1.Stroke 1
      // "layers.11.shapes.0.it.1.it.0.it.1.c.k": "#5574eb",
      // // body.Group 1.Group 2.Group 2.Fill 1
      // "layers.11.shapes.0.it.1.it.1.it.1.c.k": "#00da9f",
      // // body.Group 1.Group 3.Group 1.Fill 1
      // "layers.11.shapes.0.it.2.it.0.it.1.c.k": "#fcbc9b",
      // // body.Group 1.Group 3.Group 2.Fill 1
      // "layers.11.shapes.0.it.2.it.1.it.1.c.k": "#ffffff",
      // // body.Group 2.Fill 1
      // "layers.11.shapes.1.it.1.c.k": "#efa987",
      // // body.Group 3.Fill 1
      // "layers.11.shapes.2.it.1.c.k": "#fcbc9b",
      // // l hand.Group 1.Fill 1
      // "layers.12.shapes.0.it.1.c.k": "#fcbc9b",
      // // l hand.Group 2.Fill 1
      // "layers.12.shapes.1.it.1.c.k": "#fcbc9b",
      // // l arm.Group 2.Fill 1
      // "layers.13.shapes.0.it.1.c.k": "#00da9f",
      // // l arm.Group 1.Fill 1
      // "layers.13.shapes.1.it.1.c.k": "#fcbc9b",
      // // skirt.Group 1.Fill 1
      // "layers.14.shapes.0.it.1.c.k": "#ff98e1",
      // // r leg.Group 1.Group 1.Fill 1
      // "layers.15.shapes.0.it.0.it.1.c.k": "#fcbc9b",
      // // r leg.Group 1.Group 2.Fill 1
      // "layers.15.shapes.0.it.1.it.1.c.k": "#1a1a26",
      // // r leg.Group 2.Fill 1
      // "layers.15.shapes.1.it.1.c.k": "#fcbc9b",
      // // l leg.Group 1.Group 1.Fill 1
      // "layers.16.shapes.0.it.0.it.1.c.k": "#fcbc9b",
      // // l leg.Group 1.Group 2.Fill 1
      // "layers.16.shapes.0.it.1.it.1.c.k": "#1a1a26",
      // // l leg.Group 2.Fill 1
      // "layers.16.shapes.1.it.1.c.k": "#fcbc9b",
      // // hair.Group 1.Fill 1
      // "layers.17.shapes.0.it.1.c.k": "#471f1f",
      // // Layer 1.Group 1.Stroke 1
      // "layers.18.shapes.0.it.1.c.k": "#bfafa7",
      }),
    [],
  );

  return <LottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(StandingWorkAnimation);
