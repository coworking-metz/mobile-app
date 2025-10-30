import AppBlurView from './AppBlurView';
import { isLiquidGlassSupported, LiquidGlassView } from '@callstack/liquid-glass';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';

const AppGlassView = ({
  children,
  style,
  interactive = false,
  colorScheme,
}: {
  children: React.ReactNode;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
  colorScheme?: 'light' | 'dark';
}) => {
  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView colorScheme={colorScheme} interactive={interactive} style={style}>
        {children}
      </LiquidGlassView>
    );
  }

  return (
    <AppBlurView style={style} type={colorScheme ?? (tw.prefixMatch('dark') ? 'dark' : 'light')}>
      {children}
    </AppBlurView>
  );
};

export default AppGlassView;
