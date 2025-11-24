import LottieView, { type LottieViewProps } from 'lottie-react-native';
import { forwardRef, type ForwardRefRenderFunction, useMemo } from 'react';
import PeopleMeeting from '@/assets/animations/people-meeting.json';
import AppLottieView from '@/components/AppLottieView';
import { colouriseLottie } from '@/helpers/colors';

type AnimationProps = Omit<LottieViewProps, 'source'>;

const PeopleMeetingAnimation: ForwardRefRenderFunction<LottieView, AnimationProps> = (
  props,
  ref,
) => {
  const colorizedSource = useMemo(
    () =>
      colouriseLottie(PeopleMeeting, {
        // Man 1 - Palm - 01.Group 1.Fill 1
        'layers.3.shapes.0.it.1.c.k': '#fbccb3',
        // Man 1 - Face - 01.Group 2.Fill 1
        'layers.4.shapes.0.it.1.c.k': '#fbccb3',
        // Man 1 - Hair - 01.Group 3.Fill 1
        'layers.5.shapes.0.it.1.c.k': '#544947',
        // Man 1 - Chair - 02.Group 4.Fill 1
        'layers.6.shapes.0.it.1.c.k': '#ffcf5b',
        // Man 1 - Palm - 02.Group 5.Fill 1
        'layers.7.shapes.0.it.1.c.k': '#fbccb3',
        // Man 1 - Hand - 01.Group 7.Fill 1
        'layers.8.shapes.0.it.1.c.k': '#378e43',
        // Man 1 - Hand - 02.Group 6.Fill 1
        'layers.9.shapes.0.it.1.c.k': '#378e43',
        // Man 1 - Chair - 01.Group 8.Fill 1
        'layers.10.shapes.0.it.1.c.k': '#f7b34c',
        // Man 2 - Palm - 01.Group 1.Fill 1
        'layers.12.shapes.0.it.1.c.k': '#fbccb3',
        // Man 2 - Face - 01.Group 2.Fill 1
        'layers.13.shapes.0.it.1.c.k': '#fbccb3',
        // Man 2 - Hair - 01.Group 3.Fill 1
        'layers.14.shapes.0.it.1.c.k': '#544947',
        // Man 2 - Chair - 02.Group 4.Fill 1
        'layers.15.shapes.0.it.1.c.k': '#ffcf5b',
        // Man 2 - Palm - 02.Group 5.Fill 1
        'layers.16.shapes.0.it.1.c.k': '#fbccb3',
        // Man 2 - Hand - 02.Group 6.Fill 1
        'layers.17.shapes.0.it.1.c.k': '#1b86c8',
        // Man 2 - Hand - 01.Group 7.Fill 1
        'layers.18.shapes.0.it.1.c.k': '#1b86c8',
        // Man 2 - Chair - 01.Group 8.Fill 1
        'layers.19.shapes.0.it.1.c.k': '#f7b34c',
        // Man 3 - Palm - 01.Group 1.Fill 1
        'layers.21.shapes.0.it.1.c.k': '#fbccb3',
        // Man 3 - Face - 01.Group 2.Fill 1
        'layers.22.shapes.0.it.1.c.k': '#fbccb3',
        // Man 3 - Hair - 01.Group 3.Fill 1
        'layers.23.shapes.0.it.1.c.k': '#544947',
        // Man 3 - Chair - 02.Group 4.Fill 1
        'layers.24.shapes.0.it.1.c.k': '#ffcf5b',
        // Man 3 - Palm - 02.Group 5.Fill 1
        'layers.25.shapes.0.it.1.c.k': '#fbccb3',
        // Man 3 - Hand - 01.Group 6.Fill 1
        'layers.26.shapes.0.it.1.c.k': '#f7bad5',
        // Man 3 - Hand - 02.Group 7.Fill 1
        'layers.27.shapes.0.it.1.c.k': '#f7bad5',
        // Man 3 - Chair - 01.Group 8.Fill 1
        'layers.28.shapes.0.it.1.c.k': '#f7b34c',
        // Man 4 - Palm - 02.Group 1.Fill 1
        'layers.30.shapes.0.it.1.c.k': '#fbccb3',
        // Man 4 - Face - 01.Group 2.Fill 1
        'layers.31.shapes.0.it.1.c.k': '#fbccb3',
        // Man 4 - Hair - 01.Group 3.Fill 1
        'layers.32.shapes.0.it.1.c.k': '#544947',
        // Man 4 - Chair - 02.Group 4.Fill 1
        'layers.33.shapes.0.it.1.c.k': '#ffcf5b',
        // Man 4 - Palm - 01.Group 5.Fill 1
        'layers.34.shapes.0.it.1.c.k': '#fbccb3',
        // Man 4 - Hand - 01.Group 6.Fill 1
        'layers.35.shapes.0.it.1.c.k': '#066497',
        // Man 4 - Hand - 02.Group 7.Fill 1
        'layers.36.shapes.0.it.1.c.k': '#066497',
        // Man 4 - Chair - 01.Group 8.Fill 1
        'layers.37.shapes.0.it.1.c.k': '#f7b34c',
        // Man 5 - Palm - 01.Group 1.Fill 1
        'layers.39.shapes.0.it.1.c.k': '#fbccb3',
        // Man 5 - Face - 01.Group 2.Fill 1
        'layers.40.shapes.0.it.1.c.k': '#fbccb3',
        // Man 5 - Hair - 01.Group 3.Fill 1
        'layers.41.shapes.0.it.1.c.k': '#544947',
        // Man 5 - Chair - 02.Group 4.Fill 1
        'layers.42.shapes.0.it.1.c.k': '#ffcf5b',
        // Man 5 - Palm - 02.Group 5.Fill 1
        'layers.43.shapes.0.it.1.c.k': '#fbccb3',
        // Man 5 - Hand - 01.Group 6.Fill 1
        'layers.44.shapes.0.it.1.c.k': '#0495a5',
        // Man 5 - Hand - 02.Group 7.Fill 1
        'layers.45.shapes.0.it.1.c.k': '#0495a5',
        // Man 5 - Chair - 01.Group 8.Fill 1
        'layers.46.shapes.0.it.1.c.k': '#f7b34c',
        // Calculator Highlight - 08.Group 3.Fill 1
        'layers.47.shapes.0.it.1.c.k': '#868686',
        // Calculator Highlight - 06.Group 4.Fill 1
        'layers.48.shapes.0.it.1.c.k': '#868686',
        // Calculator Button - 02.Group 5.Fill 1
        'layers.49.shapes.0.it.1.c.k': '#626363',
        // Calculator Button - 01.Group 6.Fill 1
        'layers.50.shapes.0.it.1.c.k': '#626363',
        // Calculator Highlight - 07.Group 7.Fill 1
        'layers.51.shapes.0.it.1.c.k': '#868686',
        // Calculator Button - 07.Group 8.Fill 1
        'layers.52.shapes.0.it.1.c.k': '#626363',
        // Calculator Highlight - 05.Group 9.Fill 1
        'layers.53.shapes.0.it.1.c.k': '#868686',
        // Calculator 11.Group 10.Fill 1
        'layers.54.shapes.0.it.1.c.k': '#626363',
        // Calculator Highlight - 03.Group 1.Fill 1
        'layers.55.shapes.0.it.1.c.k': '#868686',
        // Calculator Button - 03.Group 2.Fill 1
        'layers.56.shapes.0.it.1.c.k': '#626363',
        // Calculator Highlight - 04.Group 11.Fill 1
        'layers.57.shapes.0.it.1.c.k': '#868686',
        // Calculator Button - 06.Group 12.Fill 1
        'layers.58.shapes.0.it.1.c.k': '#626363',
        // Calculator Highlight - 02.Group 13.Fill 1
        'layers.59.shapes.0.it.1.c.k': '#868686',
        // Calculator Button - 04.Group 14.Fill 1
        'layers.60.shapes.0.it.1.c.k': '#626363',
        // Calculator Highlight - 01.Group 15.Fill 1
        'layers.61.shapes.0.it.1.c.k': '#868686',
        // Calculator Button - 05.Group 16.Fill 1
        'layers.62.shapes.0.it.1.c.k': '#626363',
        // Screen - 01.Group 17.Fill 1
        'layers.63.shapes.0.it.1.c.k': '#aeb336',
        // Calculator 2.Group 18.Fill 1
        'layers.64.shapes.0.it.1.c.k': '#dfdfdf',
        // Coffie cup 07.Group 2.Fill 1
        'layers.65.shapes.0.it.1.c.k': '#533318',
        // Coffie cup 07.Group 3.Fill 1
        'layers.65.shapes.1.it.3.c.k': '#dbdbde',
        // Coffie cup 06.Group 3.Fill 1
        'layers.66.shapes.0.it.3.c.k': '#dbdbde',
        // Coffie cup 06.Group 4.Fill 1
        'layers.66.shapes.1.it.1.c.k': '#dadadc',
        // Coffie Cup - 06.Group 2.Fill 1
        'layers.67.shapes.0.it.1.c.k': '#533318',
        // Coffie Cup - 05.Group 3.Fill 1
        'layers.68.shapes.0.it.3.c.k': '#dbdbde',
        // Coffie Cup - 05.Group 4.Fill 1
        'layers.68.shapes.1.it.1.c.k': '#dadadc',
        // Coffie Cup - 09.Group 1.Fill 1
        'layers.69.shapes.0.it.1.c.k': '#dbdbde',
        // Coffie Cup - 09.Group 2.Fill 1
        'layers.69.shapes.1.it.1.c.k': '#533318',
        // Coffie Cup - 01.Group 1.Fill 1
        'layers.70.shapes.0.it.1.c.k': '#dbdbde',
        // Coffie Cup - 01.Group 3.Fill 1
        'layers.70.shapes.1.it.3.c.k': '#dbdbde',
        // Coffie Cup - 08.Group 2.Fill 1
        'layers.71.shapes.0.it.1.c.k': '#533318',
        // Coffie Cup - 08.Group 3.Fill 1
        'layers.71.shapes.1.it.3.c.k': '#dbdbde',
        // Coffie Cup - 02.Group 1.Fill 1
        'layers.72.shapes.0.it.1.c.k': '#dbdbde',
        // Coffie Cup - 02.Group 3.Fill 1
        'layers.72.shapes.1.it.3.c.k': '#dbdbde',
        // Coffie Cup - 07.Group 2.Fill 1
        'layers.73.shapes.0.it.1.c.k': '#533318',
        // Coffie Cup - 07.Group 3.Fill 1
        'layers.73.shapes.1.it.3.c.k': '#dbdbde',
        // Coffie Cup - 03.Group 1.Fill 1
        'layers.74.shapes.0.it.1.c.k': '#dbdbde',
        // Coffie Cup - 03.Group 2.Fill 1
        'layers.74.shapes.1.it.1.c.k': '#533318',
        // Mobile - 15.Group 1.Fill 1
        'layers.75.shapes.0.it.1.c.k': '#8f8e8d',
        // Mobile - 14.Group 2.Fill 1
        'layers.76.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 13.Group 3.Fill 1
        'layers.77.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 12.Group 4.Fill 1
        'layers.78.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 11.Group 5.Fill 1
        'layers.79.shapes.0.it.1.c.k': '#8f8e8d',
        // Mobile - 10.Group 6.Fill 1
        'layers.80.shapes.0.it.1.c.k': '#ffffff',
        // Mobile - 03.Group 7.Fill 1
        'layers.81.shapes.0.it.1.c.k': '#d6d6d5',
        // Mobile - 21.Group 2.Fill 1
        'layers.82.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 20.Group 3.Fill 1
        'layers.83.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 19.Group 3.Fill 1
        'layers.84.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 18.Group 4.Fill 1
        'layers.85.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 17.Group 5.Fill 1
        'layers.86.shapes.0.it.1.c.k': '#dfdfdd',
        // Mobile - 16.Group 6.Fill 1
        'layers.87.shapes.0.it.1.c.k': '#ffffff',
        // Mobile - 02.Group 7.Fill 1
        'layers.88.shapes.0.it.1.c.k': '#151515',
        // Mobile - 09.Group 1.Fill 1
        'layers.89.shapes.0.it.1.c.k': '#dfdfdd',
        // Mobile - 08.Group 2.Fill 1
        'layers.90.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 07.Group 3.Fill 1
        'layers.91.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 06.Group 4.Fill 1
        'layers.92.shapes.0.it.1.c.k': '#3f4040',
        // Mobile - 05.Group 5.Fill 1
        'layers.93.shapes.0.it.1.c.k': '#dfdfdd',
        // Mobile - 04.Group 6.Fill 1
        'layers.94.shapes.0.it.1.c.k': '#76c7ea',
        // Mobile - 01.Group 7.Fill 1
        'layers.95.shapes.0.it.1.c.k': '#494746',
        // Paper 2 -  Font.Group 1.Fill 1
        'layers.96.shapes.0.it.1.c.k': '#acacac',
        // Paper 2 -  Font.Group 2.Fill 1
        'layers.97.shapes.0.it.1.c.k': '#acacac',
        // Paper 2 -  Font.Group 3.Fill 1
        'layers.98.shapes.0.it.1.c.k': '#acacac',
        // Paper 2 -  Font.Group 4.Fill 1
        'layers.99.shapes.0.it.1.c.k': '#acacac',
        // Paper 2 -  Font.Group 5.Fill 1
        'layers.100.shapes.0.it.1.c.k': '#acacac',
        // Paper 2 -  Font.Group 6.Fill 1
        'layers.101.shapes.0.it.1.c.k': '#acacac',
        // Paper - 02.Group 7.Fill 1
        'layers.102.shapes.0.it.1.c.k': '#ffffff',
        // Paper - 02.Group 1.Fill 1
        'layers.103.shapes.0.it.1.c.k': '#acacac',
        // Paper 1 -  Font.Group 1.Fill 1
        'layers.104.shapes.0.it.1.c.k': '#acacac',
        // Paper 1 -  Font.Group 1.Fill 1
        'layers.105.shapes.0.it.1.c.k': '#acacac',
        // Paper 1 -  Font.Group 1.Fill 1
        'layers.106.shapes.0.it.1.c.k': '#acacac',
        // Paper 1 -  Font.Group 1.Fill 1
        'layers.107.shapes.0.it.1.c.k': '#acacac',
        // Paper 1 -  Font.Group 1.Fill 1
        'layers.108.shapes.0.it.1.c.k': '#acacac',
        // Paper - 01.Group 1.Fill 1
        'layers.109.shapes.0.it.1.c.k': '#ffffff',
        // Paper - 11.Group 1.Fill 1
        'layers.110.shapes.0.it.3.c.k': '#fbccb3',
        // Paper - 11.Group 2.Fill 1
        'layers.110.shapes.1.it.3.c.k': '#fbccb3',
        // Paper - 11.Group 3.Fill 1
        'layers.110.shapes.2.it.3.c.k': '#fbccb3',
        // Paper - 11.Group 4.Fill 1
        'layers.110.shapes.3.it.3.c.k': '#fbccb3',
        // Paper - 12.Group 5.Fill 1
        'layers.111.shapes.0.it.1.c.k': '#acacac',
        // Paper - 12.Group 6.Fill 1
        'layers.111.shapes.1.it.1.c.k': '#acacac',
        // Paper - 12.Group 7.Fill 1
        'layers.111.shapes.2.it.1.c.k': '#acacac',
        // Paper - 12.Group 8.Fill 1
        'layers.111.shapes.3.it.1.c.k': '#acacac',
        // Paper - 10.Group 5.Fill 1
        'layers.112.shapes.0.it.1.c.k': '#acacac',
        // Paper - 10.Group 6.Fill 1
        'layers.112.shapes.1.it.1.c.k': '#acacac',
        // Paper - 10.Group 7.Fill 1
        'layers.112.shapes.2.it.1.c.k': '#acacac',
        // Paper - 10.Group 8.Fill 1
        'layers.112.shapes.3.it.1.c.k': '#acacac',
        // Paper - 10.Group 9.Fill 1
        'layers.112.shapes.4.it.1.c.k': '#ffffff',
        // Paper - 09.Group 9.Fill 1
        'layers.113.shapes.0.it.1.c.k': '#ffffff',
        // Laptop - 03.Group 1.Fill 1
        'layers.114.shapes.0.it.1.c.k': '#64cae2',
        // Laptop - 02.Group 2.Fill 1
        'layers.115.shapes.0.it.1.c.k': '#112228',
        // Laptop - 01.Group 3.Fill 1
        'layers.116.shapes.0.it.1.c.k': '#000000',
        // Table - 02.Group 1.Fill 1
        'layers.117.shapes.0.it.1.c.k': '#bb7d57',
        // Table - 01.Group 2.Fill 1
        'layers.118.shapes.0.it.1.c.k': '#cca084',
      }),
    [],
  );

  return <AppLottieView ref={ref} {...props} source={colorizedSource} />;
};

export default forwardRef(PeopleMeetingAnimation);
