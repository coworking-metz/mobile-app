import LottieView, { type LottieViewProps } from 'lottie-react-native';
import React, { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import KeysPair from '@/assets/animations/keys-pair.json';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const KeysPairAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  { ...props },
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    return colouriseLottie(KeysPair, {});
  }, [colorScheme]);

  return <LottieView ref={ref} autoPlay loop={false} {...props} source={colorizedSource} />;
};

export default forwardRef(KeysPairAnimation);
