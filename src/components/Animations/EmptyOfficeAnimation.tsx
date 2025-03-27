import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import EmptyOffice from '@/assets/animations/empty-office.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const EmptyOfficeAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const bulbColor = (isDark ? tw.color('amber-400') : tw.color('yellow-300')) as string;
    const lampColor = (isDark ? tw.color('yellow-50') : tw.color('slate-50')) as string;
    const backgroundColor = (isDark ? tw.color('gray-950') : tw.color('gray-300')) as string;
    return colouriseLottie(EmptyOffice, {
      // Shape Layer 1.Ellipse 1.Fill 1
      // 'layers.0.shapes.0.it.1.c.k': '#29acec',
      // desktop/empty-illustration Outlines.Group 1.Fill 1
      // 'layers.1.shapes.0.it.1.c.k': '#101e28',
      // desktop/empty-illustration Outlines.Group 2.Fill 1
      // 'layers.1.shapes.1.it.1.c.k': '#f8b85a',
      // desktop/empty-illustration Outlines.Group 3.Fill 1
      // 'layers.1.shapes.2.it.1.c.k': '#f8b85a',
      // desktop/empty-illustration Outlines.Group 4.Fill 1
      // 'layers.1.shapes.3.it.1.c.k': '#101e28',
      // desktop/empty-illustration Outlines.Group 5.Fill 1
      // 'layers.1.shapes.4.it.1.c.k': '#20717c',
      // desktop/empty-illustration Outlines.Group 6.Fill 1
      // 'layers.1.shapes.5.it.1.c.k': '#249356',
      // desktop/empty-illustration Outlines.Group 7.Fill 1
      // 'layers.1.shapes.6.it.1.c.k': '#ffffff',
      // desktop/empty-illustration Outlines.Group 8.Fill 1
      // 'layers.1.shapes.7.it.1.c.k': '#c4c0b7',
      // desktop/empty-illustration Outlines.Group 9.Fill 1
      // 'layers.1.shapes.8.it.1.c.k': '#244761',
      // Shape Layer 2.Ellipse 1.Fill 1
      // 'layers.2.shapes.0.it.1.c.k': '#29acec',
      // light/empty-illustration Outlines.Group 1.Fill 1
      // 'layers.3.shapes.0.it.1.c.k': '#5e6f7a',
      // light/empty-illustration Outlines.Group 2.Fill 1
      'layers.3.shapes.1.it.1.c.k': bulbColor, // '#f9fc65',
      // light/empty-illustration Outlines.Group 3.Fill 1
      'layers.3.shapes.2.it.1.c.k': lampColor, // '#eff7fb',
      // bg/empty-illustration Outlines.Group 1.Fill 1
      'layers.4.shapes.0.it.1.c.k': backgroundColor, // '#dfe9ee',
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop {...props} source={colorizedSource} />;
};

export default forwardRef(EmptyOfficeAnimation);
