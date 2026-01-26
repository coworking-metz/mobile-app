import { BlurView, BlurViewProps } from '@danielsaraldi/react-native-blur-view'; // until 'expo-blur' updates
import * as Sentry from '@sentry/react-native';
import React from 'react';
import { View, ViewProps } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';

export type AppBlurViewProps = BlurViewProps & AnimatedProps<ViewProps>;

const AppBlurView = ({ children, style, type, radius = 10, ...props }: AppBlurViewProps) => {
  return (
    <Animated.View style={[tw`relative`, style]} {...props}>
      <ErrorBoundary
        FallbackComponent={() => (
          <View
            style={[
              tw`absolute inset-0`,
              (type ?? (tw.prefixMatch('dark') ? 'dark' : 'light') === 'dark')
                ? tw`bg-black/50`
                : tw`bg-white/50`,
            ]}
          />
        )}
        onError={(error) => Sentry.captureException(error)}>
        <BlurView
          radius={radius}
          style={tw`absolute inset-0`}
          type={type ?? (tw.prefixMatch('dark') ? 'dark' : 'light')}
        />
      </ErrorBoundary>
      {children}
    </Animated.View>
  );
};

export default AppBlurView;
