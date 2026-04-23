import { useColorScheme } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { theme } from '@/helpers/colors';

const DOT_SIZE = 12;
const ACTIVE_DOT_COLOR = '#C27803';
const LIGHT_INACTIVE_DOT_COLOR = theme.silverSand;
const DARK_INACTIVE_DOT_COLOR = theme.charlestonGreen;

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
        ? [DARK_INACTIVE_DOT_COLOR, ACTIVE_DOT_COLOR, LIGHT_INACTIVE_DOT_COLOR]
        : [LIGHT_INACTIVE_DOT_COLOR, ACTIVE_DOT_COLOR, DARK_INACTIVE_DOT_COLOR],
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
