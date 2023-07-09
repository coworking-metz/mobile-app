import Animated, { interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { theme } from '@/helpers/colors';

const DOT_SIZE = 12;

const PaginationDot = ({
  animationValue,
  index,
  containerWidth,
}: {
  index: number;
  animationValue: Animated.SharedValue<number>;
  containerWidth: number;
}) => {
  const inputRange = [
    (index - 1) * containerWidth,
    index * containerWidth,
    (index + 1) * containerWidth,
  ];
  const animatedStyles = useAnimatedStyle(() => {
    const colour = interpolateColor(
      animationValue.value,
      inputRange,
      [theme.silverSand, '#C27803', theme.charlestonGreen], // TODO: fix crash when using tw.color
      'RGB',
    );

    const expand = interpolate(
      animationValue.value,
      inputRange,
      [DOT_SIZE, DOT_SIZE * 3, DOT_SIZE],
      'clamp',
    );

    return {
      width: expand,
      backgroundColor: colour,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          marginRight: (DOT_SIZE / 3) * 2,
        },
        animatedStyles,
      ]}
    />
  );
};

export default PaginationDot;
