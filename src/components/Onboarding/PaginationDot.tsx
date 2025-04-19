import { useColorScheme } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { theme } from '@/helpers/colors';

const DOT_SIZE = 12;

const PaginationDot = ({
  animationValue,
  index,
  containerWidth,
}: {
  index: number;
  animationValue: SharedValue<number>;
  containerWidth: number;
}) => {
  const inputRange = [
    (index - 1) * containerWidth,
    index * containerWidth,
    (index + 1) * containerWidth,
  ];
  const colorScheme = useColorScheme();
  const animatedStyles = useAnimatedStyle(() => {
    const isDark = colorScheme === 'dark';
    const colour = interpolateColor(
      animationValue.value,
      inputRange,
      isDark
        ? [theme.charlestonGreen, '#C27803', theme.silverSand]
        : [theme.silverSand, '#C27803', theme.charlestonGreen], // TODO: fix crash when using tw.color
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
  }, [colorScheme]);

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
