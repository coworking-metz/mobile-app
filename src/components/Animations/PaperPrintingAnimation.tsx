import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import PaperPrinting from '@/assets/animations/paper-printing.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const PaperPrintingAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(PaperPrinting, {
        // Shape Layer 1.Rectangle 1.Fill 1
        'layers.0.shapes.0.it.1.c.k': '#ebebeb',
        // Printed Paper.Group 11.Fill 1
        'layers.1.shapes.0.it.1.c.k': '#cccccc',
        // Printed Paper.Group 10.Fill 1
        'layers.1.shapes.1.it.1.c.k': '#cccccc',
        // Printed Paper.Group 9.Fill 1
        'layers.1.shapes.2.it.1.c.k': '#cccccc',
        // Printed Paper.Group 8.Fill 1
        'layers.1.shapes.3.it.1.c.k': '#cccccc',
        // Printed Paper.Group 7.Fill 1
        'layers.1.shapes.4.it.1.c.k': '#cccccc',
        // Printed Paper.Group 6.Fill 1
        'layers.1.shapes.5.it.1.c.k': '#cccccc',
        // Printed Paper.Group 5.Fill 1
        'layers.1.shapes.6.it.1.c.k': '#cccccc',
        // Printed Paper.Group 4.Fill 1
        'layers.1.shapes.7.it.1.c.k': '#cccccc',
        // Printed Paper.Group 3.Fill 1
        'layers.1.shapes.8.it.1.c.k': '#cccccc',
        // Printed Paper.Group 2.Fill 1
        'layers.1.shapes.9.it.1.c.k': '#cccccc',
        // Printed Paper.Group 1.Fill 1
        'layers.1.shapes.10.it.1.c.k': '#ebebeb',
        // Body.Group 1.Fill 1
        'layers.2.shapes.0.it.1.c.k': '#2c3439',
        // Body.Group 2.Fill 1
        'layers.2.shapes.1.it.1.c.k': '#b05d5f',
        // Body.Group 3.Fill 1
        'layers.2.shapes.2.it.1.c.k': '#5db088',
        // Body.Group 4.Fill 1
        'layers.2.shapes.3.it.1.c.k': '#2c3439',
        // Body.Group 5.Fill 1
        'layers.2.shapes.4.it.1.c.k': '#6c787f',
        // Body.Group 6.Fill 1
        'layers.2.shapes.5.it.1.c.k': '#2c3439',
        // Body.Group 7.Fill 1
        'layers.2.shapes.6.it.1.c.k': '#40494c',
        // Blank Paper.Group 1.Fill 1
        'layers.3.shapes.0.it.1.c.k': '#d1d1d1',
        // Blank Paper.Group 2.Fill 1
        'layers.3.shapes.1.it.1.c.k': '#ebebeb',
        // Upper Portion.Group 1.Fill 1
        'layers.4.shapes.0.it.1.c.k': '#161f25',
        // Upper Portion.Group 2.Fill 1
        'layers.4.shapes.1.it.1.c.k': '#2c3439',
      }),
    [],
  );

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(PaperPrintingAnimation);
