import AppText from './AppText';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import React, { ReactNode, useMemo, useState } from 'react';
import { StyleProp, View, ViewStyle, type LayoutChangeEvent, type TextStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const CURSOR_MARGIN = 4;
const LABEL_WIDTH = 48;
const HALF_PI = Math.PI / 2;

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

const getArcGeometry = (
  width: number,
  strokeWidth: number,
  cursorRadius: number,
  sweepAngle: number,
) => {
  // the arc always spans symmetrically around the top (90°), leaving a gap centered at the bottom (270°)
  const halfSweep = (clamp(sweepAngle, 1, 359) * Math.PI) / 360;
  const startAngle = HALF_PI + halfSweep;
  const endAngle = HALF_PI - halfSweep;
  const sweepAngleRad = startAngle - endAngle;
  const gapStart = startAngle - 2 * Math.PI;

  const radius = Math.max(width / 2 - cursorRadius, 0);
  const centerX = width / 2;
  const cursorClearance = Math.max(strokeWidth / 2, cursorRadius) + CURSOR_MARGIN;

  // the apex (top) is always the highest point; the two endpoints are always the lowest, symmetric point
  const centerY = radius + cursorClearance;
  const endpointY = centerY - radius * Math.cos(halfSweep);

  return {
    radius,
    centerX,
    centerY,
    startAngle,
    endAngle,
    sweepAngleRad,
    gapStart,
    leftX: centerX - radius * Math.sin(halfSweep),
    rightX: centerX + radius * Math.sin(halfSweep),
    height: endpointY + cursorClearance,
  };
};

const percentToPosition = (
  percent: number,
  {
    centerX,
    centerY,
    radius,
    startAngle,
    sweepAngleRad,
  }: Pick<
    ReturnType<typeof getArcGeometry>,
    'centerX' | 'centerY' | 'radius' | 'startAngle' | 'sweepAngleRad'
  >,
) => {
  'worklet';
  const theta = startAngle - percent * sweepAngleRad;

  return {
    x: centerX + radius * Math.cos(theta),
    y: centerY - radius * Math.sin(theta),
  };
};

/**
 * A basic arc-shaped slider: drag the cursor along the arc to move `value` between `min` and `max`.
 * `value` is a shared value so the gesture updates it directly on the UI thread, keeping the
 * consumer in sync without a JS round-trip. Its height is derived from its measured width, so it
 * only needs a width to lay itself out responsively.
 */
const AppArcSlider = ({
  value,
  min = 0,
  max = 100,
  sweepAngle = 280,
  strokeWidth = 20,
  arcColor = theme.miramonYellow,
  trackColor = theme.charlestonGreen,
  cursorColor,
  cursorInnerColor = '#ffffff',
  cursorRadius = strokeWidth,
  showLabels = true,
  labelColor,
  labelStyle,
  formatLabel = (labelValue: number) => `${labelValue}`,
  onSlidingComplete,
  style,
  children,
}: {
  value: SharedValue<number>;
  min?: number;
  max?: number;
  sweepAngle?: number;
  strokeWidth?: number;
  arcColor?: string;
  trackColor?: string;
  cursorColor?: string;
  cursorInnerColor?: string;
  cursorRadius?: number;
  showLabels?: boolean;
  labelColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  formatLabel?: (labelValue: number) => string;
  onSlidingComplete?: (value: number) => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) => {
  const [width, setWidth] = useState(0);

  const geometry = useMemo(
    () => (width > 0 ? getArcGeometry(width, strokeWidth, cursorRadius, sweepAngle) : null),
    [width, strokeWidth, cursorRadius, sweepAngle],
  );

  const path = useMemo(() => {
    if (!geometry) {
      return null;
    }

    const { centerX, radius, startAngle, endAngle, leftX, rightX } = geometry;
    const endpointY = 0 - (geometry.centerY - geometry.centerY); // unused placeholder removed below
    void endpointY;
    const largeArcFlag = startAngle - endAngle > Math.PI ? 1 : 0;
    const y = geometry.centerY - radius * Math.cos((startAngle - endAngle) / 2 - HALF_PI + HALF_PI);
    void centerX;

    return Skia.Path.MakeFromSVGString(
      `M ${leftX} ${y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${rightX} ${y}`,
    );
  }, [geometry]);

  const percentComplete = useDerivedValue(() => {
    if (!geometry || max <= min) {
      return 0;
    }

    return (clamp(value.value, min, max) - min) / (max - min);
  }, [geometry, min, max]);

  const cursorX = useDerivedValue(() => {
    return geometry ? percentToPosition(percentComplete.value, geometry).x : 0;
  }, [geometry]);

  const cursorY = useDerivedValue(() => {
    return geometry ? percentToPosition(percentComplete.value, geometry).y : 0;
  }, [geometry]);

  const dragOriginX = useSharedValue(0);
  const dragOriginY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      dragOriginX.value = cursorX.value;
      dragOriginY.value = cursorY.value;
    })
    .onUpdate(({ translationX, translationY }) => {
      if (!geometry) {
        return;
      }

      const { centerX, centerY, startAngle, endAngle, sweepAngleRad, gapStart } = geometry;
      const canvasX = translationX + dragOriginX.value;
      const canvasY = translationY + dragOriginY.value;
      const rawTheta = Math.atan2(-(canvasY - centerY), canvasX - centerX);

      let percent;
      if (rawTheta <= gapStart) {
        // wrapped past the atan2 (-π, π] boundary, still on the valid arc
        percent = clamp((startAngle - (rawTheta + 2 * Math.PI)) / sweepAngleRad, 0, 1);
      } else if (rawTheta < endAngle) {
        // dragged into the gap at the bottom: snap to whichever end is closer
        percent = rawTheta > -HALF_PI ? 1 : 0;
      } else {
        percent = clamp((startAngle - rawTheta) / sweepAngleRad, 0, 1);
      }

      value.value = min + percent * (max - min);
    })
    .onEnd(() => {
      if (onSlidingComplete) {
        scheduleOnRN(onSlidingComplete, value.value);
      }
    });

  return (
    <View
      style={[style, geometry ? { height: geometry.height } : undefined]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => {
        setWidth((previous) =>
          previous === nativeEvent.layout.width ? previous : nativeEvent.layout.width,
        );
      }}>
      {geometry && path ? (
        <GestureDetector gesture={gesture}>
          <Canvas style={{ width, height: geometry.height }}>
            <Path
              color={trackColor}
              path={path}
              strokeCap="round"
              strokeWidth={strokeWidth}
              // eslint-disable-next-line tailwindcss/no-custom-classname
              style="stroke"
            />
            <Path
              color={arcColor}
              end={percentComplete}
              path={path}
              start={0}
              strokeCap="round"
              strokeWidth={strokeWidth}
              // eslint-disable-next-line tailwindcss/no-custom-classname
              style="stroke"
            />
            <Circle color={cursorColor ?? arcColor} cx={cursorX} cy={cursorY} r={cursorRadius} />
            <Circle color={cursorInnerColor} cx={cursorX} cy={cursorY} r={cursorRadius * 0.75} />
          </Canvas>
        </GestureDetector>
      ) : null}
      {geometry && showLabels ? (
        <>
          <AppText
            style={[
              tw`absolute top-full text-center`,
              {
                position: 'absolute',
                left: geometry.leftX,
                width: LABEL_WIDTH,
                color: labelColor ?? trackColor,
              },
              labelStyle,
            ]}>
            {formatLabel(min)}
          </AppText>
          <AppText
            style={[
              tw`absolute top-full text-center`,
              {
                left: geometry.rightX,
                width: LABEL_WIDTH,
                color: labelColor ?? trackColor,
              },
              labelStyle,
            ]}>
            {formatLabel(max)}
          </AppText>
        </>
      ) : null}
      {children}
    </View>
  );
};

export default AppArcSlider;
