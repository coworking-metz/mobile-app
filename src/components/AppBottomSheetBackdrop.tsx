import { type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  AnimatedProps,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import tw from 'twrnc';

const AppBottomSheetBackdrop = ({
  animatedIndex,
  style,
  onTouch,
  ...props
}: BottomSheetBackdropProps & AnimatedProps<ViewProps> & { onTouch?: () => void }) => {
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

  return (
    <Animated.View style={[tw`absolute z-10`, containerStyle]} onTouchEnd={onTouch} {...props} />
  );
};

export default AppBottomSheetBackdrop;
