import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import LoginForm from '@/assets/animations/login-form.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'> & { color?: string };

const LoginAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { color, ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(LoginForm, {
        // Group 1 :M.Group 1.Group 1.Fill 1
        'layers.0.shapes.0.it.0.it.1.c.k': theme.maizeCrayola,
        // Group 1 :M.Group 2.Group 2.Fill 1
        'layers.0.shapes.1.it.0.it.1.c.k': theme.maizeCrayola,
        // Group 1 :M.Group 3.Group 3.Fill 1
        'layers.0.shapes.2.it.0.it.1.c.k': theme.maizeCrayola,
        // Group 1 :M.Group 4.Group 4.Fill 1
        'layers.0.shapes.3.it.0.it.1.c.k': theme.maizeCrayola,
        // Group 1 :M.Group 5.Group 5.Fill 1
        'layers.0.shapes.4.it.0.it.1.c.k': theme.maizeCrayola,
        // Group 1 :M.Group 6.Group 6.Fill 1
        'layers.0.shapes.5.it.0.it.1.c.k': theme.maizeCrayola,
        // Group 1 :M.Group 7.Group 7.Fill 1
        'layers.0.shapes.6.it.0.it.1.c.k': theme.maizeCrayola,
        // Group 1 :M.Group 8.Group 8.Fill 1
        'layers.0.shapes.7.it.0.it.1.c.k': theme.maizeCrayola,
        // User name.User name.Fill 1
        'layers.1.shapes.0.it.1.c.k': theme.maizeCrayola,
        // Login & Sign up Button.Login & Sign up Button.Fill 1
        'layers.2.shapes.0.it.1.c.k': theme.miramonYellow,
        // Password Box.Password Box.Fill 1
        'layers.3.shapes.0.it.1.c.k': (colorScheme === 'dark'
          ? tw.color('gray-500')
          : tw.color('white')) as string,
        // User name Box.User name Box.Fill 1
        'layers.4.shapes.0.it.1.c.k': (colorScheme === 'dark'
          ? tw.color('gray-500')
          : tw.color('white')) as string,
        // Use icon.Group 1.Fill 1
        'layers.5.shapes.0.it.1.c.k': theme.miramonYellow,
        // Use icon.Group 2.Fill 1
        'layers.5.shapes.1.it.1.c.k': (colorScheme === 'dark'
          ? theme.miramonYellow
          : tw.color('white')) as string,
        // Use icon.Group 3.Fill 1
        'layers.5.shapes.2.it.1.c.k': theme.peachYellow,
        // Top Button.Group 1.Fill 1
        'layers.6.shapes.0.it.1.c.k': tw.color('red-500') as string,
        // Top Button.Group 2.Fill 1
        'layers.6.shapes.1.it.1.c.k': tw.color('amber-400') as string,
        // Top Button.Group 3.Fill 1
        'layers.6.shapes.2.it.1.c.k': tw.color('green-500') as string,
        // Tab.Tab.Fill 1
        'layers.7.shapes.0.it.1.c.k': (colorScheme === 'dark'
          ? tw.color('slate-800')
          : tw.color('gray-200')) as string,
      }),
    [colorScheme],
  );

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(LoginAnimation);
