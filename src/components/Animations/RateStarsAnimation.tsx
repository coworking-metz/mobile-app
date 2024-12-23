import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import RateStars from '@/assets/animations/rate-stars.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const RateStarsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const backgroundColor = (isDark ? tw.color('gray-700') : tw.color('blue-100')) as string; // '#ebf5ff'
    return colouriseLottie(RateStars, {
      // Girl.Hand L.Group 1.Fill 1
      'assets.0.layers.0.shapes.0.it.1.c.k': '#f20010',
      // Girl.Hand L.Group 2.Fill 1
      'assets.0.layers.0.shapes.1.it.1.c.k': '#fb394b',
      // Girl.Hand L.Group 3.Fill 1
      'assets.0.layers.0.shapes.2.it.1.c.k': '#fdddb6',
      // Girl.Head.Group 1.Fill 1
      'assets.0.layers.1.shapes.0.it.1.c.k': '#2b2468',
      // Girl.Head.Group 2.Fill 1
      'assets.0.layers.1.shapes.1.it.1.c.k': '#fdddb6',
      // Girl.Head.Group 3.Fill 1
      'assets.0.layers.1.shapes.2.it.1.c.k': '#3091d8',
      // Girl.Head.Group 4.Fill 1
      'assets.0.layers.1.shapes.3.it.1.c.k': '#1369b1',
      // Girl.Neck.Neck.Fill 1
      'assets.0.layers.2.shapes.0.it.1.c.k': '#fdcb90',
      // Girl.Body.Group 1.Fill 1
      'assets.0.layers.4.shapes.0.it.1.c.k': '#f20010',
      // Girl.Body.Group 2.Fill 1
      'assets.0.layers.4.shapes.1.it.1.c.k': '#fb394b',
      // Girl.Hair.Hair.Fill 1
      'assets.0.layers.5.shapes.0.it.1.c.k': '#221e54',
      // Girl.Star 4.Group 1.Fill 1
      'assets.0.layers.6.shapes.0.it.1.c.k': '#ffde05',
      // Girl.Star 4.Group 2.Fill 1
      'assets.0.layers.6.shapes.1.it.1.c.k': '#ffc105',
      // Girl.Hand R.Group 1.Fill 1
      'assets.0.layers.7.shapes.0.it.1.c.k': '#f20010',
      // Girl.Hand R.Group 2.Fill 1
      'assets.0.layers.7.shapes.1.it.1.c.k': '#fb394b',
      // Girl.Hand R.Group 3.Fill 1
      'assets.0.layers.7.shapes.2.it.1.c.k': '#fdddb6',
      // Girl.leg L.Group 1.Fill 1
      'assets.0.layers.8.shapes.0.it.1.c.k': '#221e54',
      // Girl.leg L.Group 2.Fill 1
      'assets.0.layers.8.shapes.1.it.1.c.k': '#332a7c',
      // Girl.Leg R.Group 1.Fill 1
      'assets.0.layers.9.shapes.0.it.1.c.k': '#221e54',
      // Girl.Leg R.Group 2.Fill 1
      'assets.0.layers.9.shapes.1.it.1.c.k': '#332a7c',
      // Girl.Shoes R.Shoes R.Fill 1
      'assets.0.layers.10.shapes.0.it.1.c.k': '#1a1840',
      // Girl.Shoes L.Shoes L.Fill 1
      'assets.0.layers.11.shapes.0.it.1.c.k': '#1a1840',
      // Base and Plants.Base.Base.Fill 1
      'assets.1.layers.3.shapes.0.it.1.c.k': '#b7d9f9',
      // Plant.Leaf 3.Group 1.Fill 1
      'assets.2.layers.0.shapes.0.it.1.c.k': '#007229',
      // Plant.Leaf 3.Group 2.Fill 1
      'assets.2.layers.0.shapes.1.it.1.c.k': '#00db56',
      // Plant.Leaf 3.Group 3.Fill 1
      'assets.2.layers.0.shapes.2.it.1.c.k': '#bee6a0',
      // Plant.Leaf 2.Group 1.Fill 1
      'assets.2.layers.1.shapes.0.it.1.c.k': '#007229',
      // Plant.Leaf 2.Group 2.Fill 1
      'assets.2.layers.1.shapes.1.it.1.c.k': '#00c54c',
      // Plant.Leaf 2.Group 3.Fill 1
      'assets.2.layers.1.shapes.2.it.1.c.k': '#bee6a0',
      // Plant.Leaf.Group 1.Fill 1
      'assets.2.layers.2.shapes.0.it.1.c.k': '#007229',
      // Plant.Leaf.Group 2.Fill 1
      'assets.2.layers.2.shapes.1.it.1.c.k': '#00ae42',
      // Plant.Leaf.Group 3.Fill 1
      'assets.2.layers.2.shapes.2.it.1.c.k': '#bee6a0',
      // Star 2.Group 1.Fill 1
      'layers.1.shapes.0.it.1.c.k': '#ffde05',
      // Star 2.Group 2.Fill 1
      'layers.1.shapes.1.it.1.c.k': '#ffc105',
      // Star 5.Group 1.Fill 1
      'layers.2.shapes.0.it.1.c.k': '#ffde05',
      // Star 5.Group 2.Fill 1
      'layers.2.shapes.1.it.1.c.k': '#ffc105',
      // Star.Group 1.Fill 1
      'layers.3.shapes.0.it.1.c.k': '#ffde05',
      // Star.Group 2.Fill 1
      'layers.3.shapes.1.it.1.c.k': '#ffc105',
      // Star 3.Group 1.Fill 1
      'layers.4.shapes.0.it.1.c.k': '#ffde05',
      // Star 3.Group 2.Fill 1
      'layers.4.shapes.1.it.1.c.k': '#ffc105',
      // Star box.Group 1.Fill 1
      'layers.6.shapes.0.it.1.c.k': '#4512b1',
      // Star box.Group 2.Fill 1
      'layers.6.shapes.1.it.1.c.k': '#4512b1',
      // Star box.Group 3.Fill 1
      'layers.6.shapes.2.it.1.c.k': '#4512b1',
      // Star box.Group 4.Fill 1
      'layers.6.shapes.3.it.1.c.k': '#4512b1',
      // Star box.Group 5.Fill 1
      'layers.6.shapes.4.it.1.c.k': '#4512b1',
      // Star box.Group 6.Fill 1
      'layers.6.shapes.5.it.1.c.k': '#7433ee',
      // Particle 06.Group 1.Fill 1
      'layers.8.shapes.0.it.1.c.k': '#ffde05',
      // Particle 05.Group 1.Fill 1
      'layers.9.shapes.0.it.1.c.k': '#ffde05',
      // Particle 04.Group 1.Fill 1
      'layers.10.shapes.0.it.1.c.k': '#ffde05',
      // Bg.Group 1.Fill 1
      'layers.11.shapes.0.it.1.c.k': backgroundColor,
      // Bg.Group 2.Fill 1
      'layers.11.shapes.1.it.1.c.k': backgroundColor,
      // Bg.Group 3.Fill 1
      'layers.11.shapes.2.it.1.c.k': backgroundColor,
      // Bg.Group 4.Fill 1
      'layers.11.shapes.3.it.1.c.k': backgroundColor,
      // Bg.Group 5.Fill 1
      'layers.11.shapes.4.it.1.c.k': backgroundColor,
      // Bg.Group 7.Fill 1
      'layers.11.shapes.5.it.1.c.k': backgroundColor,
      // Bg.Group 8.Fill 1
      'layers.11.shapes.6.it.1.c.k': backgroundColor,
      // Bg.Group 6.Fill 1
      'layers.11.shapes.7.it.1.c.k': backgroundColor,
      // Bg.Group 9.Fill 1
      'layers.11.shapes.8.it.1.c.k': backgroundColor,
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(RateStarsAnimation);
