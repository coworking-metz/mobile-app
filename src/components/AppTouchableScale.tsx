import TouchableScale, { type TouchableScaleProps } from '@jonny/touchable-scale';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import React, { forwardRef, useCallback, type ForwardRefRenderFunction } from 'react';
import { Platform } from 'react-native';

const AppTouchableScale: ForwardRefRenderFunction<typeof TouchableScale, TouchableScaleProps> = (
  { children, onPress, ...props },
  ref,
) => {
  const onTouch = useCallback(() => {
    if (Platform.OS === 'ios') {
      // only for iOS because Android vibration is too loud
      impactAsync(ImpactFeedbackStyle.Light);
    }
    return onPress?.();
  }, [onPress]);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <TouchableScale innerRef={ref} onPress={onTouch} {...props}>
      {children}
    </TouchableScale>
  );
};

export default forwardRef(AppTouchableScale);
