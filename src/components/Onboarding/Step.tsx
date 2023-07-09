import { Children, cloneElement, type ReactNode, useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';

const Step = ({
  animationValue,
  children,
}: {
  index: number;
  children: React.ReactNode;
  animationValue: Animated.SharedValue<number>;
}) => {
  const [scrollContainerHeight, setScrollContainerHeight] = useState(0);
  const verticalScrollProgress = useSharedValue(0);
  const onVerticalScroll = useAnimatedScrollHandler({
    onScroll: ({ layoutMeasurement, contentOffset, contentSize }) => {
      verticalScrollProgress.value =
        contentOffset.y / (contentSize.height - layoutMeasurement.height);
    },
  });

  const faderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(verticalScrollProgress.value, [0, 0.95, 1], [1, 1, 0]);

    return {
      opacity,
    };
  }, [verticalScrollProgress]);

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
        contentContainerStyle={tw`py-4`}
        horizontal={false}
        scrollEventThrottle={16}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setScrollContainerHeight(nativeEvent.layout.height)
        }
        onScroll={onVerticalScroll}>
        <Animated.View style={[maskStyle, tw`absolute h-full w-full`]} />
        {Children.map(children, (el: ReactNode) => {
          return cloneElement(el as never, { containerHeight: scrollContainerHeight });
        })}
      </Animated.ScrollView>
      <Animated.View style={[faderStyle]}>
        <Fader
          visible
          position={Fader.position.BOTTOM}
          size={20}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100')}
        />
      </Animated.View>
    </View>
  );
};

export default Step;
