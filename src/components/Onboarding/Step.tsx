import { Children, cloneElement, type ReactNode, useState } from 'react';
import { type LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import tw from 'twrnc';

const Step = ({
  animationValue,
  children,
  contentContainerStyle,
}: {
  children: React.ReactNode;
  animationValue: SharedValue<number>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) => {
  const [scrollContainerHeight, setScrollContainerHeight] = useState(0);

  const maskStyle = useAnimatedStyle(() => {
    const zIndex = interpolate(animationValue.value, [-1, 0, 1], [300, 0, -300]);

    const maskBackgroundColor = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      ['transparent', 'transparent', 'transparent'],
    );

    return {
      maskBackgroundColor,
      zIndex,
    };
  }, [animationValue]);

  return (
    <View style={tw`absolute h-full w-full`}>
      <Animated.ScrollView
        contentContainerStyle={[tw`py-4 max-w-md w-full mx-auto`, contentContainerStyle]}
        horizontal={false}
        scrollEventThrottle={16}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setScrollContainerHeight(nativeEvent.layout.height)
        }>
        <Animated.View style={[maskStyle, tw`absolute h-full w-full`]} />
        {Children.map(children, (el: ReactNode) => {
          return cloneElement(el as never, { containerHeight: scrollContainerHeight });
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default Step;
