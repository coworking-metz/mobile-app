import { BlurView, BlurViewProps } from '@danielsaraldi/react-native-blur-view'; // until 'expo-blur' updates
import React from 'react';
import { ViewProps } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';

export type AppBlurViewProps = BlurViewProps & AnimatedProps<ViewProps>;

const AppBlurView = ({ children, style, type, radius = 10, ...props }: AppBlurViewProps) => {
  return (
    <Animated.View style={[tw`relative`, style]} {...props}>
      <BlurView
        radius={radius}
        style={tw`absolute inset-0`}
        type={type ?? (tw.prefixMatch('dark') ? 'dark' : 'light')}
      />
      {children}
    </Animated.View>
  );
};

export default AppBlurView;
