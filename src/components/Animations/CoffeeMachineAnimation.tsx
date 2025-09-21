import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import CoffeeMachine from '@/assets/animations/coffee-machine.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const CoffeeMachineAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(CoffeeMachine, {
        // SMOKE CIRCLE.Ellipse 1.Stroke 1
        'assets.0.layers.1.shapes.0.it.1.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Fill 1
        'assets.0.layers.1.shapes.0.it.2.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Stroke 1
        'assets.0.layers.2.shapes.0.it.1.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Fill 1
        'assets.0.layers.2.shapes.0.it.2.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Stroke 1
        'assets.0.layers.3.shapes.0.it.1.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Fill 1
        'assets.0.layers.3.shapes.0.it.2.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Stroke 1
        'assets.0.layers.4.shapes.0.it.1.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Fill 1
        'assets.0.layers.4.shapes.0.it.2.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Stroke 1
        'assets.0.layers.5.shapes.0.it.1.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Fill 1
        'assets.0.layers.5.shapes.0.it.2.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Stroke 1
        'assets.0.layers.6.shapes.0.it.1.c.k': '#ffffff',
        // SMOKE CIRCLE.Ellipse 1.Fill 1
        'assets.0.layers.6.shapes.0.it.2.c.k': '#ffffff',
        // CUP Outlines.Shape 1.Stroke 1
        'assets.0.layers.7.shapes.0.it.1.c.k': '#000000',
        // CUP Outlines.Shape 1.Fill 1
        'assets.0.layers.7.shapes.0.it.2.c.k': '#f9e7ea',
        // CUP Outlines.Group 1.Stroke 1
        'assets.0.layers.7.shapes.1.it.1.c.k': '#000000',
        // CUP Outlines.Group 2.Stroke 1
        'assets.0.layers.7.shapes.2.it.1.c.k': '#000000',
        // CUP Outlines.Group 3.Stroke 1
        'assets.0.layers.7.shapes.3.it.1.c.k': '#000000',
        // CUP Outlines.Group 3.Fill 1
        'assets.0.layers.7.shapes.3.it.2.c.k': '#ddd0e6',
        // CUP Outlines.Group 4.Stroke 1
        'assets.0.layers.7.shapes.4.it.1.c.k': '#000000',
        // CUP Outlines.Group 4.Fill 1
        'assets.0.layers.7.shapes.4.it.2.c.k': '#ddd0e6',
        // COFFEE COVER Outlines.Group 1.Fill 1
        'assets.0.layers.10.shapes.0.it.1.c.k': '#f9e7ea',
        // COFFEE COVER Outlines.Group 2.Stroke 1
        'assets.0.layers.10.shapes.1.it.1.c.k': '#000000',
        // COFFEE COVER Outlines.Group 2.Fill 1
        'assets.0.layers.10.shapes.1.it.2.c.k': '#80411e',
        // COFFEE CONTAINER Outlines.Group 1.Stroke 1
        'assets.0.layers.11.shapes.0.it.1.c.k': '#000000',
        // COFFEE CONTAINER Outlines.Group 2.Stroke 1
        'assets.0.layers.11.shapes.1.it.1.c.k': '#000000',
        // COFFEE CONTAINER Outlines.Group 2.Fill 1
        'assets.0.layers.11.shapes.1.it.2.c.k': '#f9e7ea',
        // SCREW Outlines.Group 1.Fill 1
        'assets.0.layers.12.shapes.0.it.1.c.k': '#000000',
        // SCREW Outlines.Group 2.Fill 1
        'assets.0.layers.12.shapes.1.it.1.c.k': '#000000',
        // CIRCLE2 Outlines.Group 1.Stroke 1
        'assets.0.layers.13.shapes.0.it.1.c.k': '#000000',
        // CIRCLE2 Outlines.Group 1.Fill 1
        'assets.0.layers.13.shapes.0.it.2.c.k.0.s': '#fa9fbb',
        // CIRCLE2 Outlines.Group 1.Fill 1
        'assets.0.layers.13.shapes.0.it.2.c.k.1.s': '#b9fa9f',
        // CIRCLE1 Outlines.Group 1.Stroke 1
        'assets.0.layers.14.shapes.0.it.1.c.k': '#000000',
        // CIRCLE1 Outlines.Group 1.Fill 1
        'assets.0.layers.14.shapes.0.it.2.c.k.0.s': '#fa9fbb',
        // CIRCLE1 Outlines.Group 1.Fill 1
        'assets.0.layers.14.shapes.0.it.2.c.k.1.s': '#facd9f',
        // CIRCLE3 Outlines.Group 1.Stroke 1
        'assets.0.layers.15.shapes.0.it.1.c.k': '#000000',
        // CIRCLE3 Outlines.Group 1.Fill 1
        'assets.0.layers.15.shapes.0.it.2.c.k.0.s': '#fa9fbb',
        // CIRCLE3 Outlines.Group 1.Fill 1
        'assets.0.layers.15.shapes.0.it.2.c.k.1.s': '#facfdc',
        // RIGHT PANEL Outlines.Group 1.Stroke 1
        'assets.0.layers.16.shapes.0.it.1.c.k': '#000000',
        // RIGHT PANEL Outlines.Group 1.Fill 1
        'assets.0.layers.16.shapes.0.it.2.c.k': '#fa9fbb',
        // RIGHT PANEL Outlines.Group 2.Stroke 1
        'assets.0.layers.16.shapes.1.it.1.c.k': '#000000',
        // RIGHT PANEL Outlines.Group 2.Fill 1
        'assets.0.layers.16.shapes.1.it.2.c.k': '#fa9fbb',
        // RIGHT PANEL Outlines.Group 3.Stroke 1
        'assets.0.layers.16.shapes.2.it.1.c.k': '#000000',
        // RIGHT PANEL Outlines.Group 3.Fill 1
        'assets.0.layers.16.shapes.2.it.2.c.k': '#fa9fbb',
        // GRAPHIC1 Outlines.Group 1.Stroke 1
        'assets.0.layers.17.shapes.0.it.1.c.k': '#000000',
        // TIMER Outlines.Shape 1.Stroke 1
        'assets.0.layers.18.shapes.0.it.1.c.k': '#000000',
        // TIMER Outlines.Shape 1.Fill 1
        'assets.0.layers.18.shapes.0.it.2.c.k': '#fa9fbb',
        // TIMER Outlines.Group 1.Stroke 1
        'assets.0.layers.18.shapes.2.it.1.c.k': '#000000',
        // TIMER Outlines.Group 1.Fill 1
        'assets.0.layers.18.shapes.2.it.2.c.k': '#fa9fbb',
        // HEAD BOARD Outlines.Group 1.Fill 1
        'assets.0.layers.19.shapes.0.it.1.c.k': '#37251b',
        // HEAD BOARD Outlines.Group 2.Stroke 1
        'assets.0.layers.19.shapes.1.it.1.c.k': '#000000',
        // HEAD BOARD Outlines.Group 2.Fill 1
        'assets.0.layers.19.shapes.1.it.2.c.k': '#80411e',
        // RIGHT NOZZLE HEAD Outlines.Group 1.Fill 1
        'assets.0.layers.20.shapes.0.it.1.c.k': '#f9e7ea',
        // RIGHT NOZZLE HEAD Outlines.Group 2.Stroke 1
        'assets.0.layers.20.shapes.1.it.1.c.k': '#000000',
        // RIGHT NOZZLE HEAD Outlines.Group 2.Fill 1
        'assets.0.layers.20.shapes.1.it.2.c.k': '#fa9fbb',
        // RIGHT NOZZLE Outlines.Group 1.Fill 1
        'assets.0.layers.21.shapes.0.it.1.c.k': '#f9e7ea',
        // RIGHT NOZZLE Outlines.Group 2.Fill 1
        'assets.0.layers.21.shapes.1.it.1.c.k': '#f9e7ea',
        // RIGHT NOZZLE Outlines.Group 3.Stroke 1
        'assets.0.layers.21.shapes.2.it.1.c.k': '#000000',
        // RIGHT NOZZLE Outlines.Group 3.Fill 1
        'assets.0.layers.21.shapes.2.it.2.c.k': '#fa9fbb',
        // BOARD SHADOW Outlines.Group 1.Fill 1
        'assets.0.layers.22.shapes.0.it.1.c.k': '#37251b',
        // BOARD Outlines.Group 1.Stroke 1
        'assets.0.layers.23.shapes.0.it.1.c.k': '#000000',
        // BOARD Outlines.Group 1.Fill 1
        'assets.0.layers.23.shapes.0.it.2.c.k': '#80411e',
        // HEAD BOARD SHADOW Outlines.Group 1.Fill 1
        'assets.0.layers.24.shapes.0.it.1.c.k': '#37251b',
        // HANDLE Outlines 4.Group 3.Stroke 1
        'assets.0.layers.25.shapes.0.it.1.c.k': '#000000',
        // HANDLE Outlines 4.Group 3.Fill 1
        'assets.0.layers.25.shapes.0.it.2.c.k': '#c6562d',
        // LEVER Outlines 6.Group 1.Stroke 1
        'assets.0.layers.26.shapes.0.it.1.c.k': '#000000',
        // LEVER Outlines 6.Group 1.Fill 1
        'assets.0.layers.26.shapes.0.it.2.c.k': '#fa9fbb',
        // HANDLE Outlines 3.Group 3.Stroke 1
        'assets.0.layers.27.shapes.0.it.1.c.k': '#000000',
        // HANDLE Outlines 3.Group 3.Fill 1
        'assets.0.layers.27.shapes.0.it.2.c.k': '#c6562d',
        // LEVER Outlines 5.Group 1.Stroke 1
        'assets.0.layers.28.shapes.0.it.1.c.k': '#000000',
        // LEVER Outlines 5.Group 1.Fill 1
        'assets.0.layers.28.shapes.0.it.2.c.k': '#fa9fbb',
        // LEVER Outlines 4.Group 1.Stroke 1
        'assets.0.layers.29.shapes.0.it.1.c.k': '#000000',
        // LEVER Outlines 4.Group 1.Fill 1
        'assets.0.layers.29.shapes.0.it.2.c.k': '#fa9fbb',
        // HANDLE Outlines 2.Group 3.Stroke 1
        'assets.0.layers.30.shapes.0.it.1.c.k': '#000000',
        // HANDLE Outlines 2.Group 3.Fill 1
        'assets.0.layers.30.shapes.0.it.2.c.k': '#c6562d',
        // LEVER Outlines 2.Group 1.Stroke 1
        'assets.0.layers.31.shapes.0.it.1.c.k': '#000000',
        // LEVER Outlines 2.Group 1.Fill 1
        'assets.0.layers.31.shapes.0.it.2.c.k': '#fa9fbb',
        // HANDLE Outlines.Group 3.Stroke 1
        'assets.0.layers.32.shapes.0.it.1.c.k': '#000000',
        // HANDLE Outlines.Group 3.Fill 1
        'assets.0.layers.32.shapes.0.it.2.c.k': '#c6562d',
        // LEVER Outlines 3.Group 1.Stroke 1
        'assets.0.layers.33.shapes.0.it.1.c.k': '#000000',
        // LEVER Outlines 3.Group 1.Fill 1
        'assets.0.layers.33.shapes.0.it.2.c.k': '#fa9fbb',
        // LEVER Outlines.Group 1.Stroke 1
        'assets.0.layers.34.shapes.0.it.1.c.k': '#000000',
        // LEVER Outlines.Group 1.Fill 1
        'assets.0.layers.34.shapes.0.it.2.c.k': '#fa9fbb',
        // NOZZLE1 Outlines.Group 1.Fill 1
        'assets.0.layers.35.shapes.0.it.1.c.k': '#f9e7ea',
        // NOZZLE1 Outlines.Group 2.Stroke 1
        'assets.0.layers.35.shapes.1.it.1.c.k': '#000000',
        // NOZZLE1 Outlines.Group 2.Fill 1
        'assets.0.layers.35.shapes.1.it.2.c.k': '#fa9fbb',
        // NOZZLE2 Outlines.Group 1.Fill 1
        'assets.0.layers.36.shapes.0.it.1.c.k': '#f9e7ea',
        // NOZZLE2 Outlines.Group 2.Stroke 1
        'assets.0.layers.36.shapes.1.it.1.c.k': '#000000',
        // NOZZLE2 Outlines.Group 2.Fill 1
        'assets.0.layers.36.shapes.1.it.2.c.k': '#fa9fbb',
        // NOZZLE3 Outlines.Group 1.Stroke 1
        'assets.0.layers.37.shapes.0.it.1.c.k': '#000000',
        // NOZZLE3 Outlines.Group 1.Fill 1
        'assets.0.layers.37.shapes.0.it.2.c.k': '#fa9fbb',
        // BASE Outlines.Group 1.Fill 1
        'assets.0.layers.38.shapes.0.it.1.c.k': '#37251b',
        // BASE Outlines.Group 2.Fill 1
        'assets.0.layers.38.shapes.1.it.1.c.k': '#f75487',
        // BASE Outlines.Group 3.Stroke 1
        'assets.0.layers.38.shapes.2.it.1.c.k': '#000000',
        // BASE Outlines.Group 3.Fill 1
        'assets.0.layers.38.shapes.2.it.2.c.k': '#80411e',
        // COFFEE 7.Shape 1.Stroke 1
        'assets.0.layers.39.shapes.0.it.1.c.k': '#522505',
        // COFFEE 6.Shape 1.Stroke 1
        'assets.0.layers.40.shapes.0.it.1.c.k': '#522505',
        // COFFEE 5.Shape 1.Stroke 1
        'assets.0.layers.41.shapes.0.it.1.c.k': '#522505',
        // COFFEE 4.Shape 1.Stroke 1
        'assets.0.layers.42.shapes.0.it.1.c.k': '#522505',
        // COFFEE 3.Shape 1.Stroke 1
        'assets.0.layers.43.shapes.0.it.1.c.k': '#522505',
        // COFFEE 2.Shape 1.Stroke 1
        'assets.0.layers.44.shapes.0.it.1.c.k': '#522505',
        // COFFEE.Shape 1.Stroke 1
        'assets.0.layers.45.shapes.0.it.1.c.k': '#522505',
        // BODY Outlines.Group 1.Fill 1
        'assets.0.layers.47.shapes.0.it.1.c.k': '#37251b',
        // BODY Outlines.Group 2.Stroke 1
        'assets.0.layers.47.shapes.1.it.1.c.k': '#000000',
        // BODY Outlines.Group 2.Fill 1
        'assets.0.layers.47.shapes.1.it.2.c.k': '#80411e',
        // LEFT THING 4.Group 1.Stroke 1
        'assets.0.layers.48.shapes.0.it.1.c.k': '#000000',
        // LEFT THING 4.Group 1.Fill 1
        'assets.0.layers.48.shapes.0.it.2.c.k': '#fa9fbb',
        // LEFT THING 4.Group 2.Stroke 1
        'assets.0.layers.48.shapes.1.it.1.c.k': '#000000',
        // LEFT THING 4.Group 2.Fill 1
        'assets.0.layers.48.shapes.1.it.2.c.k': '#fa9fbb',
        // LEFT THING 4.Group 3.Stroke 1
        'assets.0.layers.48.shapes.2.it.1.c.k': '#000000',
        // LEFT THING 4.Group 3.Fill 1
        'assets.0.layers.48.shapes.2.it.2.c.k': '#fa9fbb',
        // LEFT THING 3.Group 1.Stroke 1
        'assets.0.layers.49.shapes.0.it.1.c.k': '#000000',
        // LEFT THING 3.Group 1.Fill 1
        'assets.0.layers.49.shapes.0.it.2.c.k': '#fa9fbb',
        // LEFT THING 3.Group 2.Stroke 1
        'assets.0.layers.49.shapes.1.it.1.c.k': '#000000',
        // LEFT THING 3.Group 2.Fill 1
        'assets.0.layers.49.shapes.1.it.2.c.k': '#fa9fbb',
        // LEFT THING 3.Group 3.Stroke 1
        'assets.0.layers.49.shapes.2.it.1.c.k': '#000000',
        // LEFT THING 3.Group 3.Fill 1
        'assets.0.layers.49.shapes.2.it.2.c.k': '#fa9fbb',
        // LEFT THING 2.Group 1.Stroke 1
        'assets.0.layers.50.shapes.0.it.1.c.k': '#000000',
        // LEFT THING 2.Group 1.Fill 1
        'assets.0.layers.50.shapes.0.it.2.c.k': '#fa9fbb',
        // LEFT THING 2.Group 2.Stroke 1
        'assets.0.layers.50.shapes.1.it.1.c.k': '#000000',
        // LEFT THING 2.Group 2.Fill 1
        'assets.0.layers.50.shapes.1.it.2.c.k': '#fa9fbb',
        // LEFT THING 2.Group 3.Stroke 1
        'assets.0.layers.50.shapes.2.it.1.c.k': '#000000',
        // LEFT THING 2.Group 3.Fill 1
        'assets.0.layers.50.shapes.2.it.2.c.k': '#fa9fbb',
        // LEFT THING.Group 1.Stroke 1
        'assets.0.layers.51.shapes.0.it.1.c.k': '#000000',
        // LEFT THING.Group 1.Fill 1
        'assets.0.layers.51.shapes.0.it.2.c.k': '#fa9fbb',
        // LEFT THING.Group 2.Stroke 1
        'assets.0.layers.51.shapes.1.it.1.c.k': '#000000',
        // LEFT THING.Group 2.Fill 1
        'assets.0.layers.51.shapes.1.it.2.c.k': '#fa9fbb',
        // LEFT THING.Group 3.Stroke 1
        'assets.0.layers.51.shapes.2.it.1.c.k': '#000000',
        // LEFT THING.Group 3.Fill 1
        'assets.0.layers.51.shapes.2.it.2.c.k': '#fa9fbb',
        // COFFEE BOTTOM Outlines.Group 1.Stroke 1
        'assets.0.layers.52.shapes.0.it.1.c.k': '#000000',
        // COFFEE BOTTOM Outlines.Group 1.Fill 1
        'assets.0.layers.52.shapes.0.it.2.c.k': '#80411e',
        // BOTTOM Outlines.Group 1.Stroke 1
        'assets.0.layers.53.shapes.0.it.1.c.k': '#000000',
        // BOTTOM Outlines.Group 2.Stroke 1
        'assets.0.layers.53.shapes.1.it.1.c.k': '#000000',
        // BOTTOM Outlines.Group 2.Fill 1
        'assets.0.layers.53.shapes.1.it.2.c.k': '#c82451',
        // COFFE CUP COVER.Shape 3.Stroke 1
        'assets.0.layers.54.shapes.0.it.1.c.k': '#000000',
        // COFFE CUP COVER.Shape 3.Fill 1
        'assets.0.layers.54.shapes.0.it.2.c.k': '#854040',
        // COFFE CUP COVER.Rectangle 2.Stroke 1
        'assets.0.layers.54.shapes.1.it.1.c.k': '#000000',
        // COFFE CUP COVER.Rectangle 2.Fill 1
        'assets.0.layers.54.shapes.1.it.2.c.k': '#965151',
        // COFFE CUP.Shape 2.Stroke 1
        'assets.0.layers.55.shapes.0.it.1.c.k': '#000000',
        // COFFE CUP.Shape 2.Fill 1
        'assets.0.layers.55.shapes.0.it.2.c.k': '#ccf9ba',
        // COFFE CUP.Rectangle 3.Stroke 1
        'assets.0.layers.55.shapes.1.it.1.c.k': '#000000',
        // COFFE CUP.Rectangle 3.Fill 1
        'assets.0.layers.55.shapes.1.it.2.c.k': '#84b472',
        // COFFE CUP.Shape 1.Stroke 1
        'assets.0.layers.55.shapes.2.it.1.c.k': '#000000',
        // COFFE CUP.Shape 1.Fill 1
        'assets.0.layers.55.shapes.2.it.2.c.k': '#f9e7ea',
        // COFFE CUP.Rectangle 1.Stroke 1
        'assets.0.layers.55.shapes.3.it.1.c.k': '#000000',
        // COFFE CUP.Rectangle 1.Fill 1
        'assets.0.layers.55.shapes.3.it.2.c.k': '#d6aeae',
        // COFFEE PACKS.Rectangle 1.Stroke 1
        'assets.0.layers.56.shapes.0.it.1.c.k': '#000000',
        // COFFEE PACKS.Rectangle 1.Fill 1
        'assets.0.layers.56.shapes.0.it.2.c.k': '#d6aeae',
        // COFFEE PACKS.Shape 11.Stroke 1
        'assets.0.layers.56.shapes.1.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 11.Fill 1
        'assets.0.layers.56.shapes.1.it.2.c.k': '#d6aeae',
        // COFFEE PACKS.Shape 12.Stroke 1
        'assets.0.layers.56.shapes.2.it.1.c.k': '#f9e7ea',
        // COFFEE PACKS.Shape 10.Stroke 1
        'assets.0.layers.56.shapes.3.it.1.c.k': '#000000',
        // COFFEE PACKS.Ellipse 2.Stroke 1
        'assets.0.layers.56.shapes.4.it.1.c.k': '#000000',
        // COFFEE PACKS.Ellipse 2.Fill 1
        'assets.0.layers.56.shapes.4.it.2.c.k': '#814f3c',
        // COFFEE PACKS.Ellipse 1.Stroke 1
        'assets.0.layers.56.shapes.5.it.1.c.k': '#000000',
        // COFFEE PACKS.Ellipse 1.Fill 1
        'assets.0.layers.56.shapes.5.it.2.c.k': '#623321',
        // COFFEE PACKS.Shape 8.Stroke 1
        'assets.0.layers.56.shapes.6.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 8.Fill 1
        'assets.0.layers.56.shapes.6.it.2.c.k': '#f9e7ea',
        // COFFEE PACKS.Shape 7.Stroke 1
        'assets.0.layers.56.shapes.7.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 7.Fill 1
        'assets.0.layers.56.shapes.7.it.2.c.k': '#f9e7ea',
        // COFFEE PACKS.Shape 6.Stroke 1
        'assets.0.layers.56.shapes.8.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 6.Fill 1
        'assets.0.layers.56.shapes.8.it.2.c.k': '#f9e7ea',
        // COFFEE PACKS.Shape 5.Stroke 1
        'assets.0.layers.56.shapes.9.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 5.Fill 1
        'assets.0.layers.56.shapes.9.it.2.c.k': '#f9e7ea',
        // COFFEE PACKS.Shape 4.Stroke 1
        'assets.0.layers.56.shapes.10.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 4.Fill 1
        'assets.0.layers.56.shapes.10.it.2.c.k': '#f9e7ea',
        // COFFEE PACKS.Shape 3.Stroke 1
        'assets.0.layers.56.shapes.11.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 3.Fill 1
        'assets.0.layers.56.shapes.11.it.2.c.k': '#f9e7ea',
        // COFFEE PACKS.Shape 2.Stroke 1
        'assets.0.layers.56.shapes.12.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 2.Fill 1
        'assets.0.layers.56.shapes.12.it.2.c.k': '#f9e7ea',
        // COFFEE PACKS.Shape 1.Stroke 1
        'assets.0.layers.56.shapes.13.it.1.c.k': '#000000',
        // COFFEE PACKS.Shape 1.Fill 1
        'assets.0.layers.56.shapes.13.it.2.c.k': '#f9e7ea',
        // BASE 3.Shape 1.Stroke 1
        'assets.0.layers.57.shapes.0.it.1.c.k': '#000000',
        // BASE 2.Shape 1.Stroke 1
        'assets.0.layers.58.shapes.0.it.1.c.k': '#000000',
        // BASE.Shape 1.Stroke 1
        'assets.0.layers.59.shapes.0.it.1.c.k': '#000000',
      }),
    [],
  );

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(CoffeeMachineAnimation);
