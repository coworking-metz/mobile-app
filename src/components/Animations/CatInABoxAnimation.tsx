import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import CatInABox from '@/assets/animations/cat-in-a-box.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const CatInABoxAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const backgroundColor = (isDark ? tw.color('zinc-900') : tw.color('white')) as string;
    return colouriseLottie(CatInABox, {
      // // blink 2.Shape 1.Stroke 1
      // "assets.0.layers.0.shapes.0.it.1.c.k": "#ffffff",
      // // blink 2.Shape 1.Fill 1
      // "assets.0.layers.0.shapes.0.it.2.c.k": "#0c0c0c",
      // // blink.Shape 1.Stroke 1
      // "assets.0.layers.1.shapes.0.it.1.c.k": "#ffffff",
      // // blink.Shape 1.Fill 1
      // "assets.0.layers.1.shapes.0.it.2.c.k": "#0c0c0c",
      // // box_panel_main2 Outlines.Group 1.Fill 1
      // "assets.0.layers.6.shapes.0.it.1.c.k": "#72431c",
      // // box_panel_main2 Outlines.Group 2.Fill 1
      // "assets.0.layers.6.shapes.1.it.1.c.k": "#8c6239",
      // // box_panel_main Outlines.Group 1.Fill 1
      // "assets.0.layers.7.shapes.0.it.1.c.k": "#8c6239",
      // // hair.Shape 1.Stroke 1
      // "assets.0.layers.8.shapes.0.it.1.c.k": "#ffffff",
      // // hair.Shape 1.Stroke 1
      // "assets.0.layers.9.shapes.0.it.1.c.k": "#ffffff",
      // // hair.Shape 1.Stroke 1
      // "assets.0.layers.10.shapes.0.it.1.c.k": "#ffffff",
      // // hair.Shape 1.Stroke 1
      // "assets.0.layers.11.shapes.0.it.1.c.k": "#ffffff",
      // // hair.Shape 1.Stroke 1
      // "assets.0.layers.12.shapes.0.it.1.c.k": "#ffffff",
      // // box Outlines.Group 1.Fill 1
      // "assets.0.layers.13.shapes.0.it.1.c.k": "#42210b",
      // // box Outlines.Group 2.Fill 1
      // "assets.0.layers.13.shapes.1.it.1.c.k": "#42210b",
      // // box Outlines.Group 3.Fill 1
      // "assets.0.layers.13.shapes.2.it.1.c.k": "#42210b",
      // // box Outlines.Group 4.Fill 1
      // "assets.0.layers.13.shapes.3.it.1.c.k": "#42210b",
      // // box Outlines.Group 5.Fill 1
      // "assets.0.layers.13.shapes.4.it.1.c.k": "#42210b",
      // // box Outlines.Group 6.Fill 1
      // "assets.0.layers.13.shapes.5.it.1.c.k": "#42210b",
      // // box Outlines.Group 7.Fill 1
      // "assets.0.layers.13.shapes.6.it.6.c.k": "#72431c",
      // // eyelid_L Outlines.Group 1.Fill 1
      // "assets.0.layers.14.shapes.0.it.1.c.k": "#333333",
      // // eyelid_R Outlines.Group 1.Fill 1
      // "assets.0.layers.15.shapes.0.it.1.c.k": "#333333",
      // // eye_ball_L Outlines.Group 1.Fill 1
      // "assets.0.layers.16.shapes.0.it.1.c.k": "#333333",
      // // eye_ball_R Outlines.Group 1.Fill 1
      // "assets.0.layers.17.shapes.0.it.1.c.k": "#333333",
      // // eye_L Outlines.Group 1.Fill 1
      // "assets.0.layers.18.shapes.0.it.1.c.k": "#fbae17",
      // // eye_R Outlines.Group 1.Fill 1
      // "assets.0.layers.19.shapes.0.it.1.c.k": "#fbae17",
      // // box_black Outlines.Group 1.Fill 1
      // "assets.0.layers.20.shapes.0.it.1.c.k": "#0c0c0c",
      // // nose.Shape 2.Stroke 1
      // "assets.0.layers.21.shapes.0.it.1.c.k": "#333333",
      // // nose.Shape 1.Stroke 1
      // "assets.0.layers.21.shapes.1.it.1.c.k": "#333333",
      // // box_panel 2 Outlines.Group 1.Fill 1
      // "assets.0.layers.22.shapes.0.it.1.c.k": "#c69c6d",
      // // box_side Outlines.Group 1.Fill 1
      // "assets.0.layers.23.shapes.0.it.1.c.k": "#8c6239",
      // // mustache8.Shape 1.Stroke 1
      // "assets.0.layers.24.shapes.0.it.1.c.k": "#333333",
      // // mustache7.Shape 1.Stroke 1
      // "assets.0.layers.25.shapes.0.it.1.c.k": "#333333",
      // // mustache6.Shape 1.Stroke 1
      // "assets.0.layers.26.shapes.0.it.1.c.k": "#333333",
      // // mustache5.Shape 1.Stroke 1
      // "assets.0.layers.27.shapes.0.it.1.c.k": "#333333",
      // // mustache4.Shape 1.Stroke 1
      // "assets.0.layers.28.shapes.0.it.1.c.k": "#cccccc",
      // // mustache3.Shape 1.Stroke 1
      // "assets.0.layers.29.shapes.0.it.1.c.k": "#cccccc",
      // // mustache2.Shape 1.Stroke 1
      // "assets.0.layers.30.shapes.0.it.1.c.k": "#cccccc",
      // // mustache1.Shape 1.Stroke 1
      // "assets.0.layers.31.shapes.0.it.1.c.k": "#cccccc",
      // // tie.Shape 3.Stroke 1
      // "assets.0.layers.32.shapes.0.it.1.c.k": "#ffffff",
      // // tie.Shape 3.Fill 1
      // "assets.0.layers.32.shapes.0.it.2.c.k": "#343c53",
      // // tie.Shape 2.Stroke 1
      // "assets.0.layers.32.shapes.1.it.1.c.k": "#ffffff",
      // // tie.Shape 2.Fill 1
      // "assets.0.layers.32.shapes.1.it.2.c.k": "#343c53",
      // // tie.Shape 1.Stroke 1
      // "assets.0.layers.32.shapes.2.it.1.c.k": "#ffffff",
      // // tie.Shape 1.Fill 1
      // "assets.0.layers.32.shapes.2.it.2.c.k": "#343c53",
      // // line.Shape 1.Stroke 1
      // "assets.0.layers.33.shapes.0.it.1.c.k": "#ffffff",
      // // line.Shape 1.Fill 1
      // "assets.0.layers.33.shapes.0.it.2.c.k": "#343c53",
      // // stomach.Shape 1.Fill 1
      // "assets.0.layers.34.shapes.0.it.1.c.k": "#efefef",
      // // ear_inside_L Outlines.Group 1.Fill 1
      // "assets.0.layers.35.shapes.0.it.1.c.k": "#424242",
      // // ear_inside_R Outlines.Group 1.Fill 1
      // "assets.0.layers.36.shapes.0.it.1.c.k": "#424242",
      // // ear_R.Group 1.Fill 1
      // "assets.0.layers.37.shapes.0.it.2.c.k": "#333333",
      // // ear_L.Group 2.Fill 1
      // "assets.0.layers.38.shapes.0.it.2.c.k": "#333333",
      // // body Outlines.Group 1.Fill 1
      // "assets.0.layers.39.shapes.0.it.1.c.k": "#dddddd",
      // // tail Outlines 2.Group 1.Fill 1
      // "assets.0.layers.40.shapes.0.it.1.c.k": "#333333",
      // // box_backside Outlines.Group 1.Fill 1
      // "assets.0.layers.41.shapes.0.it.1.c.k": "#603813",
      // // box_panel Outlines.Group 1.Fill 1
      // "assets.0.layers.42.shapes.0.it.1.c.k": "#c69c6d",
      // // Thrive Outlines.Group 1.Fill 1
      // "layers.1.shapes.0.it.1.c.k": "#ffffff",
      // // Thrive Outlines.Ellipse 1.Fill 1
      // "layers.1.shapes.1.it.1.c.k": "#ffffff",
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(CatInABoxAnimation);
