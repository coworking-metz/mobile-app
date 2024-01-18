import TouchableScale, { type TouchableScaleProps } from '@jonny/touchable-scale';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import React, { forwardRef, useCallback, type ForwardRefRenderFunction } from 'react';

const AppTouchableScale: ForwardRefRenderFunction<typeof TouchableScale, TouchableScaleProps> = (
  { children, onPress, ...props },
  ref,
) => {
  const vibrateOnPress = useCallback(() => {
    impactAsync(ImpactFeedbackStyle.Light);
    return onPress?.();
  }, [onPress]);

  return (
    // @ts-ignore
    <TouchableScale innerRef={ref} onPress={vibrateOnPress} {...props}>
      {children}
    </TouchableScale>
  );
};

export default forwardRef(AppTouchableScale);
