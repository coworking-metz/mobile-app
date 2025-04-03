import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import React, { forwardRef, useCallback, type ForwardRefRenderFunction } from 'react';
import {
  type GestureResponderEvent,
  Platform,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

export type AppTouchableRef = typeof TouchableOpacity;

const AppTouchable: ForwardRefRenderFunction<typeof TouchableOpacity, TouchableOpacityProps> = (
  { children, onPress, ...props },
  ref,
) => {
  const onTouch = useCallback(
    (event: GestureResponderEvent) => {
      if (Platform.OS === 'ios') {
        // only for iOS because Android vibration is too loud
        impactAsync(ImpactFeedbackStyle.Light);
      }
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

export default forwardRef(AppTouchable);
