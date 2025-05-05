import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import BouncingBallOnDesk from '@/assets/animations/bouncing-ball-on-desk.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const BouncingBallOnDeskAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const calendarBackgroundColor = (isDark ? tw.color('zinc-900') : tw.color('white')) as string;
    return colouriseLottie(BouncingBallOnDesk, {
      // Joint Ceiling - Lamp.Joint.Stroke
      "assets.0.layers.0.shapes.0.it.1.c.k": "#18002a",
      // Lamp.Shape 1.Fill 1
      "assets.0.layers.1.shapes.0.it.1.c.k": "#18002a",
      // Lamp.Shape 1.Stroke 1
      "assets.0.layers.1.shapes.0.it.2.c.k": "#293740",
      // Lamp.Shape 2.Fill 1
      "assets.0.layers.1.shapes.1.it.1.c.k": "#18002a",
      // Lamp.Shape 2.Stroke 1
      "assets.0.layers.1.shapes.1.it.2.c.k": "#293740",
      // Lamp.Shape 3.Stroke 1
      "assets.0.layers.1.shapes.2.it.2.c.k": "#293740",
      // Ball.Ellipse 1.Fill 1
      "assets.0.layers.3.shapes.0.it.1.c.k": "#18002a",
      // Ball.Ellipse 1.Stroke 1
      "assets.0.layers.3.shapes.0.it.2.c.k": "#293740",
      // Table.Rectangle 3.Fill 1
      "assets.0.layers.4.shapes.0.it.1.c.k": "#1e0c0c",
      // Table.Rectangle 3.Stroke 1
      "assets.0.layers.4.shapes.0.it.2.c.k": "#293740",
      // Table.Rectangle 4.Fill 1
      "assets.0.layers.4.shapes.1.it.1.c.k": "#1e0c0c",
      // Table.Rectangle 4.Stroke 1
      "assets.0.layers.4.shapes.1.it.2.c.k": "#293740",
      // Table.Rectangle 2.Fill 1
      "assets.0.layers.4.shapes.2.it.1.c.k": "#1e0c0c",
      // Table.Rectangle 2.Stroke 1
      "assets.0.layers.4.shapes.2.it.2.c.k": "#293740",
      // Table.Rectangle 1.Fill 1
      "assets.0.layers.4.shapes.3.it.1.c.k": "#331616",
      // Table.Rectangle 1.Stroke 1
      "assets.0.layers.4.shapes.3.it.2.c.k": "#293740",
      // Table.Ellipse 1.Fill 1
      "assets.0.layers.4.shapes.4.it.1.c.k": "#000000",
      // Table.Ellipse 1.Stroke 1
      "assets.0.layers.4.shapes.4.it.2.c.k": "#293740",
      // Ceiling.Rectangle 1.Fill 1
      "assets.0.layers.5.shapes.0.it.1.c.k": "#18002a",
      // Ceiling.Rectangle 1.Stroke 1
      "assets.0.layers.5.shapes.0.it.2.c.k": "#18002a",
      // BG.Ellipse 1.Stroke 1
      "assets.0.layers.7.shapes.0.it.2.c.k": "#29002e",
      // Glass.Glass.Fill 1
      "assets.1.layers.0.shapes.0.it.1.c.k": "#1b0000",
      // Glass.Glass.Stroke 1
      "assets.1.layers.0.shapes.0.it.2.c.k": "#1b0000",
      // Pen 3.Pen 3.Stroke 1
      "assets.1.layers.1.shapes.0.it.1.c.k": "#1b0000",
      // Pen 2.Pen 2.Stroke 1
      "assets.1.layers.2.shapes.0.it.1.c.k": "#1b0000",
      // Pen.Pen.Stroke 1
      "assets.1.layers.3.shapes.0.it.1.c.k": "#1b0000",
      // Rectangle 6.Rectangle 3.Stroke 1
      "assets.1.layers.4.shapes.0.it.1.c.k": "#ffffff",
      // Rectangle 6.Rectangle 3.Fill 1
      "assets.1.layers.4.shapes.0.it.2.c.k": "#f0c0b0",
      // Rectangle 3.Rectangle 3.Stroke 1
      "assets.1.layers.5.shapes.0.it.1.c.k": "#ffffff",
      // Rectangle 3.Rectangle 3.Fill 1
      "assets.1.layers.5.shapes.0.it.2.c.k": "#f0c0b0",
      // Rectangle 5.Rectangle 2.Stroke 1
      "assets.1.layers.6.shapes.0.it.1.c.k": "#ffffff",
      // Rectangle 5.Rectangle 2.Fill 1
      "assets.1.layers.6.shapes.0.it.2.c.k": "#f0c0b0",
      // Rectangle 2.Rectangle 2.Stroke 1
      "assets.1.layers.7.shapes.0.it.1.c.k": "#ffffff",
      // Rectangle 2.Rectangle 2.Fill 1
      "assets.1.layers.7.shapes.0.it.2.c.k": "#f0c0b0",
      // Rectangle 4.Rectangle 1.Stroke 1
      "assets.1.layers.8.shapes.0.it.1.c.k": "#ffffff",
      // Rectangle 4.Rectangle 1.Fill 1
      "assets.1.layers.8.shapes.0.it.2.c.k": "#f0c0b0",
      // Rectangle 1.Rectangle 1.Stroke 1
      "assets.1.layers.9.shapes.0.it.1.c.k": "#ffffff",
      // Rectangle 1.Rectangle 1.Fill 1
      "assets.1.layers.9.shapes.0.it.2.c.k": "#f0c0b0",
      // 2 Outlines.2.Stroke 1
      "assets.2.layers.0.shapes.0.it.1.c.k": "#000000",
      // 2 Outlines.2.Fill 1
      "assets.2.layers.0.shapes.0.it.2.c.k": "#4c0011",
      // 5 Outlines.5.Stroke 1
      "assets.2.layers.1.shapes.0.it.1.c.k": "#000000",
      // 5 Outlines.5.Fill 1
      "assets.2.layers.1.shapes.0.it.2.c.k": "#ffb3b5",
      // Shape Layer 2.Rectangle 2.Stroke 1
      "assets.2.layers.2.shapes.0.it.2.c.k": "#29002e",
      // Shape Layer 2.Rectangle 1.Stroke 1
      "assets.2.layers.2.shapes.1.it.1.c.k": "#ffffff",
      // Shape Layer 2.Rectangle 1.Fill 1
      "assets.2.layers.2.shapes.1.it.2.c.k": "#ffdac8",
      // Shape Layer 1.Rectangle 3.Stroke 1
      "assets.2.layers.3.shapes.0.it.1.c.k": "#29002e",
      // Shape Layer 1.Rectangle 3.Fill 1
      "assets.2.layers.3.shapes.0.it.2.c.k": "#d28b7e",
      // Shape Layer 1.Rectangle 1.Stroke 1
      "assets.2.layers.3.shapes.1.it.1.c.k": "#29002e",
      // Shape Layer 1.Rectangle 1.Fill 1
      "assets.2.layers.3.shapes.1.it.2.c.k": "#26001e",
      // Shape Layer 1.Rectangle 2.Stroke 1
      "assets.2.layers.3.shapes.2.it.1.c.k": "#29002e",
      // Shape Layer 1.Rectangle 2.Fill 1
      "assets.2.layers.3.shapes.2.it.2.c.k": "#000000",
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(BouncingBallOnDeskAnimation);
