import TouchableScale, { type TouchableScaleProps } from '@jonny/touchable-scale';
import React, { forwardRef, type ForwardRefRenderFunction } from 'react';

const AppTouchableScale: ForwardRefRenderFunction<typeof TouchableScale, TouchableScaleProps> = (
  { children, onPress, ...props },
  ref,
) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <TouchableScale innerRef={ref} onPress={onPress} {...props}>
      {children}
    </TouchableScale>
  );
};

export default forwardRef(AppTouchableScale);
