import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import BikingIsCool from '@/assets/animations/biking-is-cool.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const BikingIsCoolAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const wheel = (isDark ? tw.color('stone-700') : '#201515') as string; // #201515;
    const bicycleFrame = (isDark ? tw.color('neutral-400') : '#3b2325') as string; // #3b2325;
    const crankset = (isDark ? tw.color('black') : tw.color('gray-100')) as string; // #ffffff;
    return colouriseLottie(BikingIsCool, {
      // Shape Layer 23.Shape 1.Fill 1
      'assets.0.layers.0.shapes.0.it.1.c.k': '#feeaea',
      // Shape Layer 22.Rectangle 1.Fill 1
      'assets.0.layers.1.shapes.0.it.1.c.k': '#48413c',
      // Shape Layer 21.Rectangle 1.Stroke 1
      'assets.0.layers.2.shapes.0.it.1.c.k': '#ffffff',
      // Shape Layer 21.Rectangle 1.Fill 1
      'assets.0.layers.2.shapes.0.it.2.c.k': '#48413c',
      // Shape Layer 20.Shape 1.Fill 1
      'assets.0.layers.3.shapes.0.it.1.c.k': '#48413c',
      // Shape Layer 18.Shape 1.Fill 1
      'assets.0.layers.4.shapes.0.it.1.c.k': '#48413c',
      // Shape Layer 17.Shape 2.Fill 1
      'assets.0.layers.5.shapes.0.it.1.c.k': '#48413c',
      // Shape Layer 17.Shape 1.Fill 1
      'assets.0.layers.5.shapes.1.it.1.c.k': '#48423b',
      // Shape Layer 16.Shape 2.Fill 1
      'assets.0.layers.6.shapes.0.it.1.c.k': '#48413c',
      // Shape Layer 16.Shape 1.Fill 1
      'assets.0.layers.6.shapes.1.it.1.c.k': '#524d64',
      // smallcloud 2.Ellipse 1.Stroke 1
      'assets.1.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // smallcloud 2.Ellipse 1.Fill 1
      'assets.1.layers.0.shapes.0.it.2.c.k': '#cbe1f0',
      // Shape Layer 2.Shape 1.Stroke 1
      'assets.1.layers.1.shapes.0.it.1.c.k': bicycleFrame,
      // Shape Layer 2.Shape 1.Fill 1
      'assets.1.layers.1.shapes.0.it.2.c.k': '#f45151',
      // Layer 2 Outlines.Group 1.Stroke 1
      'assets.1.layers.2.shapes.0.it.1.c.k': bicycleFrame,
      // a Outlines.Group 1.Stroke 1
      'assets.1.layers.3.shapes.0.it.1.c.k': bicycleFrame,
      // b Outlines.Group 1.Stroke 1
      'assets.1.layers.4.shapes.0.it.1.c.k': bicycleFrame,
      // Layer 7 Outlines.Group 1.Fill 1
      'assets.1.layers.5.shapes.0.it.3.c.k': bicycleFrame,
      // Layer 9 Outlines.Group 1.Fill 1
      'assets.1.layers.6.shapes.0.it.1.c.k': bicycleFrame,
      // Layer 10 Outlines.Group 1.Fill 1
      'assets.1.layers.7.shapes.0.it.2.c.k': bicycleFrame,
      // Layer 13 Outlines.Group 1.Fill 1
      'assets.1.layers.9.shapes.0.it.2.c.k': bicycleFrame,
      // Layer 15 Outlines.Group 1.Fill 1
      'assets.1.layers.10.shapes.0.it.2.c.k': bicycleFrame,
      // Layer 15 Outlines.Group 1.Fill 1
      'assets.1.layers.11.shapes.0.it.2.c.k': bicycleFrame,
      // Layer 16 Outlines.Group 1.Fill 1
      'assets.1.layers.12.shapes.0.it.2.c.k': bicycleFrame,
      // Layer 17 Outlines.Group 2.Stroke 1
      'assets.1.layers.13.shapes.0.it.2.c.k': wheel,
      // Layer 21 Outlines.Group 1.Fill 1
      'assets.1.layers.14.shapes.0.it.2.c.k': bicycleFrame,
      // Layer 25 Outlines.Group 1.Stroke 1
      'assets.1.layers.15.shapes.0.it.1.c.k': bicycleFrame,
      // Layer 26 Outlines.Group 1.Stroke 1
      'assets.1.layers.16.shapes.0.it.1.c.k': bicycleFrame,
      // Layer 27 Outlines.Group 1.Stroke 1
      'assets.1.layers.17.shapes.0.it.1.c.k': bicycleFrame,
      // Layer 28 Outlines.Group 1.Fill 1
      'assets.1.layers.18.shapes.0.it.1.c.k': bicycleFrame,
      // Layer 29 Outlines.Group 1.Fill 1
      'assets.1.layers.19.shapes.0.it.2.c.k': bicycleFrame,
      // Layer 30 Outlines.Stroke 1
      'assets.1.layers.20.shapes.1.c.k': wheel,
      // cloud 2.Shape 1.Stroke 1
      'assets.1.layers.21.shapes.0.it.1.c.k': '#ffffff',
      // cloud 2.Shape 1.Fill 1
      'assets.1.layers.21.shapes.0.it.2.c.k': '#d8e9f4',
      // cloud.Shape 1.Stroke 1
      'assets.1.layers.22.shapes.0.it.1.c.k': '#ffffff',
      // cloud.Shape 1.Fill 1
      'assets.1.layers.22.shapes.0.it.2.c.k': '#dae9f4',
      // cape3.Shape 1.Stroke 1
      'layers.0.shapes.0.it.1.c.k': '#ffffff',
      // cape3.Shape 1.Fill 1
      'layers.0.shapes.0.it.2.c.k': '#f6b00b',
      // Shape Layer 17.Shape 1.Stroke 1
      'layers.1.shapes.0.it.1.c.k': '#ffffff',
      // Shape Layer 17.Shape 1.Fill 1
      'layers.1.shapes.0.it.2.c.k': '#e7544e',
      // Shape Layer 16.Shape 1.Stroke 1
      'layers.2.shapes.0.it.1.c.k': '#ffffff',
      // Shape Layer 16.Shape 1.Fill 1
      'layers.2.shapes.0.it.2.c.k': '#e7544e',
      // arm.Fill 1
      'layers.4.shapes.1.c.k': '#ea5750',
      // head1 Outlines.Group 1.Fill 1
      'layers.5.shapes.0.it.1.c.k': '#e6534d',
      // upper leg.Shape 1.Fill 1
      'layers.6.shapes.0.it.1.c.k': '#f05c55',
      // body.Shape 1.Fill 1
      'layers.7.shapes.0.it.2.c.k': '#f05c55',
      // capeback.Shape 1.Stroke 1
      'layers.8.shapes.0.it.1.c.k': '#ffffff',
      // capeback.Shape 1.Fill 1
      'layers.8.shapes.0.it.2.c.k': '#cf8304',
      // lower leg.Shape 1.Fill 1
      'layers.9.shapes.0.it.1.c.k': '#f05c55',
      // feet1 Outlines.Group 1.Fill 1
      'layers.10.shapes.0.it.1.c.k': '#f05c55',
      // Pedal.Rectangle 1.Fill 1
      'layers.11.shapes.0.it.1.c.k': '#4f3d3d',
      // Line.Shape 1.Stroke 1
      'layers.12.shapes.0.it.1.c.k': '#4f3d3d',
      // Line.Shape 1.Fill 1
      'layers.12.shapes.0.it.2.c.k': '#f45151',
      // Layer 6 Outlines.Group 1.Fill 1
      'layers.13.shapes.0.it.1.c.k': '#352b2c',
      // Layer 6 Outlines.Group 2.Fill 1
      'layers.13.shapes.1.it.1.c.k': '#f0efed',
      // Layer 6 Outlines.Group 3.Fill 1
      'layers.13.shapes.2.it.1.c.k': '#352b2c',
      // Layer 6 Outlines.Group 4.Fill 1
      'layers.13.shapes.3.it.1.c.k': '#f0efed',
      // Layer 6 Outlines.Group 5.Fill 1
      'layers.13.shapes.4.it.1.c.k': '#352b2c',
      // Layer 6 Outlines.Group 6.Fill 1
      'layers.13.shapes.5.it.1.c.k': '#f0efed',
      // Layer 6 Outlines.Group 7.Fill 1
      'layers.13.shapes.6.it.1.c.k': '#3a3233',
      // Layer 6 Outlines.Group 8.Fill 1
      'layers.13.shapes.7.it.1.c.k': '#322b2c',
      // Layer 6 Outlines.Group 9.Fill 1
      'layers.13.shapes.8.it.1.c.k': '#3a3233',
      // Shape Layer 18.Shape 1.Stroke 1
      'layers.14.shapes.0.it.1.c.k': bicycleFrame,
      // Shape Layer 18.Shape 1.Fill 1
      'layers.14.shapes.0.it.2.c.k': '#f45151',
      // Shape Layer 14.Shape 1.Stroke 1
      'layers.15.shapes.0.it.1.c.k': bicycleFrame,
      // Shape Layer 14.Shape 1.Fill 1
      'layers.15.shapes.0.it.2.c.k': '#f45151',
      // Shape Layer 13.Shape 1.Stroke 1
      'layers.16.shapes.0.it.1.c.k': bicycleFrame,
      // Shape Layer 13.Shape 1.Fill 1
      'layers.16.shapes.0.it.2.c.k': '#f45151',
      // Shape Layer 11.Ellipse 1.Stroke 1
      'layers.17.shapes.0.it.1.c.k': bicycleFrame, // crankset stroke
      // Shape Layer 11.Ellipse 1.Fill 1
      'layers.17.shapes.0.it.2.c.k': crankset,
      // bottomsholder.Shape 1.Stroke 1
      'layers.18.shapes.0.it.1.c.k': bicycleFrame,
      // bottomsholder.Shape 1.Fill 1
      'layers.18.shapes.0.it.2.c.k': '#f45151',
      // seat.Shape 1.Fill 1
      'layers.19.shapes.0.it.2.c.k': '#581919',
      // upper leg 2.Shape 1.Fill 1
      'layers.20.shapes.0.it.1.c.k': '#e9503f',
      // lower leg 2.Shape 1.Fill 1
      'layers.21.shapes.0.it.1.c.k': '#e9503f',
      // feet1 Outlines 2.Group 1.Fill 1
      'layers.22.shapes.0.it.1.c.k': '#e9503f',
      // Pedal 2.Rectangle 1.Fill 1
      'layers.23.shapes.0.it.1.c.k': '#4f3d3d',
      // Line 2.Shape 1.Stroke 1
      'layers.24.shapes.0.it.1.c.k': '#4f3d3d',
      // Line 2.Shape 1.Fill 1
      'layers.24.shapes.0.it.2.c.k': '#f45151',
      // Frame2.Shape 1.Stroke 1
      'layers.25.shapes.0.it.2.c.k': '#ffffff',
      // Frame2.Shape 1.Fill 1
      'layers.25.shapes.0.it.3.c.k': '#f05c55',
      // arm 2.Shape 1.Fill 1
      'layers.27.shapes.0.it.1.c.k': '#cf4b3c',
      // back.Shape 1.Stroke 1
      'layers.28.shapes.0.it.1.c.k': '#ffffff',
      // back.Shape 1.Fill 1
      'layers.28.shapes.0.it.2.c.k': '#cf8304',
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(BikingIsCoolAnimation);
