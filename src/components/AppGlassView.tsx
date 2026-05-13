import AppBlurView from './AppBlurView';
import { isLiquidGlassSupported, LiquidGlassView } from '@callstack/liquid-glass';
import React from 'react';
import { ColorValue, StyleProp, type View, ViewStyle } from 'react-native';
import tw from 'twrnc';

const AppGlassView = ({
  children,
  radius = 5,
  style,
  interactive = false,
  tintColor,
  colorScheme,
  blurTarget,
}: {
  children: React.ReactNode;
  radius?: number;
  interactive?: boolean;
  tintColor?: ColorValue;
  style?: StyleProp<ViewStyle>;
  colorScheme?: 'light' | 'dark';
  blurTarget?: React.RefObject<View | null>;
}) => {
  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView
        colorScheme={colorScheme}
        interactive={interactive}
        style={style}
        tintColor={tintColor}>
        {children}
      </LiquidGlassView>
    );
  }

  return (
    <AppBlurView
      blurTarget={blurTarget}
      radius={radius}
      style={style}
      type={colorScheme ?? (tw.prefixMatch('dark') ? 'dark' : 'light')}>
      {children}
    </AppBlurView>
  );
};

export default AppGlassView;
