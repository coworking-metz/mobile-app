import { StyleProp, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const DOT_SIZE = 12;
const EXPANDED_DOT_SIZE = DOT_SIZE * 3;
const MARGIN = (DOT_SIZE / 3) * 2;
const ACTIVE_DOT_COLOR = '#C27803';
const LIGHT_INACTIVE_DOT_COLOR = theme.silverSand;
const DARK_INACTIVE_DOT_COLOR = theme.charlestonGreen;
const LIGHT_COLOR_RANGE = [LIGHT_INACTIVE_DOT_COLOR, ACTIVE_DOT_COLOR, LIGHT_INACTIVE_DOT_COLOR];
const PROGRESSIVE_LIGHT_COLOR_RANGE = [
  LIGHT_INACTIVE_DOT_COLOR,
  ACTIVE_DOT_COLOR,
  DARK_INACTIVE_DOT_COLOR,
];
const DARK_COLOR_RANGE = [DARK_INACTIVE_DOT_COLOR, ACTIVE_DOT_COLOR, DARK_INACTIVE_DOT_COLOR];
const PROGRESSIVE_DARK_COLOR_RANGE = [
  DARK_INACTIVE_DOT_COLOR,
  ACTIVE_DOT_COLOR,
  LIGHT_INACTIVE_DOT_COLOR,
];

const PaginationDot = ({
  index,
  progressive = false,
  animationValue,
}: {
  index: number;
  progressive?: boolean;
  animationValue: SharedValue<number>;
}) => {
  const colorScheme = useColorScheme();
  const inputRange = [index - 1, index, index + 1];

  const sizeInputRange = [index - 3, index - 2, index - 1, index, index + 1, index + 2, index + 3];

  const animatedStyles = useAnimatedStyle(() => {
    const isDark = colorScheme === 'dark';
    const color = interpolateColor(
      animationValue.value,
      inputRange,
      isDark
        ? progressive
          ? PROGRESSIVE_DARK_COLOR_RANGE
          : DARK_COLOR_RANGE
        : progressive
          ? PROGRESSIVE_LIGHT_COLOR_RANGE
          : LIGHT_COLOR_RANGE,
      'RGB',
    );

    const width = interpolate(
      animationValue.value,
      sizeInputRange,
      [DOT_SIZE, DOT_SIZE, DOT_SIZE, EXPANDED_DOT_SIZE, DOT_SIZE, DOT_SIZE, DOT_SIZE],
      'clamp',
    );

    const right = interpolate(
      animationValue.value,
      sizeInputRange,
      [
        0,
        (DOT_SIZE + MARGIN) * 1,
        (DOT_SIZE + MARGIN) * 2,
        (DOT_SIZE + MARGIN) * 3,
        (DOT_SIZE + MARGIN) * 3 + EXPANDED_DOT_SIZE + MARGIN,
        (DOT_SIZE + MARGIN) * 4 + EXPANDED_DOT_SIZE + MARGIN,
        (DOT_SIZE + MARGIN) * 5 + EXPANDED_DOT_SIZE + MARGIN,
      ],
      'clamp',
    );

    const opacity = interpolate(
      animationValue.value,
      sizeInputRange,
      [0, 0.5, 1, 1, 1, 0.5, 0],
      'clamp',
    );

    return {
      right,
      opacity,
      width,
      backgroundColor: color,
    };
  }, [colorScheme, progressive]);

  return (
    <Animated.View
      style={[
        tw`absolute`,
        {
          right: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
        },
        animatedStyles,
      ]}
    />
  );
};

const CarouselPaginationDots = ({
  count = 0,
  offset,
  progressive = false,
  style,
}: {
  count: number;
  offset: SharedValue<number>;
  progressive?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      pointerEvents={'none'}
      style={[
        tw`relative flex flex-row`,
        { width: (DOT_SIZE + MARGIN) * 6 + EXPANDED_DOT_SIZE, height: DOT_SIZE },
        style,
      ]}>
      {Array.from({ length: count }, (_, index) => (
        <PaginationDot
          animationValue={offset}
          index={index}
          key={`pagination-dot-${index}`}
          progressive={progressive}
        />
      ))}
    </View>
  );
};

export default CarouselPaginationDots;
