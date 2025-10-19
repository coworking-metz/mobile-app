import { BlurView, BlurViewProps } from '@danielsaraldi/react-native-blur-view'; // until 'expo-blur' updates
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import React from 'react';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';

const AppBlurView = ({ children, style, type, radius = 10, ...props }: BlurViewProps) => {
  return (
    <Animated.View style={[tw`relative`, style]}>
      {isLiquidGlassAvailable() ? (
        <GlassView style={tw`absolute inset-0`} />
      ) : (
        <BlurView
          radius={radius}
          style={tw`absolute inset-0`}
          type={(type ?? tw.prefixMatch('dark')) ? 'dark' : 'light'}
          {...props}
        />
      )}
      {children}
    </Animated.View>
  );
};

export default AppBlurView;
