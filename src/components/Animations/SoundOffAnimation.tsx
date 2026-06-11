import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import SoundOff from '@/assets/animations/sound-off.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const SoundOffAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    return colouriseLottie(SoundOff, {
      // // mask_wave_2.Rectangle 1.Fill 1
      // 'layers.0.shapes.0.it.1.c.k': '#000000',
      // // wave_2 Outlines.Group 1.Fill 1
      // 'layers.1.shapes.0.it.2.c.k': '#9999a5',
      // // mask_wave.Rectangle 1.Fill 1
      // 'layers.2.shapes.0.it.1.c.k': '#000000',
      // // wave_1 Outlines.Group 1.Fill 1
      // 'layers.3.shapes.0.it.1.c.k': '#9999a5',
      // // bar Outlines.Group 1.Fill 1
      // 'layers.4.shapes.0.it.1.c.k': '#9999a5',
      // // mask_bar Outlines.Group 1.Fill 1
      // 'layers.5.shapes.0.it.1.c.k': '#000000',
      // // speaker Outlines.Group 1.Fill 1
      // 'layers.6.shapes.0.it.3.c.k': '#9999a5',
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(SoundOffAnimation);
