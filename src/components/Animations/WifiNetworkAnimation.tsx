import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import WifiNetwork from '@/assets/animations/wifi-network.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const WifiNetworkAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const activeColor = theme.blueCrayola; // originally #000000

    return colouriseLottie(WifiNetwork, {
      // layer 3A.Group 4.Stroke 1
      'layers.0.shapes.0.it.1.c.k': activeColor,
      // layer 3.Group 4.Stroke 1
      'layers.1.shapes.0.it.1.c.k': activeColor,
      // layer 2A.Group 3.Stroke 1
      'layers.2.shapes.0.it.1.c.k': activeColor,
      // layer 2.Group 3.Stroke 1
      'layers.3.shapes.0.it.1.c.k': activeColor,
      // layer 1A.Group 2.Stroke 1
      'layers.4.shapes.0.it.1.c.k': activeColor,
      // layer 1.Group 2.Stroke 1
      'layers.5.shapes.0.it.1.c.k': activeColor,
      // center.Group 1.Fill 1
      'layers.6.shapes.0.it.1.c.k': activeColor,
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} progress={0} {...props} source={colorizedSource} />;
};

export default forwardRef(WifiNetworkAnimation);
