import { isNil } from 'lodash';
import { Children, cloneElement, type ReactNode, useMemo, useState } from 'react';
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
  actionHeight,
  contentContainerStyle,
}: {
  children: React.ReactNode;
  animationValue: SharedValue<number>;
  actionHeight?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) => {
  const [scrollContainerHeight, setScrollContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

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
        containerHeight: scrollContainerHeight - (actionHeight ?? 0),
      });
    });
  }, [children, scrollContainerHeight, actionHeight]);

  const paddingBottom = useMemo(() => {
    if (
      !actionHeight ||
      !contentHeight ||
      !scrollContainerHeight ||
      contentHeight <= scrollContainerHeight - actionHeight
    )
      return null;
    return Math.min(contentHeight - (scrollContainerHeight - actionHeight), actionHeight) + 16;
  }, [actionHeight, contentHeight, scrollContainerHeight]);

  return (
    <View style={tw`absolute h-full w-full`}>
      <Animated.ScrollView
        contentContainerStyle={[
          tw`pt-4 max-w-md w-full mx-auto`,
          contentContainerStyle,
          !isNil(paddingBottom) ? { paddingBottom } : tw`pb-4`,
        ]}
        horizontal={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(width, height) => {
          setContentHeight(height);
        }}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setScrollContainerHeight(nativeEvent.layout.height)
        }>
        <Animated.View style={[maskStyle, tw`absolute h-full w-full`]} />
        {clonedChildren}
      </Animated.ScrollView>
    </View>
  );
};

export default Step;
