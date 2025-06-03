import { Blur, Canvas, Group, RoundedRect, SweepGradient, vec } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { Dimensions, StyleProp, ViewStyle } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GLOW_COLOR = `${theme.miramonYellow}FF`;
const GLOW_BG_COLOR = `${theme.miramonYellow}00`; // Should be the same color as GLOW_COLOR but fully transparent
const DEFAULT_BACKGROUND_COLOR = '#000000';

export const AppGlowingBorder = ({
  width = 200,
  height = 200,
  glowSize = 0.2,
  blurRadius = 20,
  backgroundColor = DEFAULT_BACKGROUND_COLOR,
  style,
}: {
  width?: number;
  height?: number;
  glowSize?: number;
  blurRadius?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const rotation = useSharedValue(0);

  const centerX = width / 2;
  const centerY = height / 2;
  const centerVec = vec(centerX, centerY);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(2, {
        duration: 5_000,
        easing: Easing.linear,
      }),
      Infinity,
    );
  }, []);

  const animatedRotation = useDerivedValue(() => {
    return [{ rotate: Math.PI * rotation.value }];
  }, [rotation]);

  const GlowGradient = () => {
    return (
      <RoundedRect height={height} r={10} width={width} x={0} y={0}>
        <SweepGradient
          c={centerVec}
          colors={[GLOW_BG_COLOR, GLOW_COLOR, GLOW_COLOR, GLOW_BG_COLOR]}
          end={360 * glowSize}
          origin={centerVec}
          start={0}
          transform={animatedRotation}
        />
      </RoundedRect>
    );
  };

  return (
    <Canvas style={[tw.style(`overflow-visible`, { width, height }), style]}>
      <Group origin={{ x: screenWidth / 2, y: screenHeight / 2 }}>
        {/* Blurred Glow */}
        <Group>
          <GlowGradient />
          <Blur blur={blurRadius} />
        </Group>

        {/* Outline */}
        <GlowGradient />

        {/* Box overlay */}
        <RoundedRect
          color={backgroundColor}
          height={height - 8}
          r={16}
          width={width - 8}
          x={4}
          y={4}
        />
      </Group>
    </Canvas>
  );
};
