import Color from 'color';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

export const FaderPosition = {
  START: 'START',
  END: 'END',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
} as const;
export type FaderPosition = (typeof FaderPosition)[keyof typeof FaderPosition];

type AppFaderProps = {
  position?: FaderPosition;
  size?: number;
  tintColor?: string;
  visible?: boolean;
  style?: ComponentProps<typeof Animated.View>['style'];
};

const GRADIENT_POINTS = {
  TOP: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  BOTTOM: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  START: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  END: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
} as const;

const POSITION_STYLES = {
  TOP: tw`top-0`,
  BOTTOM: tw`bottom-0`,
  START: tw`left-0`,
  END: tw`right-0`,
};

const AppFader = ({
  style,
  position = FaderPosition.END,
  size = 50,
  tintColor = tw.color('white') as string,
  visible = true,
}: AppFaderProps) => {
  const [reduceTransparencyEnabled, setReduceTransparencyEnabled] = useState(false);

  useEffect(() => {
    const reduceTransparencyChangedSubscription = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      setReduceTransparencyEnabled,
    );
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparencyEnabled);
    return () => reduceTransparencyChangedSubscription.remove();
  }, []);

  // fade to the same hue at alpha 0, 'transparent' would go through grey
  const colors = useMemo(
    () => [tintColor, Color(tintColor).alpha(0).rgb().string()] as const,
    [tintColor],
  );

  const isVertical = position === FaderPosition.TOP || position === FaderPosition.BOTTOM;

  if (reduceTransparencyEnabled) return null;

  return (
    <Animated.View style={style}>
      <View
        pointerEvents="none"
        style={[
          tw`absolute`,
          isVertical ? [tw`w-full`, { height: size }] : [tw`h-full`, { width: size }],
          POSITION_STYLES[position],
        ]}>
        {visible && (
          <LinearGradient colors={colors} {...GRADIENT_POINTS[position]} style={tw`flex-1`} />
        )}
      </View>
    </Animated.View>
  );
};

export default AppFader;

export const AppTopFader = (props: AppFaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <AppFader
      position={FaderPosition.TOP}
      size={(insets.top || (Platform.OS === 'android' ? 16 : 0)) + 32}
      tintColor={tw.prefixMatch('dark') ? tw.color('black/25') : tw.color('white/40')}
      {...props}
    />
  );
};
