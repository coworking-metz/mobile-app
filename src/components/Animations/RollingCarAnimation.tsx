import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import RollingCar from '@/assets/animations/rolling-car.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const RollingCarAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const backgroundColor = (isDark ? tw.color('zinc-900') : tw.color('white')) as string;
    return colouriseLottie(RollingCar, {
      // Shape Layer 96.Ellipse 1.Fill 1
      "assets.0.layers.0.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 95.Ellipse 1.Fill 1
      "assets.0.layers.1.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 94.Ellipse 1.Fill 1
      "assets.0.layers.2.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 93.Ellipse 1.Fill 1
      "assets.0.layers.3.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 91.Ellipse 1.Fill 1
      "assets.0.layers.4.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 90.Ellipse 1.Fill 1
      "assets.0.layers.5.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 89.Ellipse 1.Fill 1
      "assets.0.layers.6.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 88.Ellipse 1.Fill 1
      "assets.0.layers.7.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 87.Ellipse 1.Fill 1
      "assets.0.layers.8.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 86.Ellipse 1.Fill 1
      "assets.0.layers.9.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 85.Ellipse 1.Fill 1
      "assets.0.layers.10.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 83.Ellipse 1.Fill 1
      "assets.0.layers.11.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 82.Ellipse 1.Fill 1
      "assets.0.layers.12.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 81.Ellipse 1.Fill 1
      "assets.0.layers.13.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 80.Ellipse 1.Fill 1
      "assets.0.layers.14.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 79.Ellipse 1.Fill 1
      "assets.0.layers.15.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 78.Ellipse 1.Fill 1
      "assets.0.layers.16.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 77.Ellipse 1.Fill 1
      "assets.0.layers.17.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 75.Ellipse 1.Fill 1
      "assets.0.layers.18.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 74.Ellipse 1.Fill 1
      "assets.0.layers.19.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 73.Ellipse 1.Fill 1
      "assets.0.layers.20.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 72.Ellipse 1.Fill 1
      "assets.0.layers.21.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 71.Ellipse 1.Fill 1
      "assets.0.layers.22.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 70.Ellipse 1.Fill 1
      "assets.0.layers.23.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 69.Ellipse 1.Fill 1
      "assets.0.layers.24.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 68.Ellipse 1.Fill 1
      "assets.0.layers.25.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 96.Ellipse 1.Fill 1
      "assets.1.layers.0.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 95.Ellipse 1.Fill 1
      "assets.1.layers.1.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 94.Ellipse 1.Fill 1
      "assets.1.layers.2.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 93.Ellipse 1.Fill 1
      "assets.1.layers.3.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 91.Ellipse 1.Fill 1
      "assets.1.layers.4.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 90.Ellipse 1.Fill 1
      "assets.1.layers.5.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 89.Ellipse 1.Fill 1
      "assets.1.layers.6.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 88.Ellipse 1.Fill 1
      "assets.1.layers.7.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 87.Ellipse 1.Fill 1
      "assets.1.layers.8.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 86.Ellipse 1.Fill 1
      "assets.1.layers.9.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 85.Ellipse 1.Fill 1
      "assets.1.layers.10.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 83.Ellipse 1.Fill 1
      "assets.1.layers.11.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 82.Ellipse 1.Fill 1
      "assets.1.layers.12.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 81.Ellipse 1.Fill 1
      "assets.1.layers.13.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 80.Ellipse 1.Fill 1
      "assets.1.layers.14.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 79.Ellipse 1.Fill 1
      "assets.1.layers.15.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 78.Ellipse 1.Fill 1
      "assets.1.layers.16.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 77.Ellipse 1.Fill 1
      "assets.1.layers.17.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 75.Ellipse 1.Fill 1
      "assets.1.layers.18.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 74.Ellipse 1.Fill 1
      "assets.1.layers.19.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 73.Ellipse 1.Fill 1
      "assets.1.layers.20.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 72.Ellipse 1.Fill 1
      "assets.1.layers.21.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 71.Ellipse 1.Fill 1
      "assets.1.layers.22.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 70.Ellipse 1.Fill 1
      "assets.1.layers.23.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 69.Ellipse 1.Fill 1
      "assets.1.layers.24.shapes.0.it.1.c.k": "#c4c4d8",
      // Shape Layer 68.Ellipse 1.Fill 1
      "assets.1.layers.25.shapes.0.it.1.c.k": "#c4c4d8",
      // Mirror front Outlines.Group 1.Fill 1
      "layers.2.shapes.0.it.1.c.k": "#ef976d",
      // Mirror front Outlines.Group 2.Stroke 1
      "layers.2.shapes.1.it.1.c.k": "#eac885",
      // Mirror front Outlines.Group 3.Fill 1
      "layers.2.shapes.2.it.1.c.k": "#ef976d",
      // Bumper front Outlines.Group 1.Fill 1
      "layers.3.shapes.0.it.1.c.k": "#d7d6e2",
      // Bumper front Outlines.Group 2.Fill 1
      "layers.3.shapes.1.it.1.c.k": "#d7d6e2",
      // Bumper front Outlines.Group 3.Fill 1
      "layers.3.shapes.2.it.1.c.k": "#c4c4d8",
      // Bumper front Outlines.Group 4.Fill 1
      "layers.3.shapes.3.it.1.c.k": "#c4c4d8",
      // Bumper front Outlines.Group 5.Fill 1
      "layers.3.shapes.4.it.1.c.k": "#d7d6e2",
      // Bumper rear Outlines.Group 1.Fill 1
      "layers.4.shapes.0.it.1.c.k": "#d7d6e2",
      // Lamps Outlines.Group 1.Fill 1
      "layers.5.shapes.0.it.1.c.k": "#4b4b6f",
      // Lamps Outlines.Group 2.Fill 1
      "layers.5.shapes.1.it.1.c.k": "#4b4b6f",
      // Lamps Outlines.Group 3.Fill 1
      "layers.5.shapes.2.it.1.c.k": "#4b4b6f",
      // Lamps Outlines.Group 4.Fill 1
      "layers.5.shapes.3.it.1.c.k": "#ffffff",
      // Lamps Outlines.Group 5.Fill 1
      "layers.5.shapes.4.it.1.c.k": "#ffffff",
      // Lamps Outlines.Group 6.Fill 1
      "layers.5.shapes.5.it.1.c.k": "#815067",
      // Body Outlines.Group 1.Stroke 1
      "layers.10.shapes.0.it.1.c.k": "#ffffff",
      // Body Outlines.Group 2.Fill 1
      "layers.10.shapes.1.it.1.c.k": "#eac885",
      // Body Outlines.Group 3.Fill 1
      "layers.10.shapes.2.it.1.c.k": "#eac885",
      // Body Outlines.Group 4.Fill 1
      "layers.10.shapes.3.it.1.c.k": "#ffffff",
      // Body Outlines.Group 5.Fill 1
      "layers.10.shapes.4.it.1.c.k": "#ffffff",
      // Body Outlines.Group 6.Stroke 1
      "layers.10.shapes.5.it.1.c.k": "#ffffff",
      // Body Outlines.Group 7.Fill 1
      "layers.10.shapes.6.it.1.c.k": "#ef976d",
      // Body Outlines.Group 8.Stroke 1
      "layers.10.shapes.7.it.3.c.k": "#ef976d",
      // Body Outlines.Group 9.Stroke 1
      "layers.10.shapes.8.it.1.c.k": "#eac885",
      // Body Outlines.Group 10.Stroke 1
      "layers.10.shapes.9.it.1.c.k": "#ffffff",
      // Body Outlines.Group 11.Stroke 1
      "layers.10.shapes.10.it.1.c.k": "#eac885",
      // Body Outlines.Group 12.Fill 1
      "layers.10.shapes.11.it.4.c.k": "#ef976d",
      // Body Outlines.Group 13.Fill 1
      "layers.10.shapes.12.it.1.c.k": "#4b4b6f",
      // Body Outlines.Group 14.Fill 1
      "layers.10.shapes.13.it.1.c.k": "#4b4b6f",
      // Body Outlines.Group 15.Fill 1
      "layers.10.shapes.14.it.1.c.k": "#4b4b6f",
      // Body Outlines.Group 16.Fill 1
      "layers.10.shapes.15.it.1.c.k": "#eac885",
      // Body Outlines.Group 17.Fill 1
      "layers.10.shapes.16.it.1.c.k": "#4b4b6f",
      // Body Outlines.Group 18.Fill 1
      "layers.10.shapes.17.it.1.c.k": "#4b4b6f",
      // Body Outlines.Group 19.Fill 1
      "layers.10.shapes.18.it.1.c.k": "#d7d6e2",
      // Body Outlines.Group 20.Fill 1
      "layers.10.shapes.19.it.1.c.k": "#ab706d",
      // Mirror back Outlines.Group 1.Fill 1
      "layers.11.shapes.0.it.1.c.k": "#ef976d",
      // Wheel white left Outlines 3.Group 1.Fill 1
      "layers.12.shapes.0.it.1.c.k": "#ffffff",
      // Wheel white left Outlines 2.Group 1.Fill 1
      "layers.13.shapes.0.it.1.c.k": "#ffffff",
      // Wheel blue left Outlines.Group 1.Fill 1
      "layers.14.shapes.0.it.1.c.k": "#5775b9",
      // Wheel left front Outlines.Group 1.Fill 1
      "layers.15.shapes.0.it.1.c.k": "#4b4b6f",
      // Wheel blue right Outlines.Group 1.Fill 1
      "layers.16.shapes.0.it.1.c.k": "#5775b9",
      // Wheel front right Outlines.Group 1.Fill 1
      "layers.17.shapes.0.it.1.c.k": "#4b4b6f",
      // Wheel back right Outlines.Group 1.Fill 1
      "layers.18.shapes.0.it.1.c.k": "#4b4b6f",
      // Shape Layer 49.Shape 1.Stroke 1
      "layers.20.shapes.0.it.1.c.k": "#eac885",
      // Shape Layer 48.Shape 1.Stroke 1
      "layers.21.shapes.0.it.1.c.k": "#eac885",
      // Shape Layer 47.Shape 1.Stroke 1
      "layers.22.shapes.0.it.1.c.k": "#eac885",
      // Shape Layer 46.Shape 1.Stroke 1
      "layers.23.shapes.0.it.1.c.k": "#eac885",
      // Shape Layer 45.Shape 1.Stroke 1
      "layers.24.shapes.0.it.1.c.k": "#eac885",
      // Shape Layer 44.Shape 1.Stroke 1
      "layers.25.shapes.0.it.1.c.k": "#eac885",
      // Shape Layer 13.Shape 1.Stroke 1
      "layers.26.shapes.0.it.1.c.k": "#eac885",
      // Shape Layer 12.Shape 1.Stroke 1
      "layers.27.shapes.0.it.1.c.k": "#eac885",
      // Shape Layer 11.Shape 1.Stroke 1
      "layers.28.shapes.0.it.1.c.k": "#eac885",
      // Wheel back left Outlines.Group 1.Fill 1
      "layers.29.shapes.0.it.1.c.k": "#4b4b6f",
      // Shape Layer 43.Shape 1.Stroke 1
      "layers.30.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 42.Shape 1.Stroke 1
      "layers.31.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 41.Shape 1.Stroke 1
      "layers.32.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 40.Shape 1.Stroke 1
      "layers.33.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 39.Shape 1.Stroke 1
      "layers.34.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 38.Shape 1.Stroke 1
      "layers.35.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 37.Shape 1.Stroke 1
      "layers.36.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 36.Shape 1.Stroke 1
      "layers.37.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 35.Shape 1.Stroke 1
      "layers.38.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 34.Shape 1.Stroke 1
      "layers.39.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 33.Shape 1.Stroke 1
      "layers.40.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 32.Shape 1.Stroke 1
      "layers.41.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 31.Shape 1.Stroke 1
      "layers.42.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 30.Shape 1.Stroke 1
      "layers.43.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 29.Shape 1.Stroke 1
      "layers.44.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 28.Shape 1.Stroke 1
      "layers.45.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 27.Shape 1.Stroke 1
      "layers.46.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 26.Shape 1.Stroke 1
      "layers.47.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 25.Shape 1.Stroke 1
      "layers.48.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 24.Shape 1.Stroke 1
      "layers.49.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 23.Shape 1.Stroke 1
      "layers.50.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 22.Shape 1.Stroke 1
      "layers.51.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 21.Shape 1.Stroke 1
      "layers.52.shapes.0.it.1.c.k": "#c5c5c5",
      // Shape Layer 20.Shape 1.Stroke 1
      "layers.53.shapes.0.it.1.c.k": "#c5c5c5",
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(RollingCarAnimation);
