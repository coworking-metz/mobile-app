import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import KeysPair from '@/assets/animations/key-lock.json';
import { colouriseLottie, theme } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const KeyLockAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    return colouriseLottie(KeysPair, {
      // "layers.0.shapes.0.it.1.c.k": "#ffffff",
      // "layers.0.shapes.1.it.1.c.k": "#ffffff",
      // "layers.0.shapes.2.it.1.c.k": "#ffffff",
      // "layers.0.shapes.3.it.1.c.k": "#ffffff",
      // "layers.0.shapes.4.it.1.c.k": "#ffffff",
      // "layers.5.shapes.0.it.1.c.k": "#aa6f07",
      // "layers.5.shapes.0.it.2.c.k": "#edb824",
      // "layers.6.shapes.0.it.0.it.1.c.k": "#ffffff",
      // "layers.6.shapes.0.it.1.it.1.c.k": "#ffffff",
      // "layers.6.shapes.1.it.0.it.1.c.k": "#ffdb45",
      // "layers.6.shapes.1.it.1.it.1.c.k": "#ffdb45",
      // "layers.6.shapes.2.it.2.c.k": "#aa6f07",
      // "layers.6.shapes.3.it.0.it.0.it.0.it.1.c.k": "#875c1e",
      // "layers.6.shapes.3.it.0.it.1.it.0.it.1.c.k": "#ffdb45",
      // "layers.6.shapes.3.it.1.it.0.it.1.c.k": "#875c1e",
      // "layers.6.shapes.3.it.2.it.0.it.1.c.k": "#ffdb45",
      // "layers.6.shapes.4.it.1.c.k": "#af7b12",
      // "layers.6.shapes.5.it.2.c.k": "#af7b12",
      // "layers.6.shapes.6.it.0.it.1.c.k": "#ffe9b3",
      // "layers.6.shapes.6.it.1.it.1.c.k": "#ffe9b3",
      // "layers.6.shapes.7.it.2.c.k": "#f7c759",
      // "layers.6.shapes.8.it.2.c.k": "#edb824",
      // "layers.7.shapes.0.it.1.c.k": "#aa6f07",
      // "layers.7.shapes.0.it.2.c.k": "#edb824",
      // "layers.8.shapes.0.it.0.it.1.c.k": "#ffffff",
      // "layers.8.shapes.0.it.1.it.1.c.k": "#ffffff",
      // "layers.8.shapes.1.it.0.it.1.c.k": "#ffdb45",
      // "layers.8.shapes.1.it.1.it.1.c.k": "#ffdb45",
      // "layers.8.shapes.2.it.2.c.k": "#aa6f07",
      // "layers.8.shapes.3.it.0.it.0.it.0.it.1.c.k": "#875c1e",
      // "layers.8.shapes.3.it.0.it.1.it.0.it.1.c.k": "#ffdb45",
      // "layers.8.shapes.3.it.1.it.0.it.1.c.k": "#875c1e",
      // "layers.8.shapes.3.it.2.it.0.it.1.c.k": "#ffdb45",
      // "layers.8.shapes.4.it.1.c.k": "#af7b12",
      // "layers.8.shapes.5.it.2.c.k": "#af7b12",
      // "layers.8.shapes.6.it.0.it.1.c.k": "#ffe9b3",
      // "layers.8.shapes.6.it.1.it.1.c.k": "#ffe9b3",
      // "layers.8.shapes.7.it.2.c.k": "#f7c759",
      // "layers.8.shapes.8.it.2.c.k": "#edb824",
      // "layers.9.shapes.0.it.1.c.k": "#e9f6ff",
      // "layers.9.shapes.1.it.1.c.k": "#e9f6ff",
      // "layers.9.shapes.2.it.0.it.1.c.k": "#6a7d9e",
      // "layers.9.shapes.3.it.1.c.k": "#70a3d6",
      // "layers.9.shapes.4.it.1.c.k": "#5e4e41",
      // "layers.9.shapes.5.it.0.it.1.c.k": "#bad9f7",
      // "layers.10.shapes.0.it.1.c.k": "#3a3211",
      // "layers.10.shapes.1.it.1.c.k": "#ffffff",
      // "layers.10.shapes.2.it.1.c.k": "#ffffff",
      // "layers.10.shapes.3.it.1.c.k": "#8e8342",
      // "layers.10.shapes.4.it.2.c.k": "#7c7038",
      // "layers.10.shapes.5.it.1.c.k": "#7c7038",
      // "layers.10.shapes.6.it.1.c.k": "#7c7038",
      // "layers.10.shapes.7.it.1.c.k": "#514523",
      // "layers.10.shapes.8.it.1.c.k": "#9b9157",
      // "layers.10.shapes.9.it.1.c.k": "#9b9157",
      // "layers.10.shapes.10.it.1.c.k": "#d8d193",
      // "layers.10.shapes.11.it.1.c.k": "#d8d193",
      // "layers.10.shapes.12.it.1.c.k": "#d8d193",
      // "layers.10.shapes.13.it.1.c.k": "#d8d193",
      // "layers.10.shapes.14.it.1.c.k": "#66582e",
      // "layers.10.shapes.15.it.1.c.k": "#66582e",
      // "layers.10.shapes.16.it.1.c.k": "#d8d193",
      // "layers.10.shapes.17.it.1.c.k": "#eae2a7",
      // "layers.10.shapes.18.it.1.c.k": "#f4e9ab",
      // "layers.10.shapes.19.it.1.c.k": "#66582e",
      // "layers.10.shapes.20.it.1.c.k": "#c3bc78",
      // "layers.11.shapes.0.it.1.c.k": "#aa6f07",
      // "layers.11.shapes.0.it.2.c.k": "#edb824",
      // "layers.12.shapes.0.it.0.it.1.c.k": "#ffffff",
      // "layers.12.shapes.0.it.1.it.1.c.k": "#ffffff",
      // "layers.12.shapes.1.it.0.it.1.c.k": "#ffdb45",
      // "layers.12.shapes.1.it.1.it.1.c.k": "#ffdb45",
      // "layers.12.shapes.2.it.2.c.k": "#aa6f07",
      // "layers.12.shapes.3.it.0.it.0.it.0.it.1.c.k": "#875c1e",
      // "layers.12.shapes.3.it.0.it.1.it.0.it.1.c.k": "#ffdb45",
      // "layers.12.shapes.3.it.1.it.0.it.1.c.k": "#875c1e",
      // "layers.12.shapes.3.it.2.it.0.it.1.c.k": "#ffdb45",
      // "layers.12.shapes.4.it.1.c.k": "#af7b12",
      // "layers.12.shapes.5.it.2.c.k": "#af7b12",
      // "layers.12.shapes.6.it.0.it.1.c.k": "#ffe9b3",
      // "layers.12.shapes.6.it.1.it.1.c.k": "#ffe9b3",
      // "layers.12.shapes.7.it.2.c.k": "#f7c759",
      // "layers.12.shapes.8.it.2.c.k": "#edb824",
    });
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(KeyLockAnimation);
