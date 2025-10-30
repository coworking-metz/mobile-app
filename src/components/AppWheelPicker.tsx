import WheelPicker, { PickerItem, WheelPickerProps } from '@quidone/react-native-wheel-picker';
import React from 'react';

const AppWheelPicker = (props: WheelPickerProps<PickerItem<number | string>>) => {
  return <WheelPicker {...props} />;
};

export default AppWheelPicker;
