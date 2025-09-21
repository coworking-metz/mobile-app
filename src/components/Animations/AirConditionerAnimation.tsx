import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import AirConditioner from '@/assets/animations/air-conditioner.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const AirConditionerAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const backgroundColor = (isDark ? tw.color('zinc-900') : tw.color('white')) as string;
    return colouriseLottie(AirConditioner, {
      // Rectangle.Rectangle.Fill 1
      'assets.0.layers.0.shapes.0.it.1.c.k': '#395a6d',
      // Path.Path.Fill 1
      'assets.0.layers.1.shapes.0.it.1.c.k': '#2d4a60',
      // Rectangle.Rectangle.Fill 1
      'assets.0.layers.2.shapes.0.it.1.c.k': '#395a6d',
      // Path.Path.Fill 1
      'assets.0.layers.3.shapes.0.it.1.c.k': '#2d4a60',
      // Path.Path.Fill 1
      'assets.0.layers.4.shapes.0.it.1.c.k': '#a9c0d8',
      // Path.Path.Fill 1
      'assets.0.layers.5.shapes.0.it.1.c.k': '#395a6d',
      // Path.Path.Fill 1
      'assets.0.layers.6.shapes.0.it.1.c.k': '#2d4a60',
      // Path.Path.Fill 1
      'assets.0.layers.7.shapes.0.it.1.c.k': '#ff3f62',
      // Path.Path.Fill 1
      'assets.0.layers.8.shapes.0.it.1.c.k': '#91dc5a',
      // Path.Path.Fill 1
      'assets.0.layers.9.shapes.0.it.1.c.k': '#ff0c38',
      // Path.Path.Fill 1
      'assets.0.layers.10.shapes.0.it.1.c.k': '#6dc82a',
      // Path.Path.Fill 1
      'assets.0.layers.11.shapes.0.it.1.c.k': '#cbd6e1',
      // Path.Path.Fill 1
      'assets.0.layers.12.shapes.0.it.1.c.k': '#f2f2f2',
      // Path.Path.Fill 1
      'assets.0.layers.13.shapes.0.it.1.c.k': '#e6e6e6',
      // Air Right.Shape 1.Stroke 1
      'layers.0.shapes.0.it.1.c.k': '#b7e0ff',
      // Air Middle.Shape 1.Stroke 1
      'layers.1.shapes.0.it.1.c.k': '#b7e0ff',
      // Air Left.Shape 1.Stroke 1
      'layers.2.shapes.0.it.1.c.k': '#b7e0ff',
      // Snowflake Right.Snowflake Right.Fill 1
      'layers.3.shapes.0.it.1.c.k': '#b7e0ff',
      // Snowflake Left.Snowflake Left.Fill 1
      'layers.4.shapes.0.it.1.c.k': '#b7e0ff',
      // Shape Layer 1.Rectangle 1.Stroke 1
      'layers.6.shapes.0.it.1.c.k': backgroundColor,
      // Shape Layer 1.Rectangle 1.Fill 1
      'layers.6.shapes.0.it.2.c.k': backgroundColor,
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(AirConditionerAnimation);
