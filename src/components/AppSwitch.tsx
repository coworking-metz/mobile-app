import React from 'react';
import { Switch, SwitchProps } from 'react-native-ui-lib';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const AppSwitch = ({ ...props }: SwitchProps) => {
  return (
    <Switch
      offColor={tw.prefixMatch('dark') ? tw.color('zinc-600') : tw.color('gray-600')}
      onColor={theme.meatBrown}
      {...props}
    />
  );
};

export default AppSwitch;
