import React from 'react';
import { Switch, SwitchProps } from 'react-native-ui-lib';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const AppSwitch = ({ disabled, ...props }: SwitchProps) => {
  return (
    <Switch
      disabled={disabled}
      disabledColor={tw.prefixMatch('dark') ? tw.color('zinc-700/50') : tw.color('gray-300')}
      offColor={tw.prefixMatch('dark') ? tw.color('zinc-700') : tw.color('gray-500')}
      onColor={theme.meatBrown}
      {...(disabled && { thumbStyle: tw`opacity-75` })}
      {...props}
    />
  );
};

export default AppSwitch;
