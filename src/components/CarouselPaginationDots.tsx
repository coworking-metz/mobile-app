import { View } from 'react-native';
import Animated, {
  type StyleProps,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const DOT_SIZE = 12;
const EXPANDED_DOT_SIZE = DOT_SIZE * 3;
const MARGIN = (DOT_SIZE / 3) * 2;

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

  const sizeInputRange = [
    (index - 3) * containerWidth,
    (index - 2) * containerWidth,
    (index - 1) * containerWidth,
    index * containerWidth,
    (index + 1) * containerWidth,
    (index + 2) * containerWidth,
    (index + 3) * containerWidth,
  ];

  const animatedStyles = useAnimatedStyle(() => {
    const colour = interpolateColor(
      animationValue.value,
      inputRange,
      [theme.silverSand, '#C27803', theme.silverSand],
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
      backgroundColor: colour,
    };
  });

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
  width = 0,
  offset,
  style,
}: {
  count: number;
  width: number;
  offset: SharedValue<number>;
  style?: StyleProps;
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
          containerWidth={width}
          index={index}
          key={`pagination-dot-${index}`}
        />
      ))}
    </View>
  );
};

export default CarouselPaginationDots;
