import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import MeetingRoom from '@/assets/animations/meeting-room.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const MeetingRoomAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorScheme = useColorScheme();
  const colorizedSource = useMemo(() => {
    const isDark = colorScheme === 'dark';
    const backgroundColor = (isDark ? tw.color('zinc-900') : tw.color('white')) as string;
    return colouriseLottie(MeetingRoom, {
      // // Message.Message.Fill 1
      // "layers.0.shapes.0.it.1.c.k": "#ffbe3d",
      // // Boy Head.Group 1.Fill 1
      // "layers.1.shapes.0.it.1.c.k": "#ebad92",
      // // Boy Head.Group 2.Fill 1
      // "layers.1.shapes.1.it.1.c.k": "#a55d46",
      // // Boy Head.Group 3.Fill 1
      // "layers.1.shapes.2.it.1.c.k": "#93513f",
      // // Boy Head.Group 4.Fill 1
      // "layers.1.shapes.3.it.1.c.k": "#ebad92",
      // // Boy Wrist Left.Group 1.Fill 1
      // "layers.2.shapes.0.it.1.c.k": "#c7d8f2",
      // // Boy Wrist Left.Group 2.Fill 1
      // "layers.2.shapes.1.it.1.c.k": "#ffffff",
      // // Boy hand left.Boy hand left.Fill 1
      // "layers.3.shapes.0.it.1.c.k": "#fab090",
      // // Boy Sholder left.Group 1.Fill 1
      // "layers.4.shapes.0.it.1.c.k": "#c7d8f2",
      // // Boy Sholder left.Group 2.Group 1.Fill 1
      // "layers.4.shapes.1.it.0.it.1.c.k": "#ffffff",
      // // Boy Chair.Group 1.Fill 1
      // "layers.5.shapes.0.it.1.c.k": "#ffbe3d",
      // // Boy Chair.Group 2.Fill 1
      // "layers.5.shapes.1.it.1.c.k": "#4da5dc",
      // // Boy Chair.Group 3.Fill 1
      // "layers.5.shapes.2.it.1.c.k": "#003783",
      // // Boy Chair.Group 4.Fill 1
      // "layers.5.shapes.3.it.1.c.k": "#0046a6",
      // // Boy Chair.Group 5.Fill 1
      // "layers.5.shapes.4.it.1.c.k": "#001e46",
      // // Boy Chair.Group 6.Fill 1
      // "layers.5.shapes.5.it.1.c.k": "#00357f",
      // // Boy Chair.Group 7.Fill 1
      // "layers.5.shapes.6.it.1.c.k": "#002a65",
      // // Boy Chair.Group 8.Fill 1
      // "layers.5.shapes.7.it.1.c.k": "#002f71",
      // // Boy Chair.Group 9.Fill 1
      // "layers.5.shapes.8.it.1.c.k": "#00265a",
      // // Boy Chair.Group 10.Fill 1
      // "layers.5.shapes.9.it.1.c.k": "#001e46",
      // // Boy Chair.Group 11.Fill 1
      // "layers.5.shapes.10.it.1.c.k": "#00357f",
      // // Boy Chair.Group 12.Fill 1
      // "layers.5.shapes.11.it.1.c.k": "#002a65",
      // // Boy Chair.Group 13.Fill 1
      // "layers.5.shapes.12.it.1.c.k": "#002f71",
      // // Boy Chair.Group 14.Fill 1
      // "layers.5.shapes.13.it.1.c.k": "#00265a",
      // // Boy Chair.Group 15.Fill 1
      // "layers.5.shapes.14.it.1.c.k": "#001e46",
      // // Boy Chair.Group 16.Fill 1
      // "layers.5.shapes.15.it.1.c.k": "#00357f",
      // // Boy Chair.Group 17.Fill 1
      // "layers.5.shapes.16.it.1.c.k": "#002a65",
      // // Boy Chair.Group 18.Fill 1
      // "layers.5.shapes.17.it.1.c.k": "#002f71",
      // // Boy Chair.Group 19.Fill 1
      // "layers.5.shapes.18.it.1.c.k": "#00265a",
      // // Boy Body.Group 1.Group 1.Fill 1
      // "layers.6.shapes.0.it.0.it.1.c.k": "#ffffff",
      // // Boy Body.Group 1.Group 2.Fill 1
      // "layers.6.shapes.0.it.1.it.1.c.k": "#53b7af",
      // // Boy Body.Group 1.Group 3.Fill 1
      // "layers.6.shapes.0.it.2.it.1.c.k": "#58affb",
      // // Boy Body.Group 2.Fill 1
      // "layers.6.shapes.1.it.1.c.k": "#ebad92",
      // // Boy Leg.Group 1.Fill 1
      // "layers.7.shapes.0.it.1.c.k": "#6d7b93",
      // // Boy Leg.Group 2.Group 1.Fill 1
      // "layers.7.shapes.1.it.0.it.1.c.k": "#616d7f",
      // // Boy Leg.Group 2.Group 2.Group 1.Fill 1
      // "layers.7.shapes.1.it.1.it.0.it.1.c.k": "#382747",
      // // Boy Leg.Group 2.Group 2.Group 2.Fill 1
      // "layers.7.shapes.1.it.1.it.1.it.1.c.k": "#94a3c0",
      // // Boy Leg.Group 3.Group 1.Fill 1
      // "layers.7.shapes.2.it.0.it.1.c.k": "#382747",
      // // Boy Leg.Group 3.Group 2.Fill 1
      // "layers.7.shapes.2.it.1.it.1.c.k": "#94a3c0",
      // // Boy Sholder Right.Group 1.Fill 1
      // "layers.8.shapes.0.it.1.c.k": "#c7d8f2",
      // // Boy Sholder Right.Group 2.Fill 1
      // "layers.8.shapes.1.it.1.c.k": "#ffffff",
      // // Boy Wrist Right.Group 1.Fill 1
      // "layers.9.shapes.0.it.1.c.k": "#c7d8f2",
      // // Boy Wrist Right.Group 2.Fill 1
      // "layers.9.shapes.1.it.1.c.k": "#ffffff",
      // // Boy Hand Right.Group 1.Fill 1
      // "layers.10.shapes.0.it.1.c.k": "#ffb697",
      // // Boy Hand Right.Group 2.Fill 1
      // "layers.10.shapes.1.it.1.c.k": "#f4a88d",
      // // Girl Front Hair.Girl Front Hair.Fill 1
      // "layers.11.shapes.0.it.1.c.k": "#58545c",
      // // Girl head.Girl head.Fill 1
      // "layers.12.shapes.0.it.1.c.k": "#ebad92",
      // // Girl Neck.Girl Neck.Fill 1
      // "layers.13.shapes.0.it.1.c.k": "#ebad92",
      // // Girl Hand Right.Girl Hand Right.Fill 1
      // "layers.14.shapes.0.it.1.c.k": "#ebad92",
      // // Girl Wrist Right.Girl Wrist Right.Fill 1
      // "layers.15.shapes.0.it.1.c.k": "#ebad92",
      // // Girl Sholder Right.Girl Sholder Right.Fill 1
      // "layers.16.shapes.0.it.1.c.k": "#ee428c",
      // // Girl Tablate.Group 1.Fill 1
      // "layers.17.shapes.0.it.1.c.k": "#eaeeee",
      // // Girl Tablate.Group 2.Fill 1
      // "layers.17.shapes.1.it.1.c.k": "#a7a7a7",
      // // Girl Tablate.Group 3.Fill 1
      // "layers.17.shapes.2.it.1.c.k": "#e2edff",
      // // Laptop.LED.Group 1.Fill 1
      // "layers.18.shapes.0.it.0.it.1.c.k": "#e2edff",
      // // Laptop.LED.Group 2.Fill 1
      // "layers.18.shapes.0.it.1.it.1.c.k": "#eaeeee",
      // // Laptop.LED.Group 3.Fill 1
      // "layers.18.shapes.0.it.2.it.1.c.k": "#a7a7a7",
      // // Laptop.Body Part.Group 1.Fill 1
      // "layers.18.shapes.1.it.0.it.1.c.k": "#b8c9f5",
      // // Laptop.Body Part.Group 2.Fill 1
      // "layers.18.shapes.1.it.1.it.1.c.k": "#a7a7a7",
      // // Laptop.Body Part.Group 3.Fill 1
      // "layers.18.shapes.1.it.2.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 1.Fill 1
      // "layers.19.shapes.0.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 2.Fill 1
      // "layers.19.shapes.1.it.1.c.k": "#507930",
      // // Puzzle 2.Group 3.Fill 1
      // "layers.19.shapes.2.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 4.Fill 1
      // "layers.19.shapes.3.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 5.Fill 1
      // "layers.19.shapes.4.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 6.Fill 1
      // "layers.19.shapes.5.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 7.Fill 1
      // "layers.19.shapes.6.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 8.Fill 1
      // "layers.19.shapes.7.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 9.Fill 1
      // "layers.19.shapes.8.it.1.c.k": "#ebebeb",
      // // Puzzle 2.Group 10.Fill 1
      // "layers.19.shapes.9.it.1.c.k": "#0046a6",
      // // Puzzle 2.Group 11.Fill 1
      // "layers.19.shapes.10.it.3.c.k": "#003783",
      // // Pie.Group 1.Group 1.Fill 1
      // "layers.20.shapes.0.it.0.it.1.c.k": "#d4d9df",
      // // Pie.Group 1.Group 2.Fill 1
      // "layers.20.shapes.0.it.1.it.1.c.k": "#d4d9df",
      // // Pie.Group 1.Group 3.Fill 1
      // "layers.20.shapes.0.it.2.it.1.c.k": "#d4d9df",
      // // Pie.Group 2.Group 1.Fill 1
      // "layers.20.shapes.1.it.0.it.1.c.k": "#ff5668",
      // // Pie.Group 2.Group 2.Fill 1
      // "layers.20.shapes.1.it.1.it.1.c.k": "#cc096a",
      // // Pie.Group 2.Group 3.Fill 1
      // "layers.20.shapes.1.it.2.it.1.c.k": "#ffbe3d",
      // // Pie.Group 2.Group 4.Fill 1
      // "layers.20.shapes.1.it.3.it.1.c.k": "#e2a029",
      // // Pie.Group 2.Group 5.Fill 1
      // "layers.20.shapes.1.it.4.it.1.c.k": "#58affb",
      // // Pie.Group 2.Group 6.Fill 1
      // "layers.20.shapes.1.it.5.it.1.c.k": "#2689fd",
      // // Pie.Group 2.Group 7.Fill 1
      // "layers.20.shapes.1.it.6.it.1.c.k": "#2670d4",
      // // Pie.Group 2.Group 8.Fill 1
      // "layers.20.shapes.1.it.7.it.1.c.k": "#cc096a",
      // // Pie.Group 2.Group 9.Fill 1
      // "layers.20.shapes.1.it.8.it.1.c.k": "#ee2c6a",
      // // Pie.Pie base.Group 1.Fill 1
      // "layers.20.shapes.2.it.0.it.1.c.k": "#ffffff",
      // // Pie.Pie base.Group 2.Fill 1
      // "layers.20.shapes.2.it.1.it.1.c.k": "#0b8e43",
      // //  boy Tablate.Group 1.Fill 1
      // "layers.21.shapes.0.it.1.c.k": "#7ea59b",
      // //  boy Tablate.Group 2.Fill 1
      // "layers.21.shapes.1.it.1.c.k": "#27b292",
      // //  boy Tablate.Group 3.Fill 1
      // "layers.21.shapes.2.it.1.c.k": "#f2f8fd",
      // // Paper with pie.Group 1.Fill 1
      // "layers.22.shapes.0.it.1.c.k": "#2b934e",
      // // Paper with pie.Group 2.Fill 1
      // "layers.22.shapes.1.it.1.c.k": "#e2edff",
      // // Paper with pie.Group 3.Fill 1
      // "layers.22.shapes.2.it.1.c.k": "#ffffff",
      // // Table.Group 1.Fill 1
      // "layers.23.shapes.0.it.1.c.k": "#a6b489",
      // // Table.Group 2.Fill 1
      // "layers.23.shapes.1.it.1.c.k": "#66866b",
      // // Table.Group 3.Fill 1
      // "layers.23.shapes.2.it.1.c.k": "#367969",
      // // Table.Group 4.Fill 1
      // "layers.23.shapes.3.it.1.c.k": "#28643d",
      // // Table.Group 5.Fill 1
      // "layers.23.shapes.4.it.1.c.k": "#586f4e",
      // // Table.Group 6.Fill 1
      // "layers.23.shapes.5.it.1.c.k": "#a6b489",
      // // Table.Group 7.Fill 1
      // "layers.23.shapes.6.it.1.c.k": "#66866b",
      // // Girl Body And Leg.Body.Group 1.Fill 1
      // "layers.24.shapes.0.it.0.it.1.c.k": "#4d2c63",
      // // Girl Body And Leg.Body.Group 2.Fill 1
      // "layers.24.shapes.0.it.1.it.1.c.k": "#cc096a",
      // // Girl Body And Leg.Body.Group 3.Fill 1
      // "layers.24.shapes.0.it.2.it.1.c.k": "#ee428c",
      // // Girl Body And Leg.Thighs.Fill 1
      // "layers.24.shapes.1.it.1.c.k": "#5155d4",
      // // Girl Body And Leg.Leg Left.Group 1.Fill 1
      // "layers.24.shapes.2.it.0.it.1.c.k": "#ff8654",
      // // Girl Body And Leg.Leg Left.Group 2.Fill 1
      // "layers.24.shapes.2.it.1.it.1.c.k": "#ff8654",
      // // Girl Body And Leg.Leg Left.Group 3.Fill 1
      // "layers.24.shapes.2.it.2.it.1.c.k": "#382747",
      // // Girl Body And Leg.Leg Right.Group 1.Fill 1
      // "layers.24.shapes.3.it.0.it.1.c.k": "#ff8654",
      // // Girl Body And Leg.Leg Right.Group 2.Fill 1
      // "layers.24.shapes.3.it.1.it.1.c.k": "#ff8654",
      // // Girl Body And Leg.Leg Right.Group 3.Fill 1
      // "layers.24.shapes.3.it.2.it.1.c.k": "#382747",
      // // Girl Hand Left.Girl Hand Left.Fill 1
      // "layers.25.shapes.0.it.1.c.k": "#ebad92",
      // // Girl Wrist left.Girl Wrist left.Fill 1
      // "layers.26.shapes.0.it.1.c.k": "#ebad92",
      // // Girl Sholder Left.Girl Sholder Left.Fill 1
      // "layers.27.shapes.0.it.1.c.k": "#ee428c",
      // // Girl Chair.Group 1.Fill 1
      // "layers.28.shapes.0.it.1.c.k": "#ffbe3d",
      // // Girl Chair.Group 2.Fill 1
      // "layers.28.shapes.1.it.1.c.k": "#4da5dc",
      // // Girl Chair.Group 3.Fill 1
      // "layers.28.shapes.2.it.1.c.k": "#003783",
      // // Girl Chair.Group 4.Fill 1
      // "layers.28.shapes.3.it.1.c.k": "#0046a6",
      // // Girl Chair.Group 5.Fill 1
      // "layers.28.shapes.4.it.1.c.k": "#001e46",
      // // Girl Chair.Group 6.Fill 1
      // "layers.28.shapes.5.it.1.c.k": "#00357f",
      // // Girl Chair.Group 7.Fill 1
      // "layers.28.shapes.6.it.1.c.k": "#002a65",
      // // Girl Chair.Group 8.Fill 1
      // "layers.28.shapes.7.it.1.c.k": "#002f71",
      // // Girl Chair.Group 9.Fill 1
      // "layers.28.shapes.8.it.1.c.k": "#00265a",
      // // Girl Chair.Group 10.Fill 1
      // "layers.28.shapes.9.it.1.c.k": "#001e46",
      // // Girl Chair.Group 11.Fill 1
      // "layers.28.shapes.10.it.1.c.k": "#00357f",
      // // Girl Chair.Group 12.Fill 1
      // "layers.28.shapes.11.it.1.c.k": "#002a65",
      // // Girl Chair.Group 13.Fill 1
      // "layers.28.shapes.12.it.1.c.k": "#002f71",
      // // Girl Chair.Group 14.Fill 1
      // "layers.28.shapes.13.it.1.c.k": "#00265a",
      // // Girl Chair.Group 15.Fill 1
      // "layers.28.shapes.14.it.1.c.k": "#001e46",
      // // Girl Chair.Group 16.Fill 1
      // "layers.28.shapes.15.it.1.c.k": "#00357f",
      // // Girl Chair.Group 17.Fill 1
      // "layers.28.shapes.16.it.1.c.k": "#002a65",
      // // Girl Chair.Group 18.Fill 1
      // "layers.28.shapes.17.it.1.c.k": "#002f71",
      // // Girl Chair.Group 19.Fill 1
      // "layers.28.shapes.18.it.1.c.k": "#00265a",
      // // Girl Hair Back.Girl Hair Back.Fill 1
      // "layers.29.shapes.0.it.1.c.k": "#4d2c63",
      // // Man Hand Left.Man Hand Left.Fill 1
      // "layers.30.shapes.0.it.1.c.k": "#ebad92",
      // // Man Sholder Left.Man Sholder Left.Fill 1
      // "layers.31.shapes.0.it.1.c.k": "#0b5a48",
      // // Man Wrist left.Man Wrist left.Fill 1
      // "layers.32.shapes.0.it.1.c.k": "#ebad92",
      // // Man Head.Group 1.Fill 1
      // "layers.33.shapes.0.it.1.c.k": "#a0684e",
      // // Man Head.Group 2.Fill 1
      // "layers.33.shapes.1.it.1.c.k": "#a0684e",
      // // Man Head.Group 3.Fill 1
      // "layers.33.shapes.2.it.1.c.k": "#ebad92",
      // // Man Neck.Man Neck.Fill 1
      // "layers.34.shapes.0.it.1.c.k": "#ebad92",
      // // Man Body.Group 1.Fill 1
      // "layers.35.shapes.0.it.1.c.k": "#59540b",
      // // Man Body.Group 2.Fill 1
      // "layers.35.shapes.1.it.1.c.k": "#cfdae4",
      // // Man Body.Group 3.Fill 1
      // "layers.35.shapes.2.it.1.c.k": "#e1e8f2",
      // // Man Body.Group 4.Fill 1
      // "layers.35.shapes.3.it.1.c.k": "#0b5a48",
      // // Man Hand Right.Shape 1.Stroke 1
      // "layers.36.shapes.0.it.0.c.k": "#dcdeed",
      // // Man Hand Right.Shape 1.Fill 1
      // "layers.36.shapes.0.it.1.c.k": "#ebad92",
      // // Man Hand Right.Man Hand Right.Fill 1
      // "layers.36.shapes.1.it.1.c.k": "#ebad92",
      // // Man Wrist Right.Man Wrist Rifht.Fill 1
      // "layers.37.shapes.0.it.1.c.k": "#ebad92",
      // // Man Sholder right.Man Sholder right.Fill 1
      // "layers.38.shapes.0.it.1.c.k": "#0b5a48",
      // // Man Leg Left.Group 1.Fill 1
      // "layers.39.shapes.0.it.1.c.k": "#535e6d",
      // // Man Leg Left.Group 2.Fill 1
      // "layers.39.shapes.1.it.1.c.k": "#636f82",
      // // Man Leg Left.Group 3.Fill 1
      // "layers.39.shapes.2.it.1.c.k": "#382747",
      // // Man Leg Right.leg.Fill 1
      // "layers.40.shapes.0.it.1.c.k": "#535e6d",
      // // Man Leg Right.Group 1.Fill 1
      // "layers.40.shapes.1.it.1.c.k": "#382747",
      // // Pruple Graph.Group 1.Fill 1
      // "layers.42.shapes.0.it.1.c.k": "#7974f5",
      // // Pruple Graph.Group 2.Fill 1
      // "layers.42.shapes.1.it.1.c.k": "#b391ff",
      // // Pruple Graph.Group 3.Fill 1
      // "layers.42.shapes.2.it.1.c.k": "#5b5bd6",
      // // Pink Graph.Group 1.Fill 1
      // "layers.43.shapes.0.it.1.c.k": "#ee2c6a",
      // // Pink Graph.Group 2.Fill 1
      // "layers.43.shapes.1.it.1.c.k": "#ee2c6a",
      // // Pink Graph.Group 3.Fill 1
      // "layers.43.shapes.2.it.1.c.k": "#cc096a",
      // // Blue Graph.Group 1.Fill 1
      // "layers.44.shapes.0.it.1.c.k": "#2689fd",
      // // Blue Graph.Group 2.Fill 1
      // "layers.44.shapes.1.it.1.c.k": "#58affb",
      // // Blue Graph.Group 3.Fill 1
      // "layers.44.shapes.2.it.1.c.k": "#2670d4",
      // // Yellow graph.Group 1.Fill 1
      // "layers.45.shapes.0.it.1.c.k": "#e2a029",
      // // Yellow graph.Group 2.Fill 1
      // "layers.45.shapes.1.it.1.c.k": "#ffbe3d",
      // // Yellow graph.Group 3.Fill 1
      // "layers.45.shapes.2.it.1.c.k": "#ce7c56",
      // // Line4.Rectangle 1.Stroke 1
      // "layers.46.shapes.0.it.1.c.k": "#dcdeed",
      // // Line4.Rectangle 1.Fill 1
      // "layers.46.shapes.0.it.2.c.k": "#0b5a48",
      // // Line3.Rectangle 1.Stroke 1
      // "layers.47.shapes.0.it.1.c.k": "#dcdeed",
      // // Line3.Rectangle 1.Fill 1
      // "layers.47.shapes.0.it.2.c.k": "#0b5a48",
      // // Line2.Rectangle 1.Stroke 1
      // "layers.48.shapes.0.it.1.c.k": "#dcdeed",
      // // Line2.Rectangle 1.Fill 1
      // "layers.48.shapes.0.it.2.c.k": "#0b5a48",
      // // Line1.Rectangle 1.Stroke 1
      // "layers.49.shapes.0.it.1.c.k": "#dcdeed",
      // // Line1.Rectangle 1.Fill 1
      // "layers.49.shapes.0.it.2.c.k": "#0b5a48",
      // // Graph dot.Group 1.Group 1.Fill 1
      // "layers.50.shapes.0.it.0.it.1.c.k": "#ffbe3d",
      // // Graph dot.Group 2.Group 1.Fill 1
      // "layers.50.shapes.1.it.0.it.1.c.k": "#a7a7a7",
      // // Graph line.Graph line.Stroke 1
      // "layers.51.shapes.0.it.2.c.k": "#fdfdfd",
      // // Tab.Group 1.Fill 1
      // "layers.52.shapes.0.it.1.c.k": "#a6b489",
      // // Tab.Group 2.Fill 1
      // "layers.52.shapes.1.it.1.c.k": "#6a8339",
      // // Tab.Group 3.Fill 1
      // "layers.52.shapes.2.it.1.c.k": "#6a8339",
      // // Shadows.Group 1.Fill 1
      // "layers.53.shapes.0.it.1.c.k": "#6d7988",
      // // Shadows.Group 2.Fill 1
      // "layers.53.shapes.1.it.1.c.k": "#6d7988",
      // // Shadows.Group 3.Fill 1
      // "layers.53.shapes.2.it.1.c.k": "#6d7988",
    });
  }, [colorScheme]);

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(MeetingRoomAnimation);
