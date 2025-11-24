import PizzaIngrediants from '@/assets/animations/pizza-ingrediants.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';
import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const PizzaIngrediantsAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(PizzaIngrediants, {
        // Layer 4 Outlines.Group 1.Fill 1
        'assets.0.layers.0.shapes.0.it.2.c.k': '#e2cf7f',
        // Layer 4 Outlines.Group 2.Fill 1
        'assets.0.layers.0.shapes.1.it.2.c.k': '#443e26',
        // Layer 4 Outlines.Group 3.Fill 1
        'assets.0.layers.0.shapes.2.it.2.c.k': '#595234',
        // Layer 4 Outlines.Group 4.Fill 1
        'assets.0.layers.0.shapes.3.it.2.c.k': '#b5a250',
        // Layer 4 Outlines.Group 5.Fill 1
        'assets.0.layers.0.shapes.4.it.2.c.k': '#8e8149',
        // Layer 12 Outlines.Group 1.Fill 1
        'assets.0.layers.1.shapes.0.it.2.c.k': '#e2cf7f',
        // Layer 12 Outlines.Group 2.Fill 1
        'assets.0.layers.1.shapes.1.it.2.c.k': '#443e26',
        // Layer 12 Outlines.Group 3.Fill 1
        'assets.0.layers.1.shapes.2.it.2.c.k': '#595234',
        // Layer 12 Outlines.Group 4.Fill 1
        'assets.0.layers.1.shapes.3.it.2.c.k': '#b5a250',
        // Layer 12 Outlines.Group 5.Fill 1
        'assets.0.layers.1.shapes.4.it.2.c.k': '#8e8149',
        // Layer 13 Outlines.Group 1.Fill 1
        'assets.0.layers.2.shapes.0.it.2.c.k': '#443e26',
        // Layer 13 Outlines.Group 2.Fill 1
        'assets.0.layers.2.shapes.1.it.2.c.k': '#595234',
        // Layer 13 Outlines.Group 3.Fill 1
        'assets.0.layers.2.shapes.2.it.2.c.k': '#e2cf7f',
        // Layer 13 Outlines.Group 4.Fill 1
        'assets.0.layers.2.shapes.3.it.2.c.k': '#e2cf7f',
        // Layer 13 Outlines.Group 5.Fill 1
        'assets.0.layers.2.shapes.4.it.2.c.k': '#b5a250',
        // Layer 13 Outlines.Group 6.Fill 1
        'assets.0.layers.2.shapes.5.it.2.c.k': '#8e8149',
        // Mate 2.Group 1.Fill 1
        'assets.1.layers.0.shapes.0.it.2.c.k': '#e02242',
        // Layer 6 Outlines.Group 1.Fill 1
        'assets.1.layers.1.shapes.0.it.2.c.k': '#ffefde',
        // Layer 6 Outlines.Group 2.Fill 1
        'assets.1.layers.1.shapes.1.it.2.c.k': '#ffefde',
        // Mate.Group 1.Fill 1
        'assets.1.layers.2.shapes.0.it.2.c.k': '#e02242',
        // Layer 7 Outlines.Group 1.Fill 1
        'assets.1.layers.3.shapes.0.it.2.c.k': '#a01c38',
        // Layer 7 Outlines.Group 2.Fill 1
        'assets.1.layers.3.shapes.1.it.2.c.k': '#a01c38',
        // Layer 7 Outlines.Group 3.Fill 1
        'assets.1.layers.3.shapes.2.it.2.c.k': '#a01c38',
        // Layer 7 Outlines.Group 4.Fill 1
        'assets.1.layers.3.shapes.3.it.4.c.k': '#a01c38',
        // Layer 7 Outlines.Group 5.Fill 1
        'assets.1.layers.3.shapes.4.it.2.c.k': '#a01c38',
        // Layer 7 Outlines.Group 6.Fill 1
        'assets.1.layers.3.shapes.5.it.4.c.k': '#a01c38',
        // Layer 7 Outlines.Group 7.Fill 1
        'assets.1.layers.3.shapes.6.it.2.c.k': '#a01c38',
        // Layer 7 Outlines.Group 8.Fill 1
        'assets.1.layers.3.shapes.7.it.4.c.k': '#a01c38',
        // Layer 7 Outlines.Group 9.Fill 1
        'assets.1.layers.3.shapes.8.it.2.c.k': '#a01c38',
        // Layer 7 Outlines.Group 10.Fill 1
        'assets.1.layers.3.shapes.9.it.4.c.k': '#a01c38',
        // Layer 7 Outlines.Group 11.Fill 1
        'assets.1.layers.3.shapes.10.it.2.c.k': '#a01c38',
        // Layer 7 Outlines.Group 12.Fill 1
        'assets.1.layers.3.shapes.11.it.2.c.k': '#ffefde',
        // mate 2.Group 5.Fill 1
        'assets.1.layers.4.shapes.0.it.2.c.k': '#fce1be',
        // Layer 8 Outlines 5.Group 3.Fill 1
        'assets.1.layers.5.shapes.0.it.2.c.k': '#ffefde',
        // Layer 8 Outlines 5.Group 4.Fill 1
        'assets.1.layers.5.shapes.1.it.2.c.k': '#ffefde',
        // Layer 8 Outlines 7.Group 7.Fill 1
        'assets.1.layers.6.shapes.0.it.2.c.k': '#c61a40',
        // Layer 8 Outlines 4.Group 5.Fill 1
        'assets.1.layers.7.shapes.0.it.2.c.k': '#fce1be',
        // Layer 8 Outlines 6.Group 1.Fill 1
        'assets.1.layers.8.shapes.0.it.2.c.k': '#e02242',
        // Layer 8 Outlines 2.Group 6.Fill 1
        'assets.1.layers.9.shapes.0.it.2.c.k': '#d3b99c',
        // Layer 8 Outlines.Group 8.Fill 1
        'assets.1.layers.10.shapes.0.it.2.c.k': '#edc59a',
        // Layer 8 Outlines 3.Group 2.Fill 1
        'assets.1.layers.11.shapes.0.it.2.c.k': '#bc193c',
        // Layer 8 Outlines 3.Group 9.Fill 1
        'assets.1.layers.11.shapes.1.it.2.c.k': '#fce1be',
        // Mate 2.Group 1.Fill 1
        'assets.2.layers.0.shapes.0.it.2.c.k': '#6d555e',
        // Layer 16 Outlines.Group 1.Fill 1
        'assets.2.layers.1.shapes.0.it.2.c.k': '#ffffff',
        // Layer 16 Outlines.Group 2.Fill 1
        'assets.2.layers.1.shapes.1.it.2.c.k': '#ffffff',
        // Mate.Group 1.Fill 1
        'assets.2.layers.2.shapes.0.it.2.c.k': '#6d555e',
        // Label.Group 1.Fill 1
        'assets.2.layers.3.shapes.0.it.2.c.k': '#ff2c55',
        // Label.Group 2.Fill 1
        'assets.2.layers.3.shapes.1.it.2.c.k': '#ff2c55',
        // Label.Group 3.Fill 1
        'assets.2.layers.3.shapes.2.it.2.c.k': '#ff2c55',
        // Label.Group 4.Fill 1
        'assets.2.layers.3.shapes.3.it.2.c.k': '#ff2c55',
        // Label.Group 5.Fill 1
        'assets.2.layers.3.shapes.4.it.2.c.k': '#ff2c55',
        // Label.Group 6.Fill 1
        'assets.2.layers.3.shapes.5.it.2.c.k': '#ff2c55',
        // Label.Group 7.Fill 1
        'assets.2.layers.3.shapes.6.it.2.c.k': '#ff2c55',
        // Label.Group 8.Fill 1
        'assets.2.layers.3.shapes.7.it.2.c.k': '#ff2c55',
        // Label.Group 9.Fill 1
        'assets.2.layers.3.shapes.8.it.0.c.k': '#ff2c55',
        // Label.Group 10.Fill 1
        'assets.2.layers.3.shapes.9.it.0.c.k': '#ff2c55',
        // Label.Group 11.Fill 1
        'assets.2.layers.3.shapes.10.it.2.c.k': '#ff2c55',
        // Label.Group 12.Fill 1
        'assets.2.layers.3.shapes.11.it.2.c.k': '#ff2c55',
        // Label.Group 13.Fill 1
        'assets.2.layers.3.shapes.12.it.2.c.k': '#ff2c55',
        // Label.Group 14.Fill 1
        'assets.2.layers.3.shapes.13.it.2.c.k': '#ff2c55',
        // Label.Group 15.Fill 1
        'assets.2.layers.3.shapes.14.it.2.c.k': '#f7f0d2',
        // Label.Group 16.Fill 1
        'assets.2.layers.3.shapes.15.it.1.c.k': '#dbd4b6',
        // Layer 17 Outlines.Group 1.Fill 1
        'assets.2.layers.4.shapes.0.it.2.c.k': '#7f626e',
        // Layer 18 Outlines.Group 1.Fill 1
        'assets.2.layers.5.shapes.0.it.2.c.k': '#7f626e',
        // Layer 19 Outlines.Group 1.Fill 1
        'assets.2.layers.6.shapes.0.it.2.c.k': '#d1b6c3',
        // Layer 20 Outlines.Group 1.Fill 1
        'assets.2.layers.7.shapes.0.it.2.c.k': '#d1b6c3',
        // Layer 21 Outlines 2.Group 3.Fill 1
        'assets.2.layers.8.shapes.0.it.2.c.k': '#f7f0d2',
        // Layer 21 Outlines.Group 1.Fill 1
        'assets.2.layers.9.shapes.0.it.2.c.k': '#5b454e',
        // Layer 21 Outlines.Group 2.Fill 1
        'assets.2.layers.9.shapes.1.it.2.c.k': '#6d555e',
        // Layer 21 Outlines.Group 4.Fill 1
        'assets.2.layers.9.shapes.2.it.2.c.k': '#dbd4b6',
        // Layer 21 Outlines.Group 5.Fill 1
        'assets.2.layers.9.shapes.3.it.2.c.k': '#f74d76',
        // Layer 22 Outlines.Group 1.Fill 1
        'assets.2.layers.10.shapes.0.it.2.c.k': '#49363f',
        // Layer 22 Outlines.Group 2.Fill 1
        'assets.2.layers.10.shapes.1.it.2.c.k': '#5b454e',
        // Layer 22 Outlines.Group 3.Fill 1
        'assets.2.layers.10.shapes.2.it.2.c.k': '#5b454e',
        // Layer 23 Outlines.Group 1.Fill 1
        'assets.2.layers.11.shapes.0.it.2.c.k': '#5b454e',
        // Layer 24 Outlines.Group 1.Fill 1
        'assets.2.layers.12.shapes.0.it.2.c.k': '#7f626e',
        // Layer 25 Outlines.Group 1.Fill 1
        'assets.2.layers.13.shapes.0.it.2.c.k': '#6d555e',
        // Layer 33 Outlines.Group 1.Fill 1
        'assets.3.layers.0.shapes.0.it.2.c.k': '#f9d6ac',
        // Layer 33 Outlines.Group 2.Fill 1
        'assets.3.layers.0.shapes.1.it.2.c.k': '#f9d6ac',
        // Layer 33 Outlines.Group 3.Fill 1
        'assets.3.layers.0.shapes.2.it.2.c.k': '#f9d6ac',
        // Layer 33 Outlines.Group 4.Fill 1
        'assets.3.layers.0.shapes.3.it.2.c.k': '#f9d6ac',
        // Layer 33 Outlines.Group 5.Fill 1
        'assets.3.layers.0.shapes.4.it.2.c.k': '#f9d6ac',
        // Layer 33 Outlines.Group 6.Fill 1
        'assets.3.layers.0.shapes.5.it.2.c.k': '#f9d6ac',
        // Layer 33 Outlines.Group 7.Fill 1
        'assets.3.layers.0.shapes.6.it.2.c.k': '#ffe2bb',
        // Layer 33 Outlines.Group 8.Fill 1
        'assets.3.layers.0.shapes.7.it.4.c.k': '#edc998',
        // Layer 34 Outlines.Group 1.Fill 1
        'assets.3.layers.1.shapes.0.it.2.c.k': '#f7d9b0',
        // Layer 34 Outlines.Group 2.Fill 1
        'assets.3.layers.1.shapes.1.it.2.c.k': '#edc998',
        // Layer 34 Outlines.Group 3.Fill 1
        'assets.3.layers.1.shapes.2.it.2.c.k': '#edc998',
        // Layer 34 Outlines.Group 4.Fill 1
        'assets.3.layers.1.shapes.3.it.2.c.k': '#f9d6ac',
        // Layer 34 Outlines.Group 5.Fill 1
        'assets.3.layers.1.shapes.4.it.2.c.k': '#f9d6ac',
        // Layer 37 Outlines.Group 1.Fill 1
        'assets.3.layers.2.shapes.0.it.2.c.k': '#edc998',
        // Layer 37 Outlines.Group 2.Fill 1
        'assets.3.layers.2.shapes.1.it.2.c.k': '#edc998',
        // Layer 37 Outlines.Group 3.Fill 1
        'assets.3.layers.2.shapes.2.it.2.c.k': '#edc998',
        // Layer 37 Outlines.Group 4.Fill 1
        'assets.3.layers.2.shapes.3.it.2.c.k': '#edc998',
        // Layer 37 Outlines.Group 5.Fill 1
        'assets.3.layers.2.shapes.4.it.2.c.k': '#edc998',
        // Layer 37 Outlines.Group 6.Fill 1
        'assets.3.layers.2.shapes.5.it.2.c.k': '#f9d6ac',
        // Layer 37 Outlines.Group 7.Fill 1
        'assets.3.layers.2.shapes.6.it.4.c.k': '#ffe2bb',
        // Layer 35 Outlines.Group 1.Fill 1
        'assets.3.layers.3.shapes.0.it.2.c.k': '#edc998',
        // Layer 36 Outlines.Group 1.Fill 1
        'assets.3.layers.4.shapes.0.it.4.c.k': '#f7d9b0',
        // Layer 49 Outlines.Group 1.Fill 1
        'assets.3.layers.5.shapes.0.it.2.c.k': '#f9d6ac',
        // Layer 49 Outlines.Group 2.Fill 1
        'assets.3.layers.5.shapes.1.it.2.c.k': '#f9d6ac',
        // Layer 49 Outlines.Group 3.Fill 1
        'assets.3.layers.5.shapes.2.it.2.c.k': '#f9d6ac',
        // Layer 49 Outlines.Group 4.Fill 1
        'assets.3.layers.5.shapes.3.it.2.c.k': '#f9d6ac',
        // Layer 49 Outlines.Group 5.Fill 1
        'assets.3.layers.5.shapes.4.it.2.c.k': '#f9d6ac',
        // Layer 49 Outlines.Group 6.Fill 1
        'assets.3.layers.5.shapes.5.it.2.c.k': '#f9d6ac',
        // Layer 49 Outlines.Group 7.Fill 1
        'assets.3.layers.5.shapes.6.it.2.c.k': '#ffe2bb',
        // Layer 49 Outlines.Group 8.Fill 1
        'assets.3.layers.5.shapes.7.it.4.c.k': '#edc998',
        // Layer 50 Outlines.Group 1.Fill 1
        'assets.3.layers.6.shapes.0.it.2.c.k': '#edc998',
        // Layer 50 Outlines.Group 2.Fill 1
        'assets.3.layers.6.shapes.1.it.2.c.k': '#edc998',
        // Layer 50 Outlines.Group 3.Fill 1
        'assets.3.layers.6.shapes.2.it.2.c.k': '#edc998',
        // Layer 50 Outlines.Group 4.Fill 1
        'assets.3.layers.6.shapes.3.it.2.c.k': '#f9d6ac',
        // Layer 50 Outlines.Group 5.Fill 1
        'assets.3.layers.6.shapes.4.it.4.c.k': '#ffe2bb',
        // Layer 51 Outlines.Group 1.Fill 1
        'assets.3.layers.7.shapes.0.it.2.c.k': '#f7d9b0',
        // Layer 51 Outlines.Group 2.Fill 1
        'assets.3.layers.7.shapes.1.it.2.c.k': '#edc998',
        // Layer 51 Outlines.Group 3.Fill 1
        'assets.3.layers.7.shapes.2.it.2.c.k': '#edc998',
        // Layer 51 Outlines.Group 4.Fill 1
        'assets.3.layers.7.shapes.3.it.2.c.k': '#f9d6ac',
        // Layer 51 Outlines.Group 5.Fill 1
        'assets.3.layers.7.shapes.4.it.2.c.k': '#f9d6ac',
        // Layer 51 Outlines.Group 6.Fill 1
        'assets.3.layers.7.shapes.5.it.2.c.k': '#edc998',
        // Layer 51 Outlines.Group 7.Fill 1
        'assets.3.layers.7.shapes.6.it.4.c.k': '#f7d9b0',
        // Stage 5.Rectangle 1.Fill 1
        'layers.0.shapes.0.it.1.c.k': '#ffffff',
        // chili.Group 1.Fill 1
        'layers.1.shapes.0.it.2.c.k': '#a8bc55',
        // chili.Group 2.Fill 1
        'layers.1.shapes.1.it.2.c.k': '#c4d36a',
        // chili.Group 3.Fill 1
        'layers.1.shapes.2.it.2.c.k': '#97a542',
        // chili.Group 4.Fill 1
        'layers.1.shapes.3.it.2.c.k': '#a8bc55',
        // chili.Group 5.Fill 1
        'layers.1.shapes.4.it.2.c.k': '#97a542',
        // Stage.Rectangle 1.Fill 1
        'layers.2.shapes.0.it.1.c.k': '#ffffff',
        // Stage 3.Shape 2.Stroke 1
        'layers.4.shapes.0.it.1.c.k': '#000000',
        // Stage 3.Shape 2.Fill 1
        'layers.4.shapes.0.it.2.c.k': '#bbbaba',
        // Stage 3.Shape 1.Fill 1
        'layers.4.shapes.1.it.1.c.k': '#bbbaba',
        // Mushrom 2.Group 1.Fill 1
        'layers.5.shapes.0.it.2.c.k': '#d3b094',
        // Mushrom 2.Group 2.Fill 1
        'layers.5.shapes.1.it.2.c.k': '#d3b094',
        // Mushrom 2.Group 3.Fill 1
        'layers.5.shapes.2.it.2.c.k': '#d3b094',
        // Mushrom 2.Group 4.Fill 1
        'layers.5.shapes.3.it.2.c.k': '#d3b094',
        // Mushrom 2.Group 5.Fill 1
        'layers.5.shapes.4.it.2.c.k': '#775945',
        // Mushrom 2.Group 6.Fill 1
        'layers.5.shapes.5.it.2.c.k': '#775945',
        // Mushrom 2.Group 7.Fill 1
        'layers.5.shapes.6.it.2.c.k': '#d3b094',
        // Mushrom 2.Group 8.Fill 1
        'layers.5.shapes.7.it.2.c.k': '#775945',
        // Mushrom 2.Group 9.Fill 1
        'layers.5.shapes.8.it.2.c.k': '#edd7c0',
        // Mushrom 2.Group 10.Fill 1
        'layers.5.shapes.9.it.2.c.k': '#d3b094',
        // Mushrom 2.Group 11.Fill 1
        'layers.5.shapes.10.it.2.c.k': '#e5c4a5',
        // Mushrom 2.Group 12.Fill 1
        'layers.5.shapes.11.it.2.c.k': '#edd7c0',
        // Mushrom 2.Group 13.Fill 1
        'layers.5.shapes.12.it.2.c.k': '#d3b094',
        // Stage 4.Rectangle 1.Fill 1
        'layers.7.shapes.0.it.1.c.k': '#ffffff',
        // Paprika.Group 1.Fill 1
        'layers.8.shapes.0.it.2.c.k': '#b20b3f',
        // Paprika.Group 2.Fill 1
        'layers.8.shapes.1.it.2.c.k': '#ff7166',
        // Paprika.Group 3.Fill 1
        'layers.8.shapes.2.it.2.c.k': '#ff7166',
        // Paprika.Group 4.Fill 1
        'layers.8.shapes.3.it.2.c.k': '#db0f45',
        // Paprika.Group 5.Fill 1
        'layers.8.shapes.4.it.2.c.k': '#ed264c',
        // Paprika.Group 6.Fill 1
        'layers.8.shapes.5.it.2.c.k': '#b7b737',
        // Paprika.Group 7.Fill 1
        'layers.8.shapes.6.it.2.c.k': '#969327',
        // Chese.Group 1.Fill 1
        'layers.9.shapes.0.it.2.c.k': '#ffc166',
        // Chese.Group 2.Fill 1
        'layers.9.shapes.1.it.2.c.k': '#ffc166',
        // Chese.Group 3.Fill 1
        'layers.9.shapes.2.it.2.c.k': '#ffc166',
        // Chese.Group 4.Fill 1
        'layers.9.shapes.3.it.2.c.k': '#ffc166',
        // Chese.Group 5.Fill 1
        'layers.9.shapes.4.it.2.c.k': '#ffc166',
        // Chese.Group 6.Fill 1
        'layers.9.shapes.5.it.2.c.k': '#ffc166',
        // Chese.Group 7.Fill 1
        'layers.9.shapes.6.it.2.c.k': '#ffc166',
        // Chese.Group 8.Fill 1
        'layers.9.shapes.7.it.2.c.k': '#ffc166',
        // Chese.Group 9.Fill 1
        'layers.9.shapes.8.it.2.c.k': '#ff9e55',
        // Chese.Group 10.Fill 1
        'layers.9.shapes.9.it.2.c.k': '#ffdb80',
        // Chese.Group 11.Fill 1
        'layers.9.shapes.10.it.2.c.k': '#ffe6a1',
        // Mushroom 3.Group 1.Fill 1
        'layers.10.shapes.0.it.2.c.k': '#edd7c0',
        // Mushroom 3.Group 2.Fill 1
        'layers.10.shapes.1.it.2.c.k': '#c49f86',
        // Mushroom 3.Group 3.Fill 1
        'layers.10.shapes.2.it.2.c.k': '#c49f86',
        // Mushroom 3.Group 4.Fill 1
        'layers.10.shapes.3.it.2.c.k': '#c49f86',
        // Mushroom 3.Group 5.Fill 1
        'layers.10.shapes.4.it.2.c.k': '#d3b094',
        // Mushroom 3.Group 6.Fill 1
        'layers.10.shapes.5.it.2.c.k': '#775945',
        // Mushroom 3.Group 7.Fill 1
        'layers.10.shapes.6.it.2.c.k': '#775945',
        // Mushroom 3.Group 8.Fill 1
        'layers.10.shapes.7.it.2.c.k': '#775945',
        // Mushroom 3.Group 9.Fill 1
        'layers.10.shapes.8.it.2.c.k': '#775945',
        // Mushroom 3.Group 10.Fill 1
        'layers.10.shapes.9.it.2.c.k': '#775945',
        // Mushroom 3.Group 11.Fill 1
        'layers.10.shapes.10.it.2.c.k': '#775945',
        // Mushroom 3.Group 12.Fill 1
        'layers.10.shapes.11.it.2.c.k': '#775945',
        // Mushroom 3.Group 13.Fill 1
        'layers.10.shapes.12.it.2.c.k': '#775945',
        // Mushroom 3.Group 14.Fill 1
        'layers.10.shapes.13.it.2.c.k': '#775945',
        // Mushroom 3.Group 15.Fill 1
        'layers.10.shapes.14.it.2.c.k': '#775945',
        // Mushroom 3.Group 16.Fill 1
        'layers.10.shapes.15.it.2.c.k': '#775945',
        // Mushroom 3.Group 17.Fill 1
        'layers.10.shapes.16.it.2.c.k': '#775945',
        // Mushroom 3.Group 18.Fill 1
        'layers.10.shapes.17.it.2.c.k': '#775945',
        // Mushroom 3.Group 19.Fill 1
        'layers.10.shapes.18.it.2.c.k': '#775945',
        // Mushroom 3.Group 20.Fill 1
        'layers.10.shapes.19.it.2.c.k': '#775945',
        // Mushroom 3.Group 21.Fill 1
        'layers.10.shapes.20.it.2.c.k': '#775945',
        // Mushroom 3.Group 22.Fill 1
        'layers.10.shapes.21.it.2.c.k': '#775945',
        // Mushroom 3.Group 23.Fill 1
        'layers.10.shapes.22.it.2.c.k': '#5e4432',
        // Mushroom 3.Group 24.Fill 1
        'layers.10.shapes.23.it.2.c.k': '#775945',
        // Mushroom 3.Group 25.Fill 1
        'layers.10.shapes.24.it.2.c.k': '#edd7c0',
        // Mushroom 3.Group 26.Fill 1
        'layers.10.shapes.25.it.2.c.k': '#e5c4a5',
        // sosis.Group 1.Fill 1
        'layers.12.shapes.0.it.2.c.k': '#fc7793',
        // sosis.Group 2.Fill 1
        'layers.12.shapes.1.it.2.c.k': '#fc7793',
        // sosis.Group 3.Fill 1
        'layers.12.shapes.2.it.2.c.k': '#ed5d7f',
        // sosis.Group 4.Fill 1
        'layers.12.shapes.3.it.2.c.k': '#ed5d7f',
        // sosis.Group 5.Fill 1
        'layers.12.shapes.4.it.2.c.k': '#ed5d7f',
        // sosis.Group 6.Fill 1
        'layers.12.shapes.5.it.2.c.k': '#fc7793',
        // sosis.Group 7.Fill 1
        'layers.12.shapes.6.it.2.c.k': '#d1375f',
        // sosis.Group 8.Fill 1
        'layers.12.shapes.7.it.2.c.k': '#e2446e',
        // sosis.Group 9.Fill 1
        'layers.12.shapes.8.it.2.c.k': '#9e193c',
        // sosis.Group 10.Fill 1
        'layers.12.shapes.9.it.2.c.k': '#b72746',
        // sosis 2.Group 1.Fill 1
        'layers.13.shapes.0.it.2.c.k': '#fc7793',
        // sosis 2.Group 2.Fill 1
        'layers.13.shapes.1.it.2.c.k': '#ed5d7f',
        // sosis 2.Group 3.Fill 1
        'layers.13.shapes.2.it.2.c.k': '#ed5d7f',
        // sosis 2.Group 4.Fill 1
        'layers.13.shapes.3.it.2.c.k': '#fc7793',
        // sosis 2.Group 5.Fill 1
        'layers.13.shapes.4.it.2.c.k': '#d1375f',
        // sosis 2.Group 6.Fill 1
        'layers.13.shapes.5.it.2.c.k': '#e2446e',
        // sosis 2.Group 7.Fill 1
        'layers.13.shapes.6.it.2.c.k': '#9e193c',
        // sosis 2.Group 8.Fill 1
        'layers.13.shapes.7.it.2.c.k': '#b72746',
        // sosis 3.Group 1.Fill 1
        'layers.14.shapes.0.it.2.c.k': '#fc7793',
        // sosis 3.Group 2.Fill 1
        'layers.14.shapes.1.it.2.c.k': '#fc7793',
        // sosis 3.Group 3.Fill 1
        'layers.14.shapes.2.it.2.c.k': '#ed5d7f',
        // sosis 3.Group 4.Fill 1
        'layers.14.shapes.3.it.2.c.k': '#ed5d7f',
        // sosis 3.Group 5.Fill 1
        'layers.14.shapes.4.it.2.c.k': '#fc7793',
        // sosis 3.Group 6.Fill 1
        'layers.14.shapes.5.it.2.c.k': '#d1375f',
        // sosis 3.Group 7.Fill 1
        'layers.14.shapes.6.it.2.c.k': '#e2446e',
        // sosis 3.Group 8.Fill 1
        'layers.14.shapes.7.it.2.c.k': '#9e193c',
        // sosis 3.Group 9.Fill 1
        'layers.14.shapes.8.it.2.c.k': '#c92853',
        // sosis 3.Group 10.Fill 1
        'layers.14.shapes.9.it.2.c.k': '#b72746',
        // Stage 3.Rectangle 1.Fill 1
        'layers.15.shapes.0.it.1.c.k': '#ffffff',
        // paprika 2.Group 1.Fill 1
        'layers.16.shapes.0.it.4.c.k': '#b20b3f',
        // paprika 2.Group 2.Fill 1
        'layers.16.shapes.1.it.2.c.k': '#ff7166',
        // paprika 2.Group 3.Fill 1
        'layers.16.shapes.2.it.2.c.k': '#ff7166',
        // paprika 2.Group 4.Fill 1
        'layers.16.shapes.3.it.4.c.k': '#e02843',
        // Stage 2.Rectangle 1.Fill 1
        'layers.17.shapes.0.it.1.c.k': '#ffffff',
        // paprika 3.Group 1.Fill 1
        'layers.18.shapes.0.it.4.c.k': '#b20b3f',
        // paprika 3.Group 2.Fill 1
        'layers.18.shapes.1.it.2.c.k': '#ff7166',
        // paprika 3.Group 3.Fill 1
        'layers.18.shapes.2.it.2.c.k': '#ff7166',
        // paprika 3.Group 4.Fill 1
        'layers.18.shapes.3.it.4.c.k': '#e02843',
        // tomato.Group 1.Fill 1
        'layers.19.shapes.0.it.2.c.k': '#ff6e6e',
        // tomato.Group 2.Fill 1
        'layers.19.shapes.1.it.2.c.k': '#f41c4f',
        // tomato.Group 3.Fill 1
        'layers.19.shapes.2.it.2.c.k': '#ff2c55',
        // tomato 2.Group 1.Fill 1
        'layers.20.shapes.0.it.2.c.k': '#e01445',
        // tomato 2.Group 2.Fill 1
        'layers.20.shapes.1.it.2.c.k': '#e01445',
        // tomato 2.Group 3.Fill 1
        'layers.20.shapes.2.it.2.c.k': '#e01445',
        // tomato 2.Group 4.Fill 1
        'layers.20.shapes.3.it.2.c.k': '#e01445',
        // tomato 2.Group 5.Fill 1
        'layers.20.shapes.4.it.2.c.k': '#e01445',
        // tomato 2.Group 6.Fill 1
        'layers.20.shapes.5.it.2.c.k': '#e01445',
        // tomato 2.Group 7.Fill 1
        'layers.20.shapes.6.it.2.c.k': '#e01445',
        // tomato 2.Group 8.Fill 1
        'layers.20.shapes.7.it.2.c.k': '#e01445',
        // tomato 2.Group 9.Fill 1
        'layers.20.shapes.8.it.2.c.k': '#e01445',
        // tomato 2.Group 10.Fill 1
        'layers.20.shapes.9.it.2.c.k': '#e01445',
        // tomato 2.Group 11.Fill 1
        'layers.20.shapes.10.it.2.c.k': '#e01445',
        // tomato 2.Group 12.Fill 1
        'layers.20.shapes.11.it.2.c.k': '#e01445',
        // tomato 2.Group 13.Fill 1
        'layers.20.shapes.12.it.2.c.k': '#e01445',
        // tomato 2.Group 14.Fill 1
        'layers.20.shapes.13.it.2.c.k': '#e01445',
        // tomato 2.Group 15.Fill 1
        'layers.20.shapes.14.it.2.c.k': '#c41241',
        // tomato 2.Group 16.Fill 1
        'layers.20.shapes.15.it.2.c.k': '#c41241',
        // tomato 2.Group 17.Fill 1
        'layers.20.shapes.16.it.2.c.k': '#e01445',
        // tomato 2.Group 18.Fill 1
        'layers.20.shapes.17.it.2.c.k': '#ff6e6e',
        // tomato 2.Group 19.Fill 1
        'layers.20.shapes.18.it.2.c.k': '#ff2c55',
        // tomato 3.Group 1.Fill 1
        'layers.21.shapes.0.it.2.c.k': '#e01445',
        // tomato 3.Group 2.Fill 1
        'layers.21.shapes.1.it.2.c.k': '#e01445',
        // tomato 3.Group 3.Fill 1
        'layers.21.shapes.2.it.2.c.k': '#e01445',
        // tomato 3.Group 4.Fill 1
        'layers.21.shapes.3.it.2.c.k': '#e01445',
        // tomato 3.Group 5.Fill 1
        'layers.21.shapes.4.it.2.c.k': '#e01445',
        // tomato 3.Group 6.Fill 1
        'layers.21.shapes.5.it.2.c.k': '#e01445',
        // tomato 3.Group 7.Fill 1
        'layers.21.shapes.6.it.2.c.k': '#e01445',
        // tomato 3.Group 8.Fill 1
        'layers.21.shapes.7.it.2.c.k': '#e01445',
        // tomato 3.Group 9.Fill 1
        'layers.21.shapes.8.it.2.c.k': '#e01445',
        // tomato 3.Group 10.Fill 1
        'layers.21.shapes.9.it.2.c.k': '#e01445',
        // tomato 3.Group 11.Fill 1
        'layers.21.shapes.10.it.2.c.k': '#e01445',
        // tomato 3.Group 12.Fill 1
        'layers.21.shapes.11.it.2.c.k': '#e01445',
        // tomato 3.Group 13.Fill 1
        'layers.21.shapes.12.it.2.c.k': '#e01445',
        // tomato 3.Group 14.Fill 1
        'layers.21.shapes.13.it.2.c.k': '#e01445',
        // tomato 3.Group 15.Fill 1
        'layers.21.shapes.14.it.2.c.k': '#c41241',
        // tomato 3.Group 16.Fill 1
        'layers.21.shapes.15.it.2.c.k': '#c41241',
        // tomato 3.Group 17.Fill 1
        'layers.21.shapes.16.it.2.c.k': '#e01445',
        // tomato 3.Group 18.Fill 1
        'layers.21.shapes.17.it.2.c.k': '#f41c4f',
        // tomato 3.Group 19.Fill 1
        'layers.21.shapes.18.it.2.c.k': '#ff2c55',
        // tomato 3.Group 20.Fill 1
        'layers.21.shapes.19.it.2.c.k': '#999628',
        // tomato 3.Group 21.Fill 1
        'layers.21.shapes.20.it.2.c.k': '#999628',
        // tomato 3.Group 22.Fill 1
        'layers.21.shapes.21.it.2.c.k': '#b7b737',
        // tomato 3.Group 23.Fill 1
        'layers.21.shapes.22.it.2.c.k': '#b7b737',
        // black paper.Group 1.Fill 1
        'layers.22.shapes.0.it.2.c.k': '#c6b6a7',
        // black paper.Group 2.Fill 1
        'layers.22.shapes.1.it.2.c.k': '#c6b6a7',
        // black paper.Group 3.Fill 1
        'layers.22.shapes.2.it.2.c.k': '#c6b6a7',
        // black paper.Group 4.Fill 1
        'layers.22.shapes.3.it.2.c.k': '#c6b6a7',
        // black paper.Group 5.Fill 1
        'layers.22.shapes.4.it.2.c.k': '#c6b6a7',
        // black paper.Group 6.Fill 1
        'layers.22.shapes.5.it.2.c.k': '#c6b6a7',
        // black paper.Group 7.Fill 1
        'layers.22.shapes.6.it.2.c.k': '#c6b6a7',
        // black paper.Group 8.Fill 1
        'layers.22.shapes.7.it.0.c.k': '#5e4a4f',
        // black paper.Group 9.Fill 1
        'layers.22.shapes.8.it.0.c.k': '#5e4a4f',
        // black paper.Group 10.Fill 1
        'layers.22.shapes.9.it.2.c.k': '#fff0dc',
        // black paper.Group 11.Fill 1
        'layers.22.shapes.10.it.2.c.k': '#fff0dc',
        // black paper.Group 12.Fill 1
        'layers.22.shapes.11.it.2.c.k': '#f4dfc6',
        // black paper.Group 13.Fill 1
        'layers.22.shapes.12.it.2.c.k': '#f4dfc6',
        // black paper.Group 14.Fill 1
        'layers.22.shapes.13.it.2.c.k': '#5e494e',
        // black paper.Group 15.Fill 1
        'layers.22.shapes.14.it.2.c.k': '#5e4a4f',
        // black paper.Group 16.Fill 1
        'layers.22.shapes.15.it.2.c.k': '#705c60',
        // Shape Layer 1.Shape 2.Stroke 1
        'layers.23.shapes.0.it.1.c.k': '#000000',
        // Shape Layer 1.Shape 2.Fill 1
        'layers.23.shapes.0.it.2.c.k': '#bbbaba',
        // Shape Layer 1.Shape 1.Fill 1
        'layers.23.shapes.1.it.1.c.k': '#bbbaba',
        // mozarela chesee.Group 1.Fill 1
        'layers.24.shapes.0.it.2.c.k': '#ffdb80',
        // mozarela chesee.Group 2.Fill 1
        'layers.24.shapes.1.it.2.c.k': '#ff9e55',
        // mozarela chesee.Group 3.Fill 1
        'layers.24.shapes.2.it.2.c.k': '#ffc166',
        // mozarela chesee.Group 4.Fill 1
        'layers.24.shapes.3.it.2.c.k': '#ffc166',
        // mozarela chesee.Group 5.Fill 1
        'layers.24.shapes.4.it.2.c.k': '#ffc166',
        // mozarela chesee.Group 6.Fill 1
        'layers.24.shapes.5.it.2.c.k': '#ffc166',
        // mozarela chesee.Group 7.Fill 1
        'layers.24.shapes.6.it.2.c.k': '#ffe6a1',
        // mozarela chesee.Group 8.Fill 1
        'layers.24.shapes.7.it.2.c.k': '#ffdb80',
        // mozarela chesee.Group 9.Fill 1
        'layers.24.shapes.8.it.2.c.k': '#ff9e55',
        // mozarela chesee.Group 10.Fill 1
        'layers.24.shapes.9.it.2.c.k': '#ffce76',
        // mozarela chesee.Group 11.Fill 1
        'layers.24.shapes.10.it.2.c.k': '#ff9e55',
        // mozarela chesee.Group 12.Fill 1
        'layers.24.shapes.11.it.2.c.k': '#ffc166',
        // mozarela chesee.Group 13.Fill 1
        'layers.24.shapes.12.it.2.c.k': '#ff9e55',
        // mushroom 2.Group 1.Fill 1
        'layers.25.shapes.0.it.2.c.k': '#f2decc',
        // mushroom 2.Group 2.Fill 1
        'layers.25.shapes.1.it.2.c.k': '#e5c4a5',
        // mushroom 2.Group 3.Fill 1
        'layers.25.shapes.2.it.2.c.k': '#edd7c0',
        // mushroom 2.Group 4.Fill 1
        'layers.25.shapes.3.it.2.c.k': '#d3b094',
        // mushroom 2.Group 5.Fill 1
        'layers.25.shapes.4.it.2.c.k': '#e5c4a5',
        // salt.Group 1.Fill 1
        'layers.26.shapes.0.it.2.c.k': '#c6b6a7',
        // salt.Group 2.Fill 1
        'layers.26.shapes.1.it.2.c.k': '#c6b6a7',
        // salt.Group 3.Fill 1
        'layers.26.shapes.2.it.2.c.k': '#c6b6a7',
        // salt.Group 4.Fill 1
        'layers.26.shapes.3.it.2.c.k': '#c6b6a7',
        // salt.Group 5.Fill 1
        'layers.26.shapes.4.it.2.c.k': '#c6b6a7',
        // salt.Group 6.Fill 1
        'layers.26.shapes.5.it.2.c.k': '#c6b6a7',
        // salt.Group 7.Fill 1
        'layers.26.shapes.6.it.2.c.k': '#fff0dc',
        // salt.Group 8.Fill 1
        'layers.26.shapes.7.it.2.c.k': '#f7e6d0',
        // salt.Group 9.Fill 1
        'layers.26.shapes.8.it.2.c.k': '#f4dfc6',
        // salt.Group 10.Fill 1
        'layers.26.shapes.9.it.2.c.k': '#fff0dc',
        // salt.Group 11.Fill 1
        'layers.26.shapes.10.it.2.c.k': '#f4dfc6',
        // salt.Group 12.Fill 1
        'layers.26.shapes.11.it.2.c.k': '#f4dfc6',
        // salt.Group 13.Fill 1
        'layers.26.shapes.12.it.2.c.k': '#f7e6d0',
        // salt.Group 14.Fill 1
        'layers.26.shapes.13.it.2.c.k': '#fff0dc',
        // salt.Group 15.Fill 1
        'layers.26.shapes.14.it.2.c.k': '#b5a391',
        // salt.Group 16.Fill 1
        'layers.26.shapes.15.it.2.c.k': '#b5a391',
        // salt.Group 17.Fill 1
        'layers.26.shapes.16.it.2.c.k': '#d6c9ba',
        // orage?.Group 1.Fill 1
        'layers.27.shapes.0.it.2.c.k': '#f4742c',
        // orage?.Group 2.Fill 1
        'layers.27.shapes.1.it.2.c.k': '#ccc83b',
        // orage?.Group 3.Fill 1
        'layers.27.shapes.2.it.2.c.k': '#b7b730',
        // orage?.Group 4.Fill 1
        'layers.27.shapes.3.it.2.c.k': '#b7b730',
        // orage?.Group 5.Fill 1
        'layers.27.shapes.4.it.2.c.k': '#ccc83b',
        // orage?.Group 6.Fill 1
        'layers.27.shapes.5.it.2.c.k': '#db5f21',
        // orage?.Group 7.Fill 1
        'layers.27.shapes.6.it.2.c.k': '#ff954d',
        // orage?.Group 8.Fill 1
        'layers.27.shapes.7.it.2.c.k': '#f4742c',
        // orage?.Group 9.Fill 1
        'layers.27.shapes.8.it.2.c.k': '#f4742c',
        // orage?.Group 10.Fill 1
        'layers.27.shapes.9.it.2.c.k': '#f4742c',
        // orage?.Group 11.Fill 1
        'layers.27.shapes.10.it.2.c.k': '#f4742c',
        // orage?.Group 12.Fill 1
        'layers.27.shapes.11.it.2.c.k': '#f78537',
        // orage?.Group 13.Fill 1
        'layers.27.shapes.12.it.2.c.k': '#f4742c',
        // Layer 52 Outlines.Group 1.Fill 1
        'layers.29.shapes.0.it.2.c.k': '#5b454e',
      }),
    [],
  );

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(PizzaIngrediantsAnimation);
