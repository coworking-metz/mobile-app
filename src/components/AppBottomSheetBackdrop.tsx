import { type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import tw from 'twrnc';

const AppBottomSheetBackdrop = ({
  animatedIndex,
  style,
  onTouch,
}: BottomSheetBackdropProps & { onTouch?: () => void }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolate.CLAMP),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return <Animated.View style={[tw`z-10`, containerStyle]} onTouchEnd={onTouch} />;
};

export default AppBottomSheetBackdrop;
