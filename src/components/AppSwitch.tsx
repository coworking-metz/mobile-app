import React, { useEffect } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

// track w-[42px] minus p-0.5 on both sides minus size-5 thumb
const THUMB_TRAVEL = 42 - 2 * 2 - 20;

export type AppSwitchProps = {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AppSwitch = ({ value = false, onValueChange, disabled, style }: AppSwitchProps) => {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.77, 0, 0.175, 1),
    });
  }, [value, progress]);

  const offColor = (tw.prefixMatch('dark') ? tw.color('zinc-700') : tw.color('gray-500')) as string;
  const disabledColor = (
    tw.prefixMatch('dark') ? tw.color('zinc-700/50') : tw.color('gray-300')
  ) as string;

  const trackStyle = useAnimatedStyle(
    () => ({
      backgroundColor: disabled
        ? disabledColor
        : interpolateColor(progress.value, [0, 1], [offColor, theme.meatBrown]),
    }),
    [disabled, offColor, disabledColor],
  );

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ disabled, checked: value }}
      disabled={disabled}
      hitSlop={{ top: 12, bottom: 12, left: 3, right: 3 }}
      style={style}
      onPress={() => onValueChange?.(!value)}>
      <Animated.View style={[tw`h-6 w-[42px] justify-center rounded-full p-0.5`, trackStyle]}>
        <Animated.View
          style={[tw`size-5 rounded-full bg-white`, disabled && tw`opacity-75`, thumbStyle]}
        />
      </Animated.View>
    </Pressable>
  );
};

export default AppSwitch;
