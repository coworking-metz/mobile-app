import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import DishCooking from '@/assets/animations/dish-cooking.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const DishCookingAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (props, ref) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(DishCooking, {
        // tagoliveoil Outlines.Group 1.Fill 1
        'assets.0.layers.0.shapes.0.it.1.c.k': '#e5e989',
        // refection Outlines.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.1.c.k': '#6abc45',
        // oliveoil Outlines.Group 1.Fill 1
        'assets.0.layers.3.shapes.0.it.1.c.k': '#206c51',
        // oliveoil Outlines.Group 2.Fill 1
        'assets.0.layers.3.shapes.1.it.1.c.k': '#206c51',
        // oliveoil Outlines.Group 3.Fill 1
        'assets.0.layers.3.shapes.2.it.1.c.k': '#206c51',
        // Shape Layer 7.Shape 1.Stroke 1
        'assets.0.layers.4.shapes.0.it.1.c.k': '#6abc45',
        // Shape Layer 7.Shape 1.Fill 1
        'assets.0.layers.4.shapes.0.it.2.c.k': '#ff0000',
        // Shape Layer 6.Shape 1.Stroke 1
        'assets.0.layers.5.shapes.0.it.1.c.k': '#6abc45',
        // Shape Layer 6.Shape 1.Fill 1
        'assets.0.layers.5.shapes.0.it.2.c.k': '#ff0000',
        // Shape Layer 5.Shape 1.Stroke 1
        'assets.0.layers.6.shapes.0.it.1.c.k': '#6abc45',
        // Shape Layer 5.Shape 1.Fill 1
        'assets.0.layers.6.shapes.0.it.2.c.k': '#ff0000',
        // spice1 Outlines 2.Group 1.Fill 1
        'assets.0.layers.8.shapes.0.it.1.c.k': '#ffd687',
        // spice1 Outlines 2.Group 2.Fill 1
        'assets.0.layers.8.shapes.1.it.1.c.k': '#c78c62',
        // spice1 Outlines.Group 1.Fill 1
        'assets.0.layers.10.shapes.0.it.1.c.k': '#f58d59',
        // spice1 Outlines.Group 2.Fill 1
        'assets.0.layers.10.shapes.1.it.1.c.k': '#c78c62',
        // soupiere Outlines.Group 1.Fill 1
        'assets.0.layers.12.shapes.0.it.1.c.k': '#58357c',
        // soupiere Outlines.Group 2.Fill 1
        'assets.0.layers.12.shapes.1.it.1.c.k': '#58357c',
        // soupiere Outlines.Group 3.Fill 1
        'assets.0.layers.12.shapes.2.it.1.c.k': '#58357c',
        // flamme/kitchen3 Outlines 3.Group 1.Fill 1
        'assets.0.layers.14.shapes.0.it.1.c.k': '#ffc552',
        // flamme/kitchen3 Outlines 3.Group 2.Fill 1
        'assets.0.layers.14.shapes.1.it.1.c.k': '#f46363',
        // flamme/kitchen3 Outlines 2.Group 1.Fill 1
        'assets.0.layers.15.shapes.0.it.1.c.k': '#ffc552',
        // flamme/kitchen3 Outlines 2.Group 2.Fill 1
        'assets.0.layers.15.shapes.1.it.1.c.k': '#f46363',
        // flamme/kitchen3 Outlines.Group 1.Fill 1
        'assets.0.layers.16.shapes.0.it.1.c.k': '#ffc552',
        // flamme/kitchen3 Outlines.Group 2.Fill 1
        'assets.0.layers.16.shapes.1.it.1.c.k': '#f46363',
        // oil 22.Shape 1.Stroke 1
        'assets.0.layers.30.shapes.0.it.1.c.k': '#e5e989',
        // oil 22.Shape 1.Fill 1
        'assets.0.layers.30.shapes.0.it.2.c.k': '#ff0000',
        // oil 21.Shape 1.Stroke 1
        'assets.0.layers.31.shapes.0.it.1.c.k': '#e5e989',
        // oil 21.Shape 1.Fill 1
        'assets.0.layers.31.shapes.0.it.2.c.k': '#ff0000',
        // oil 20.Shape 1.Stroke 1
        'assets.0.layers.32.shapes.0.it.1.c.k': '#e5e989',
        // oil 20.Shape 1.Fill 1
        'assets.0.layers.32.shapes.0.it.2.c.k': '#ff0000',
        // oil 19.Shape 1.Stroke 1
        'assets.0.layers.33.shapes.0.it.1.c.k': '#e5e989',
        // oil 19.Shape 1.Fill 1
        'assets.0.layers.33.shapes.0.it.2.c.k': '#ff0000',
        // oil 18.Shape 1.Stroke 1
        'assets.0.layers.34.shapes.0.it.1.c.k': '#e5e989',
        // oil 18.Shape 1.Fill 1
        'assets.0.layers.34.shapes.0.it.2.c.k': '#ff0000',
        // oil 16.Shape 1.Stroke 1
        'assets.0.layers.35.shapes.0.it.1.c.k': '#e5e989',
        // oil 16.Shape 1.Fill 1
        'assets.0.layers.35.shapes.0.it.2.c.k': '#ff0000',
        // oil 13.Shape 1.Stroke 1
        'assets.0.layers.36.shapes.0.it.1.c.k': '#e5e989',
        // oil 13.Shape 1.Fill 1
        'assets.0.layers.36.shapes.0.it.2.c.k': '#ff0000',
        // oil 17.Shape 1.Stroke 1
        'assets.0.layers.37.shapes.0.it.1.c.k': '#e5e989',
        // oil 17.Shape 1.Fill 1
        'assets.0.layers.37.shapes.0.it.2.c.k': '#ff0000',
        // oil 12.Shape 1.Stroke 1
        'assets.0.layers.38.shapes.0.it.1.c.k': '#e5e989',
        // oil 12.Shape 1.Fill 1
        'assets.0.layers.38.shapes.0.it.2.c.k': '#ff0000',
        // oil 11.Shape 1.Stroke 1
        'assets.0.layers.39.shapes.0.it.1.c.k': '#e5e989',
        // oil 11.Shape 1.Fill 1
        'assets.0.layers.39.shapes.0.it.2.c.k': '#ff0000',
        // oil 15.Shape 1.Stroke 1
        'assets.0.layers.40.shapes.0.it.1.c.k': '#e5e989',
        // oil 15.Shape 1.Fill 1
        'assets.0.layers.40.shapes.0.it.2.c.k': '#ff0000',
        // oil 14.Shape 1.Stroke 1
        'assets.0.layers.41.shapes.0.it.1.c.k': '#e5e989',
        // oil 14.Shape 1.Fill 1
        'assets.0.layers.41.shapes.0.it.2.c.k': '#ff0000',
        // oil 10.Shape 1.Stroke 1
        'assets.0.layers.42.shapes.0.it.1.c.k': '#e5e989',
        // oil 10.Shape 1.Fill 1
        'assets.0.layers.42.shapes.0.it.2.c.k': '#ff0000',
        // oil 9.Shape 1.Stroke 1
        'assets.0.layers.43.shapes.0.it.1.c.k': '#e5e989',
        // oil 9.Shape 1.Fill 1
        'assets.0.layers.43.shapes.0.it.2.c.k': '#ff0000',
        // spat Outlines.Group 1.Fill 1
        'assets.0.layers.44.shapes.0.it.1.c.k': '#58357c',
        // spat Outlines.Group 2.Fill 1
        'assets.0.layers.44.shapes.1.it.1.c.k': '#ffffff',
        // spat Outlines.Group 3.Fill 1
        'assets.0.layers.44.shapes.2.it.1.c.k': '#ffffff',
        // spat Outlines.Group 4.Fill 1
        'assets.0.layers.44.shapes.3.it.1.c.k': '#ffffff',
        // spat Outlines.Group 5.Fill 1
        'assets.0.layers.44.shapes.4.it.1.c.k': '#cdcdcd',
        // Shape Layer 4.Ellipse 1.Stroke 1
        'assets.0.layers.47.shapes.0.it.1.c.k': '#58357c',
        // Shape Layer 3.Ellipse 1.Stroke 1
        'assets.0.layers.48.shapes.0.it.1.c.k': '#58357c',
        // Shape Layer 2.Ellipse 1.Stroke 1
        'assets.0.layers.49.shapes.0.it.1.c.k': '#58357c',
        // Shape Layer 1.Ellipse 1.Stroke 1
        'assets.0.layers.50.shapes.0.it.1.c.k': '#58357c',
        // Shape Layer 1.Ellipse 1.Stroke 1
        'assets.1.layers.0.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 1.Ellipse 1.Fill 1
        'assets.1.layers.0.shapes.0.it.2.c.k': '#e6e895',
        // Shape Layer 30.Ellipse 1.Stroke 1
        'assets.2.layers.0.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 30.Ellipse 1.Fill 1
        'assets.2.layers.0.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 29.Ellipse 1.Stroke 1
        'assets.2.layers.1.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 29.Ellipse 1.Fill 1
        'assets.2.layers.1.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 28.Ellipse 1.Stroke 1
        'assets.2.layers.2.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 28.Ellipse 1.Fill 1
        'assets.2.layers.2.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 31.Ellipse 1.Stroke 1
        'assets.2.layers.3.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 31.Ellipse 1.Fill 1
        'assets.2.layers.3.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 32.Ellipse 1.Stroke 1
        'assets.2.layers.4.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 32.Ellipse 1.Fill 1
        'assets.2.layers.4.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 27.Ellipse 1.Stroke 1
        'assets.2.layers.5.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 27.Ellipse 1.Fill 1
        'assets.2.layers.5.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 26.Ellipse 1.Stroke 1
        'assets.2.layers.6.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 26.Ellipse 1.Fill 1
        'assets.2.layers.6.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 25.Ellipse 1.Stroke 1
        'assets.2.layers.7.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 25.Ellipse 1.Fill 1
        'assets.2.layers.7.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 24.Ellipse 1.Stroke 1
        'assets.2.layers.8.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 24.Ellipse 1.Fill 1
        'assets.2.layers.8.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 23.Ellipse 1.Stroke 1
        'assets.2.layers.9.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 23.Ellipse 1.Fill 1
        'assets.2.layers.9.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 22.Ellipse 1.Stroke 1
        'assets.2.layers.10.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 22.Ellipse 1.Fill 1
        'assets.2.layers.10.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 21.Ellipse 1.Stroke 1
        'assets.2.layers.11.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 21.Ellipse 1.Fill 1
        'assets.2.layers.11.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 20.Ellipse 1.Stroke 1
        'assets.2.layers.12.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 20.Ellipse 1.Fill 1
        'assets.2.layers.12.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 19.Ellipse 1.Stroke 1
        'assets.2.layers.13.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 19.Ellipse 1.Fill 1
        'assets.2.layers.13.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 18.Ellipse 1.Stroke 1
        'assets.2.layers.14.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 18.Ellipse 1.Fill 1
        'assets.2.layers.14.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 17.Ellipse 1.Stroke 1
        'assets.2.layers.15.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 17.Ellipse 1.Fill 1
        'assets.2.layers.15.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 16.Ellipse 1.Stroke 1
        'assets.2.layers.16.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 16.Ellipse 1.Fill 1
        'assets.2.layers.16.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 15.Ellipse 1.Stroke 1
        'assets.2.layers.17.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 15.Ellipse 1.Fill 1
        'assets.2.layers.17.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 14.Ellipse 1.Stroke 1
        'assets.2.layers.18.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 14.Ellipse 1.Fill 1
        'assets.2.layers.18.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 13.Ellipse 1.Stroke 1
        'assets.2.layers.19.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 13.Ellipse 1.Fill 1
        'assets.2.layers.19.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 12.Ellipse 1.Stroke 1
        'assets.2.layers.20.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 12.Ellipse 1.Fill 1
        'assets.2.layers.20.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 11.Ellipse 1.Stroke 1
        'assets.2.layers.21.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 11.Ellipse 1.Fill 1
        'assets.2.layers.21.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 10.Ellipse 1.Stroke 1
        'assets.2.layers.22.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 10.Ellipse 1.Fill 1
        'assets.2.layers.22.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 9.Ellipse 1.Stroke 1
        'assets.2.layers.23.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 9.Ellipse 1.Fill 1
        'assets.2.layers.23.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 8.Ellipse 1.Stroke 1
        'assets.2.layers.24.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 8.Ellipse 1.Fill 1
        'assets.2.layers.24.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 7.Ellipse 1.Stroke 1
        'assets.2.layers.25.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 7.Ellipse 1.Fill 1
        'assets.2.layers.25.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 6.Ellipse 1.Stroke 1
        'assets.2.layers.26.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 6.Ellipse 1.Fill 1
        'assets.2.layers.26.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 5.Ellipse 1.Stroke 1
        'assets.2.layers.27.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 5.Ellipse 1.Fill 1
        'assets.2.layers.27.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 4.Ellipse 1.Stroke 1
        'assets.2.layers.28.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 4.Ellipse 1.Fill 1
        'assets.2.layers.28.shapes.0.it.2.c.k': '#f46363',
        // Shape Layer 3.Ellipse 1.Stroke 1
        'assets.2.layers.29.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 3.Ellipse 1.Fill 1
        'assets.2.layers.29.shapes.0.it.2.c.k': '#f46363',
        // cuiller3 Outlines.Group 1.Fill 1
        'assets.3.layers.1.shapes.0.it.1.c.k': '#c98d63',
        // cuiller3 Outlines.Group 2.Fill 1
        'assets.3.layers.1.shapes.1.it.1.c.k': '#c98d63',
        // pepper 2 Outlines.Group 1.Fill 1
        'assets.3.layers.4.shapes.0.it.3.c.k': '#a87148',
        // pepper 2 Outlines.Group 2.Fill 1
        'assets.3.layers.4.shapes.1.it.3.c.k': '#b6b6b6',
        // pepper 2 Outlines.Group 3.Fill 1
        'assets.3.layers.4.shapes.2.it.1.c.k': '#e3e4e3',
        // pepper 2 Outlines.Group 4.Fill 1
        'assets.3.layers.4.shapes.3.it.1.c.k': '#c98d63',
        // pancook Outlines.Group 1.Fill 1
        'assets.3.layers.5.shapes.0.it.3.c.k': '#ededee',
        // pancook Outlines.Group 2.Fill 1
        'assets.3.layers.5.shapes.1.it.3.c.k': '#ededee',
        // pancook Outlines.Group 3.Fill 1
        'assets.3.layers.5.shapes.2.it.1.c.k': '#2b3841',
        // pancook Outlines.Group 4.Fill 1
        'assets.3.layers.5.shapes.3.it.1.c.k': '#2b3841',
        // pancook Outlines.Group 5.Fill 1
        'assets.3.layers.5.shapes.4.it.1.c.k': '#cecece',
        // Shape Layer 21.Ellipse 1.Stroke 1
        'assets.3.layers.8.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 21.Ellipse 1.Fill 1
        'assets.3.layers.8.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 20.Ellipse 1.Stroke 1
        'assets.3.layers.9.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 20.Ellipse 1.Fill 1
        'assets.3.layers.9.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 36.Ellipse 1.Stroke 1
        'assets.3.layers.10.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 36.Ellipse 1.Fill 1
        'assets.3.layers.10.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 19.Ellipse 1.Stroke 1
        'assets.3.layers.11.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 19.Ellipse 1.Fill 1
        'assets.3.layers.11.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 6.Ellipse 1.Stroke 1
        'assets.3.layers.12.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 6.Ellipse 1.Fill 1
        'assets.3.layers.12.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 5.Ellipse 1.Stroke 1
        'assets.3.layers.13.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 5.Ellipse 1.Fill 1
        'assets.3.layers.13.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 4.Ellipse 1.Stroke 1
        'assets.3.layers.14.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 4.Ellipse 1.Fill 1
        'assets.3.layers.14.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 42.Ellipse 1.Stroke 1
        'assets.3.layers.15.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 42.Ellipse 1.Fill 1
        'assets.3.layers.15.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 41.Ellipse 1.Stroke 1
        'assets.3.layers.16.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 41.Ellipse 1.Fill 1
        'assets.3.layers.16.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 40.Ellipse 1.Stroke 1
        'assets.3.layers.17.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 40.Ellipse 1.Fill 1
        'assets.3.layers.17.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 39.Ellipse 1.Stroke 1
        'assets.3.layers.18.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 39.Ellipse 1.Fill 1
        'assets.3.layers.18.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 38.Ellipse 1.Stroke 1
        'assets.3.layers.19.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 38.Ellipse 1.Fill 1
        'assets.3.layers.19.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 37.Ellipse 1.Stroke 1
        'assets.3.layers.20.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 37.Ellipse 1.Fill 1
        'assets.3.layers.20.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 3.Ellipse 1.Stroke 1
        'assets.3.layers.21.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 3.Ellipse 1.Fill 1
        'assets.3.layers.21.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 2.Ellipse 1.Stroke 1
        'assets.3.layers.22.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 2.Ellipse 1.Fill 1
        'assets.3.layers.22.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 1.Ellipse 1.Stroke 1
        'assets.3.layers.23.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 1.Ellipse 1.Fill 1
        'assets.3.layers.23.shapes.0.it.2.c.k': '#a87148',
        // Shape Layer 35.Ellipse 1.Stroke 1
        'assets.3.layers.24.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 35.Ellipse 1.Fill 1
        'assets.3.layers.24.shapes.0.it.2.c.k': '#c98d63',
        // Shape Layer 34.Ellipse 1.Stroke 1
        'assets.3.layers.25.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 34.Ellipse 1.Fill 1
        'assets.3.layers.25.shapes.0.it.2.c.k': '#c98d63',
        // Shape Layer 33.Ellipse 1.Stroke 1
        'assets.3.layers.26.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 33.Ellipse 1.Fill 1
        'assets.3.layers.26.shapes.0.it.2.c.k': '#c98d63',
        // Shape Layer 32.Ellipse 1.Stroke 1
        'assets.3.layers.27.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 32.Ellipse 1.Fill 1
        'assets.3.layers.27.shapes.0.it.2.c.k': '#c98d63',
        // Shape Layer 31.Ellipse 1.Stroke 1
        'assets.3.layers.28.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 31.Ellipse 1.Fill 1
        'assets.3.layers.28.shapes.0.it.2.c.k': '#c98d63',
        // Shape Layer 30.Ellipse 1.Stroke 1
        'assets.3.layers.29.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 30.Ellipse 1.Fill 1
        'assets.3.layers.29.shapes.0.it.2.c.k': '#c98d63',
        // Shape Layer 29.Shape 1.Stroke 1
        'assets.3.layers.30.shapes.0.it.1.c.k': '#c98d63',
        // Shape Layer 29.Shape 1.Fill 1
        'assets.3.layers.30.shapes.0.it.2.c.k': '#ff0000',
        // Shape Layer 28.Shape 1.Stroke 1
        'assets.3.layers.31.shapes.0.it.1.c.k': '#c98d63',
        // Shape Layer 28.Shape 1.Fill 1
        'assets.3.layers.31.shapes.0.it.2.c.k': '#ff0000',
        // cuiller3 Outlines 2.Group 1.Fill 1
        'assets.3.layers.33.shapes.0.it.1.c.k': '#c98d63',
        // cuiller3 Outlines 2.Group 2.Fill 1
        'assets.3.layers.33.shapes.1.it.1.c.k': '#c98d63',
        // Shape Layer 58.Ellipse 1.Stroke 1
        'assets.4.layers.0.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 58.Ellipse 1.Fill 1
        'assets.4.layers.0.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 51.Ellipse 1.Stroke 1
        'assets.4.layers.1.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 51.Ellipse 1.Fill 1
        'assets.4.layers.1.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 50.Ellipse 1.Stroke 1
        'assets.4.layers.2.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 50.Ellipse 1.Fill 1
        'assets.4.layers.2.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 59.Ellipse 1.Stroke 1
        'assets.4.layers.3.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 59.Ellipse 1.Fill 1
        'assets.4.layers.3.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 49.Ellipse 1.Stroke 1
        'assets.4.layers.4.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 49.Ellipse 1.Fill 1
        'assets.4.layers.4.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 48.Ellipse 1.Stroke 1
        'assets.4.layers.5.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 48.Ellipse 1.Fill 1
        'assets.4.layers.5.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 47.Ellipse 1.Stroke 1
        'assets.4.layers.6.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 47.Ellipse 1.Fill 1
        'assets.4.layers.6.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 52.Ellipse 1.Stroke 1
        'assets.4.layers.7.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 52.Ellipse 1.Fill 1
        'assets.4.layers.7.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 46.Ellipse 1.Stroke 1
        'assets.4.layers.8.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 46.Ellipse 1.Fill 1
        'assets.4.layers.8.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 45.Ellipse 1.Stroke 1
        'assets.4.layers.9.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 45.Ellipse 1.Fill 1
        'assets.4.layers.9.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 44.Ellipse 1.Stroke 1
        'assets.4.layers.10.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 44.Ellipse 1.Fill 1
        'assets.4.layers.10.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 43.Ellipse 1.Stroke 1
        'assets.4.layers.11.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 43.Ellipse 1.Fill 1
        'assets.4.layers.11.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 42.Ellipse 1.Stroke 1
        'assets.4.layers.12.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 42.Ellipse 1.Fill 1
        'assets.4.layers.12.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 41.Ellipse 1.Stroke 1
        'assets.4.layers.13.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 41.Ellipse 1.Fill 1
        'assets.4.layers.13.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 40.Ellipse 1.Stroke 1
        'assets.4.layers.14.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 40.Ellipse 1.Fill 1
        'assets.4.layers.14.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 39.Ellipse 1.Stroke 1
        'assets.4.layers.15.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 39.Ellipse 1.Fill 1
        'assets.4.layers.15.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 34.Ellipse 1.Stroke 1
        'assets.4.layers.16.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 34.Ellipse 1.Fill 1
        'assets.4.layers.16.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 36.Ellipse 1.Stroke 1
        'assets.4.layers.17.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 36.Ellipse 1.Fill 1
        'assets.4.layers.17.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 33.Ellipse 1.Stroke 1
        'assets.4.layers.18.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 33.Ellipse 1.Fill 1
        'assets.4.layers.18.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 37.Ellipse 1.Stroke 1
        'assets.4.layers.19.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 37.Ellipse 1.Fill 1
        'assets.4.layers.19.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 32.Ellipse 1.Stroke 1
        'assets.4.layers.20.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 32.Ellipse 1.Fill 1
        'assets.4.layers.20.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 38.Ellipse 1.Stroke 1
        'assets.4.layers.21.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 38.Ellipse 1.Fill 1
        'assets.4.layers.21.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 35.Ellipse 1.Stroke 1
        'assets.4.layers.22.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 35.Ellipse 1.Fill 1
        'assets.4.layers.22.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 31.Ellipse 1.Stroke 1
        'assets.4.layers.23.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 31.Ellipse 1.Fill 1
        'assets.4.layers.23.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 30.Ellipse 1.Stroke 1
        'assets.4.layers.24.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 30.Ellipse 1.Fill 1
        'assets.4.layers.24.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 29.Ellipse 1.Stroke 1
        'assets.4.layers.25.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 29.Ellipse 1.Fill 1
        'assets.4.layers.25.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 28.Ellipse 1.Stroke 1
        'assets.4.layers.26.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 28.Ellipse 1.Fill 1
        'assets.4.layers.26.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 27.Ellipse 1.Stroke 1
        'assets.4.layers.27.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 27.Ellipse 1.Fill 1
        'assets.4.layers.27.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 26.Ellipse 1.Stroke 1
        'assets.4.layers.28.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 26.Ellipse 1.Fill 1
        'assets.4.layers.28.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 25.Ellipse 1.Stroke 1
        'assets.4.layers.29.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 25.Ellipse 1.Fill 1
        'assets.4.layers.29.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 24.Ellipse 1.Stroke 1
        'assets.4.layers.30.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 24.Ellipse 1.Fill 1
        'assets.4.layers.30.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 22.Ellipse 1.Stroke 1
        'assets.4.layers.31.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 22.Ellipse 1.Fill 1
        'assets.4.layers.31.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 21.Ellipse 1.Stroke 1
        'assets.4.layers.32.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 21.Ellipse 1.Fill 1
        'assets.4.layers.32.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 20.Ellipse 1.Stroke 1
        'assets.4.layers.33.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 20.Ellipse 1.Fill 1
        'assets.4.layers.33.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 19.Ellipse 1.Stroke 1
        'assets.4.layers.34.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 19.Ellipse 1.Fill 1
        'assets.4.layers.34.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 23.Ellipse 1.Stroke 1
        'assets.4.layers.35.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 23.Ellipse 1.Fill 1
        'assets.4.layers.35.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 18.Ellipse 1.Stroke 1
        'assets.4.layers.36.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 18.Ellipse 1.Fill 1
        'assets.4.layers.36.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 15.Ellipse 1.Stroke 1
        'assets.4.layers.37.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 15.Ellipse 1.Fill 1
        'assets.4.layers.37.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 17.Ellipse 1.Stroke 1
        'assets.4.layers.38.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 17.Ellipse 1.Fill 1
        'assets.4.layers.38.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 14.Ellipse 1.Stroke 1
        'assets.4.layers.39.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 14.Ellipse 1.Fill 1
        'assets.4.layers.39.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 16.Ellipse 1.Stroke 1
        'assets.4.layers.40.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 16.Ellipse 1.Fill 1
        'assets.4.layers.40.shapes.0.it.2.c.k': '#feedb5',
        // Shape Layer 13.Ellipse 1.Stroke 1
        'assets.4.layers.41.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 13.Ellipse 1.Fill 1
        'assets.4.layers.41.shapes.0.it.2.c.k': '#feedb5',
        // container02/kitchen1 Outlines.liqui.Fill 1
        'assets.5.layers.1.shapes.0.it.1.c.k': '#f99999',
        // container02/kitchen1 Outlines.Group 2.Fill 1
        'assets.5.layers.1.shapes.1.it.1.c.k': '#fbc5c5',
        // bowlrose/kitchencooking Outlines.Group 1.Fill 1
        'assets.5.layers.2.shapes.0.it.1.c.k': '#f59798',
        // bowlrose/kitchencooking Outlines.Group 2.Fill 1
        'assets.5.layers.2.shapes.1.it.1.c.k': '#f59798',
        // bowlrose/kitchencooking Outlines.Group 1.Fill 1
        'assets.5.layers.3.shapes.0.it.1.c.k': '#f59798',
        // bowlrose/kitchencooking Outlines.Group 2.Fill 1
        'assets.5.layers.3.shapes.1.it.1.c.k': '#f59798',
        // Shape Layer 14.Shape 1.Stroke 1
        'assets.5.layers.4.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 14.Shape 1.Fill 1
        'assets.5.layers.4.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 11.Shape 1.Stroke 1
        'assets.5.layers.5.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 11.Shape 1.Fill 1
        'assets.5.layers.5.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 9.Shape 1.Stroke 1
        'assets.5.layers.6.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 9.Shape 1.Fill 1
        'assets.5.layers.6.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 8.Shape 1.Stroke 1
        'assets.5.layers.7.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 8.Shape 1.Fill 1
        'assets.5.layers.7.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 6.Shape 1.Stroke 1
        'assets.5.layers.8.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 6.Shape 1.Fill 1
        'assets.5.layers.8.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 4.Shape 1.Stroke 1
        'assets.5.layers.9.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 4.Shape 1.Fill 1
        'assets.5.layers.9.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 23.Shape 1.Stroke 1
        'assets.5.layers.10.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 23.Shape 1.Fill 1
        'assets.5.layers.10.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 22.Shape 1.Stroke 1
        'assets.5.layers.11.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 22.Shape 1.Fill 1
        'assets.5.layers.11.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 16.Shape 1.Stroke 1
        'assets.5.layers.12.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 16.Shape 1.Fill 1
        'assets.5.layers.12.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 15.Shape 1.Stroke 1
        'assets.5.layers.13.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 15.Shape 1.Fill 1
        'assets.5.layers.13.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 10.Shape 1.Stroke 1
        'assets.5.layers.14.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 10.Shape 1.Fill 1
        'assets.5.layers.14.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 7.Shape 1.Stroke 1
        'assets.5.layers.15.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 7.Shape 1.Fill 1
        'assets.5.layers.15.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 5.Shape 1.Stroke 1
        'assets.5.layers.16.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 5.Shape 1.Fill 1
        'assets.5.layers.16.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 3.Shape 1.Stroke 1
        'assets.5.layers.17.shapes.0.it.1.c.k': '#ffffff',
        // Shape Layer 3.Shape 1.Fill 1
        'assets.5.layers.17.shapes.0.it.2.c.k': '#ffd687',
        // Shape Layer 24.Fill 1
        'assets.5.layers.19.shapes.1.c.k': '#ffd687',
        // Shape Layer 1.Fill 1
        'assets.5.layers.20.shapes.1.c.k': '#ffd687',
        // wip/kitchen1 Outlines.Group 1.Fill 1
        'assets.5.layers.21.shapes.0.it.1.c.k': '#58347b',
        // wip/kitchen1 Outlines.Group 2.Fill 1
        'assets.5.layers.21.shapes.1.it.1.c.k': '#cecece',
        // wip/kitchen1 Outlines.Group 3.Fill 1
        'assets.5.layers.21.shapes.2.it.1.c.k': '#cecece',
        // wip/kitchen1 Outlines.Group 4.Fill 1
        'assets.5.layers.21.shapes.3.it.3.c.k': '#cecece',
        // Shape Layer 20.Ellipse 1.Stroke 1
        'assets.5.layers.23.shapes.0.it.1.c.k': '#58347b',
        // Shape Layer 21.Ellipse 1.Stroke 1
        'assets.5.layers.24.shapes.0.it.1.c.k': '#fdc456',
        // Shape Layer 19.Ellipse 1.Stroke 1
        'assets.5.layers.25.shapes.0.it.1.c.k': '#cecece',
        // star/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.0.shapes.0.it.1.c.k': '#863576',
        // clire/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.1.shapes.0.it.1.c.k': '#ffd687',
        // clire/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.2.shapes.0.it.1.c.k': '#ffd687',
        // circle/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.3.shapes.0.it.1.c.k': '#f06363',
        // star/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.4.shapes.0.it.1.c.k': '#863576',
        // star/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.5.shapes.0.it.1.c.k': '#863576',
        // clire/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.6.shapes.0.it.1.c.k': '#ffd687',
        // clire/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.7.shapes.0.it.1.c.k': '#ffd687',
        // circle/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.8.shapes.0.it.1.c.k': '#f06363',
        // star/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.9.shapes.0.it.1.c.k': '#863576',
        // star/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.10.shapes.0.it.1.c.k': '#863576',
        // clire/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.11.shapes.0.it.1.c.k': '#ffd687',
        // clire/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.12.shapes.0.it.1.c.k': '#ffd687',
        // circle/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.13.shapes.0.it.1.c.k': '#f06363',
        // star/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.14.shapes.0.it.1.c.k': '#863576',
        // star/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.15.shapes.0.it.1.c.k': '#863576',
        // clire/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.16.shapes.0.it.1.c.k': '#ffd687',
        // clire/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.17.shapes.0.it.1.c.k': '#ffd687',
        // circle/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.18.shapes.0.it.1.c.k': '#f06363',
        // star/kitchencooking Outlines.Group 1.Fill 1
        'assets.6.layers.19.shapes.0.it.1.c.k': '#863576',
      }),
    [],
  );

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(DishCookingAnimation);
