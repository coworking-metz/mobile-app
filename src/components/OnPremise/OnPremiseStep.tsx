import { Children, cloneElement, type ReactNode, useMemo, useState } from 'react';
import { type LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import tw from 'twrnc';

const OnPremiseStep = ({
  active,
  animationValue,
  children,
  headerHeight,
  contentContainerStyle,
}: {
  active: boolean;
  children: React.ReactNode;
  animationValue: SharedValue<number>;
  headerHeight?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) => {
  const [scrollContainerHeight, setScrollContainerHeight] = useState(0);

  const maskStyle = useAnimatedStyle(() => {
    const zIndex = Math.round(interpolate(animationValue.value, [-1, 0, 1], [300, 0, -300]));

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

  const clonedChildren = useMemo(() => {
    if (!scrollContainerHeight) return null;
    return Children.map(children, (el: ReactNode) => {
      return cloneElement(el as never, {
        containerHeight: scrollContainerHeight - (headerHeight ?? 0),
      });
    });
  }, [children, scrollContainerHeight, headerHeight]);

  return (
    <View pointerEvents={active ? 'auto' : 'none'} style={tw`absolute h-full w-full`}>
      <Animated.ScrollView
        contentContainerStyle={[
          tw`max-w-md w-full mx-auto`,
          contentContainerStyle,
          { paddingTop: headerHeight },
        ]}
        horizontal={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setScrollContainerHeight(nativeEvent.layout.height)
        }>
        <Animated.View style={[maskStyle, tw`absolute h-full w-full`]} />
        {clonedChildren}
      </Animated.ScrollView>
    </View>
  );
};

export default OnPremiseStep;
