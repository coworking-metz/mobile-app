import * as Sentry from '@sentry/react-native';
import { BlurView, type BlurViewProps, type BlurTint } from 'expo-blur';
import React from 'react';
import { Platform, View, ViewProps } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';

export type AppBlurViewProps = Omit<BlurViewProps, 'intensity' | 'tint'> &
  AnimatedProps<ViewProps> & {
    // Backward-compatible aliases used across the app.
    radius?: number;
    type?: Extract<BlurTint, 'light' | 'dark'>;
    tint?: BlurTint;
  };

const AppBlurView = ({
  children,
  style,
  type,
  radius = 10,
  tint,
  blurMethod,
  blurTarget,
  ...props
}: AppBlurViewProps) => {
  const resolvedTint = (type ?? tint ?? (tw.prefixMatch('dark') ? 'dark' : 'light')) as BlurTint;
  const hasAndroidTarget = Platform.OS !== 'android' || !!blurTarget;

  return (
    <Animated.View style={[tw`relative`, style]} {...props}>
      <ErrorBoundary
        FallbackComponent={() => (
          <View
            style={[
              tw`absolute inset-0`,
              resolvedTint === 'dark' ? tw`bg-black/50` : tw`bg-white/50`,
            ]}
          />
        )}
        onError={(error) => Sentry.captureException(error)}>
        {hasAndroidTarget ? (
          <BlurView
            blurMethod={blurMethod ?? 'dimezisBlurViewSdk31Plus'}
            blurTarget={blurTarget}
            intensity={radius}
            style={tw`absolute inset-0`}
            tint={resolvedTint}
          />
        ) : (
          <View
            style={[
              tw`absolute inset-0`,
              resolvedTint === 'dark' ? tw`bg-black/50` : tw`bg-white/50`,
            ]}
          />
        )}
      </ErrorBoundary>
      {children}
    </Animated.View>
  );
};

export default AppBlurView;
