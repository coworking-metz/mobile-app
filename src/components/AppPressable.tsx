import React, { forwardRef, useCallback, type ForwardRefRenderFunction } from 'react';
import {
  TouchableOpacity,
  type GestureResponderEvent,
  type TouchableOpacityProps,
} from 'react-native';
import { HapticFeedbackType, vibrate } from '@/helpers/haptics';

export type AppPressableRef = typeof TouchableOpacity;

const AppPressable: ForwardRefRenderFunction<typeof TouchableOpacity, TouchableOpacityProps> = (
  { children, onPress, ...props },
  ref,
) => {
  const onTouch = useCallback(
    (event: GestureResponderEvent) => {
      vibrate(HapticFeedbackType.Light);
      return onPress?.(event);
    },
    [onPress],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <TouchableOpacity ref={ref} onPress={onTouch} {...props}>
      {children}
    </TouchableOpacity>
  );
};

export default forwardRef(AppPressable);
