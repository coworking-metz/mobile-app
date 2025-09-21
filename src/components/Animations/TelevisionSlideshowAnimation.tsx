import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import TelevisionSlideshow from '@/assets/animations/television-slideshow.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const TelevisionSlideshowAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const borderColor = (isDark ? tw.color('zinc-700') : '#17171d') as string;
    const footerColor = (isDark ? tw.color('zinc-600') : '#2c2d31') as string;
    return colouriseLottie(TelevisionSlideshow, {
      // Layer 34.Group 1.Stroke 1
      'assets.0.layers.0.shapes.0.it.1.c.k': '#388c8a',
      // Layer 33.Group 1.Stroke 1
      'assets.0.layers.1.shapes.0.it.1.c.k': '#cccccc',
      // Layer 35.Group 1.Stroke 1
      'assets.0.layers.2.shapes.0.it.1.c.k': '#d3cb33',
      // Layer 32.Group 1.Stroke 1
      'assets.0.layers.3.shapes.0.it.1.c.k': '#444484',
      // Layer 31.Group 1.Stroke 1
      'assets.0.layers.4.shapes.0.it.1.c.k': '#a588d1',
      // Layer 22.Group 1.Stroke 1
      'assets.0.layers.5.shapes.0.it.1.c.k': '#ce7821',
      // Layer 36.Group 1.Stroke 1
      'assets.0.layers.6.shapes.0.it.1.c.k': '#424289',
      // Layer 29.Group 1.Stroke 1
      'assets.0.layers.7.shapes.0.it.1.c.k': '#cccccc',
      // Layer 28.Group 1.Stroke 1
      'assets.0.layers.8.shapes.0.it.1.c.k': '#ce7821',
      // Layer 30.Group 1.Stroke 1
      'assets.0.layers.9.shapes.0.it.1.c.k': '#ce7821',
      // Layer 27.Group 1.Stroke 1
      'assets.0.layers.10.shapes.0.it.1.c.k': '#444484',
      // Layer 37.Group 1.Stroke 1
      'assets.0.layers.11.shapes.0.it.1.c.k': '#424289',
      // Layer 25.Group 1.Stroke 1
      'assets.0.layers.12.shapes.0.it.1.c.k': '#d3cb33',
      // Layer 26.Group 1.Stroke 1
      'assets.0.layers.13.shapes.0.it.1.c.k': '#388c8a',
      // Layer 23.Group 1.Stroke 1
      'assets.0.layers.14.shapes.0.it.1.c.k': '#388c8a',
      // Layer 3.Group 1.Stroke 1
      'assets.0.layers.15.shapes.0.it.1.c.k': '#444484',
      // Layer 24.Group 1.Stroke 1
      'assets.0.layers.16.shapes.0.it.1.c.k': '#a588d1',
      // Layer 2.Group 1.Stroke 1
      'assets.0.layers.17.shapes.0.it.1.c.k': '#cccccc',
      // Layer 21.Group 1.Fill 1
      'assets.0.layers.18.shapes.0.it.1.c.k': '#58bcbc',
      // Layer 17.Group 1.Fill 1
      'assets.0.layers.19.shapes.0.it.1.c.k': '#f4faff',
      // Layer 20.Group 1.Fill 1
      'assets.0.layers.20.shapes.0.it.1.c.k': '#fff937',
      // Layer 18.Group 1.Fill 1
      'assets.0.layers.21.shapes.0.it.1.c.k': '#2b66ec',
      // Layer 19.Group 1.Fill 1
      'assets.0.layers.22.shapes.0.it.1.c.k': '#d7b8ff',
      // Layer 16.Group 1.Fill 1
      'assets.0.layers.23.shapes.0.it.1.c.k': '#fd9727',
      // 12.Group 1.Fill 1
      'assets.0.layers.24.shapes.0.it.1.c.k': '#5b5baf',
      // 11.Group 1.Fill 1
      'assets.0.layers.25.shapes.0.it.1.c.k': '#f4faff',
      // 10.Group 1.Fill 1
      'assets.0.layers.26.shapes.0.it.1.c.k': '#fd9727',
      // 9.Group 1.Fill 1
      'assets.0.layers.27.shapes.0.it.1.c.k': '#fd9727',
      // 8.Group 1.Fill 1
      'assets.0.layers.28.shapes.0.it.1.c.k': '#2b66ec',
      // 7.Group 1.Fill 1
      'assets.0.layers.29.shapes.0.it.1.c.k': '#5b5baf',
      // 6.Group 1.Fill 1
      'assets.0.layers.30.shapes.0.it.1.c.k': '#fff937',
      // 5.Group 1.Fill 1
      'assets.0.layers.31.shapes.0.it.1.c.k': '#58bcbc',
      // 4.Group 1.Fill 1
      'assets.0.layers.32.shapes.0.it.1.c.k': '#58bcbc',
      // 3.Group 1.Fill 1
      'assets.0.layers.33.shapes.0.it.1.c.k': '#2b66ec',
      // 2.Group 1.Fill 1
      'assets.0.layers.34.shapes.0.it.1.c.k': '#d7b8ff',
      // 1.Group 1.Fill 1
      'assets.0.layers.35.shapes.0.it.1.c.k': '#f4faff',
      // Inner_Block.Group 1.Fill 1
      'assets.0.layers.36.shapes.0.it.1.c.k': '#c9daf4',
      // Inner_Block_Shadow.Group 1.Fill 1
      'assets.0.layers.37.shapes.0.it.1.c.k': '#000000',
      // Block.Group 1.Fill 1
      'assets.0.layers.38.shapes.0.it.1.c.k': '#bccdea',
      // Block_Shadow.Group 1.Fill 1
      'assets.0.layers.39.shapes.0.it.1.c.k': '#000000',
      // BG color.Group 1.Fill 1
      'assets.0.layers.40.shapes.0.it.1.c.k': '#2b66ec',
      // 17.Group 1.Fill 1
      'assets.1.layers.0.shapes.0.it.1.c.k': '#2b66ec',
      // 16.Group 1.Fill 1
      'assets.1.layers.1.shapes.0.it.1.c.k': '#f4faff',
      // 15.Group 1.Fill 1
      'assets.1.layers.2.shapes.0.it.1.c.k': '#2cfafe',
      // 14.Group 1.Fill 1
      'assets.1.layers.3.shapes.0.it.1.c.k': '#fd9727',
      // 13.Group 1.Fill 1
      'assets.1.layers.4.shapes.0.it.1.c.k': '#fff937',
      // 12.Group 1.Fill 1
      'assets.1.layers.5.shapes.0.it.1.c.k': '#f4faff',
      // 11.Group 1.Fill 1
      'assets.1.layers.6.shapes.0.it.1.c.k': '#2b66ec',
      // 10.Group 1.Fill 1
      'assets.1.layers.7.shapes.0.it.1.c.k': '#fd9727',
      // 9.Group 1.Fill 1
      'assets.1.layers.8.shapes.0.it.1.c.k': '#2cfafe',
      // 8.Group 1.Fill 1
      'assets.1.layers.9.shapes.0.it.1.c.k': '#fd9727',
      // 7.Group 1.Fill 1
      'assets.1.layers.10.shapes.0.it.1.c.k': '#f4faff',
      // 6.Group 1.Fill 1
      'assets.1.layers.11.shapes.0.it.1.c.k': '#d7b8ff',
      // 5.Group 1.Fill 1
      'assets.1.layers.12.shapes.0.it.1.c.k': '#fff937',
      // 4.Group 1.Fill 1
      'assets.1.layers.13.shapes.0.it.1.c.k': '#2b66ec',
      // 3.Group 1.Fill 1
      'assets.1.layers.14.shapes.0.it.1.c.k': '#f4faff',
      // 2.Group 1.Fill 1
      'assets.1.layers.15.shapes.0.it.1.c.k': '#d7b8ff',
      // 1.Group 1.Fill 1
      'assets.1.layers.16.shapes.0.it.1.c.k': '#2cfafe',
      // Line_Yellow.Group 1.Stroke 1
      'assets.1.layers.17.shapes.0.it.1.c.k': '#fff937',
      // Link_Pink.Group 1.Stroke 1
      'assets.1.layers.18.shapes.0.it.1.c.k': '#d7b8ff',
      // Line_Aqua.Group 1.Stroke 1
      'assets.1.layers.19.shapes.0.it.1.c.k': '#2cfafe',
      // Line_Orange.Group 1.Stroke 1
      'assets.1.layers.20.shapes.0.it.1.c.k': '#fd9727',
      // Line_Blue.Group 1.Stroke 1
      'assets.1.layers.21.shapes.0.it.1.c.k': '#2b66ec',
      // Line_White.Group 1.Stroke 1
      'assets.1.layers.22.shapes.0.it.1.c.k': '#f4faff',
      // Grid_H.Group 1.Stroke 1
      'assets.1.layers.23.shapes.0.it.1.c.k': '#ffffff',
      // Grid_V.Group 1.Stroke 1
      'assets.1.layers.24.shapes.0.it.1.c.k': '#ffffff',
      // Line_Title.Group 1.Stroke 1
      'assets.1.layers.25.shapes.0.it.1.c.k': '#ffffff',
      // Block.Group 1.Fill 1
      'assets.1.layers.26.shapes.0.it.1.c.k': '#171733',
      // Block_Shadow.Group 1.Fill 1
      'assets.1.layers.27.shapes.0.it.1.c.k': '#000000',
      // BG color.Group 1.Fill 1
      'assets.1.layers.28.shapes.0.it.1.c.k': '#f4faff',
      // Line_03.Group 1.Stroke 1
      'assets.2.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // Line_02.Group 1.Stroke 1
      'assets.2.layers.1.shapes.0.it.1.c.k': '#ffffff',
      // Line_01.Group 1.Stroke 1
      'assets.2.layers.2.shapes.0.it.1.c.k': '#ffffff',
      // White_Block.Group 1.Fill 1
      'assets.2.layers.3.shapes.0.it.1.c.k': '#f4faff',
      // Light_blue_block.Group 1.Fill 1
      'assets.2.layers.4.shapes.0.it.1.c.k': '#2b66ec',
      // Dark_blue_Block.Group 1.Fill 1
      'assets.2.layers.5.shapes.0.it.1.c.k': '#171733',
      // Line_Side_03.Group 1.Stroke 1
      'assets.2.layers.6.shapes.0.it.1.c.k': '#ffffff',
      // Line_Side_02.Group 1.Stroke 1
      'assets.2.layers.7.shapes.0.it.1.c.k': '#ffffff',
      // Line_Side_01.Group 1.Stroke 1
      'assets.2.layers.8.shapes.0.it.1.c.k': '#ffffff',
      // Line_under_03.Group 1.Stroke 1
      'assets.2.layers.9.shapes.0.it.1.c.k': '#ffffff',
      // Line_under_02.Group 1.Stroke 1
      'assets.2.layers.10.shapes.0.it.1.c.k': '#ffffff',
      // Line_under_01.Group 1.Stroke 1
      'assets.2.layers.11.shapes.0.it.1.c.k': '#ffffff',
      // Line_Title.Group 1.Stroke 1
      'assets.2.layers.12.shapes.0.it.1.c.k': '#ffffff',
      // Dark_blue_bar_06.Group 1.Fill 1
      'assets.2.layers.13.shapes.0.it.1.c.k': '#171733',
      // Dark_blue_bar_05.Group 1.Fill 1
      'assets.2.layers.14.shapes.0.it.1.c.k': '#171733',
      // Dark_blue_bar_04.Group 1.Fill 1
      'assets.2.layers.15.shapes.0.it.1.c.k': '#171733',
      // Dark_blue_bar_03.Group 1.Fill 1
      'assets.2.layers.16.shapes.0.it.1.c.k': '#171733',
      // Dark_blue_bar_02.Group 1.Fill 1
      'assets.2.layers.17.shapes.0.it.1.c.k': '#171733',
      // Dark_blue_bar_01.Group 1.Fill 1
      'assets.2.layers.18.shapes.0.it.1.c.k': '#171733',
      // Blue_bar_06.Group 1.Fill 1
      'assets.2.layers.19.shapes.0.it.1.c.k': '#2b66ec',
      // Blue_bar_05.Group 1.Fill 1
      'assets.2.layers.20.shapes.0.it.1.c.k': '#2b66ec',
      // Blue_bar_04.Group 1.Fill 1
      'assets.2.layers.21.shapes.0.it.1.c.k': '#2b66ec',
      // Blue_bar_03.Group 1.Fill 1
      'assets.2.layers.22.shapes.0.it.1.c.k': '#2b66ec',
      // Blue_bar_02.Group 1.Fill 1
      'assets.2.layers.23.shapes.0.it.1.c.k': '#2b66ec',
      // Blue_bar_01.Group 1.Fill 1
      'assets.2.layers.24.shapes.0.it.1.c.k': '#2b66ec',
      // White_bar_06.Group 1.Fill 1
      'assets.2.layers.25.shapes.0.it.1.c.k': '#f4faff',
      // White_bar_05.Group 1.Fill 1
      'assets.2.layers.26.shapes.0.it.1.c.k': '#f4faff',
      // White_bar_04.Group 1.Fill 1
      'assets.2.layers.27.shapes.0.it.1.c.k': '#f4faff',
      // White_bar_03.Group 1.Fill 1
      'assets.2.layers.28.shapes.0.it.1.c.k': '#f4faff',
      // White_bar_02.Group 1.Fill 1
      'assets.2.layers.29.shapes.0.it.1.c.k': '#f4faff',
      // White_bar_01.Group 1.Fill 1
      'assets.2.layers.30.shapes.0.it.1.c.k': '#f4faff',
      // Block.Group 1.Fill 1
      'assets.2.layers.31.shapes.0.it.1.c.k': '#ea8460',
      // Block_Shadow.Group 1.Fill 1
      'assets.2.layers.32.shapes.0.it.1.c.k': '#000000',
      // BG color.Group 1.Fill 1
      'assets.2.layers.33.shapes.0.it.1.c.k': '#ea6621',
      // Mid_Blue_line 2.Group 1.Stroke 1
      'assets.3.layers.0.shapes.0.it.1.c.k': '#5a91ff',
      // Mid_Blue_line.Group 1.Stroke 1
      'assets.3.layers.2.shapes.0.it.1.c.k': '#5a91ff',
      // Mid_White_line.Group 1.Stroke 1
      'assets.3.layers.3.shapes.0.it.1.c.k': '#f4faff',
      // Pink_Circle.Group 1.Stroke 1
      'assets.3.layers.5.shapes.0.it.1.c.k': '#d7b8ff',
      // Yellow_Circle.Group 1.Stroke 1
      'assets.3.layers.6.shapes.0.it.1.c.k': '#fff937',
      // Orange_Circle.Group 1.Stroke 1
      'assets.3.layers.7.shapes.0.it.1.c.k': '#fd9727',
      // Aqua_Circle.Group 1.Stroke 1
      'assets.3.layers.8.shapes.0.it.1.c.k': '#2cfafe',
      // Pink_Line.Group 1.Stroke 1
      'assets.3.layers.9.shapes.0.it.1.c.k': '#f4faff',
      // Pink_Dot.Group 1.Fill 1
      'assets.3.layers.10.shapes.0.it.1.c.k': '#d7b8ff',
      // Yellow_Line.Group 1.Stroke 1
      'assets.3.layers.11.shapes.0.it.1.c.k': '#f4faff',
      // Yellow_Dot.Group 1.Fill 1
      'assets.3.layers.12.shapes.0.it.1.c.k': '#fff937',
      // Orange_Line.Group 1.Stroke 1
      'assets.3.layers.13.shapes.0.it.1.c.k': '#f4faff',
      // Orange_Dot.Group 1.Fill 1
      'assets.3.layers.14.shapes.0.it.1.c.k': '#fd9727',
      // Aqua_line.Group 1.Stroke 1
      'assets.3.layers.15.shapes.0.it.1.c.k': '#f4faff',
      // Aqua_Dot.Group 1.Fill 1
      'assets.3.layers.16.shapes.0.it.1.c.k': '#2cfafe',
      // Title_line.Group 1.Stroke 1
      'assets.3.layers.17.shapes.0.it.1.c.k': '#5a91ff',
      // Block_Blue.Group 1.Fill 1
      'assets.3.layers.18.shapes.0.it.1.c.k': '#2b66ec',
      // Block_Blue.Group 2.Fill 1
      'assets.3.layers.18.shapes.1.it.1.c.k': '#000000',
      // Block_Blue_Shadow.Group 1.Fill 1
      'assets.3.layers.19.shapes.0.it.1.c.k': '#000000',
      // BG color.Group 1.Fill 1
      'assets.3.layers.20.shapes.0.it.1.c.k': '#171733',
      // Wijzer.Shape 1.Stroke 1
      'assets.4.layers.0.shapes.0.it.1.c.k': '#171733',
      // Wijzer_mid.Ellipse 1.Stroke 1
      'assets.4.layers.1.shapes.0.it.1.c.k': '#000000',
      // Wijzer_mid.Ellipse 1.Fill 1
      'assets.4.layers.1.shapes.0.it.2.c.k': '#171733',
      // TV.Page-1.TV.TV Screen.Group 1.Fill 1
      'layers.0.shapes.0.it.0.it.0.it.0.it.2.c.k': borderColor,
      // TV.TV foot.Group 1.Rectangle-5.Fill 1
      'layers.0.shapes.1.it.0.it.1.it.1.c.k': '#101013',
      // TV.Group 1.Fill 1
      'layers.0.shapes.2.it.1.c.k': footerColor,
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(TelevisionSlideshowAnimation);
