import AppText from './AppText';
import ReanimatedText from './ReanimatedText';
import { Canvas, Circle, Path, Skia, SweepGradient, vec } from '@shopify/react-native-skia';
import React, { ReactNode, useMemo, useState } from 'react';
import { StyleProp, View, ViewStyle, type LayoutChangeEvent, type TextStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { HapticFeedbackType, vibrate } from '@/helpers/haptics';

const CURSOR_MARGIN = 4;
const BUBBLE_GAP = 8;
const BUBBLE_DARKEN_FACTOR = 0.25;
const HALF_PI = Math.PI / 2;

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

const getArcGeometry = (
  width: number,
  strokeWidth: number,
  maxCursorRadius: number,
  sweepAngle: number,
) => {
  // the arc always spans symmetrically around the top (90°), leaving a gap centered at the bottom (270°)
  const halfSweep = (clamp(sweepAngle, 1, 359) * Math.PI) / 360;
  const startAngle = HALF_PI + halfSweep;
  const endAngle = HALF_PI - halfSweep;
  const sweepAngleRad = startAngle - endAngle;
  const gapStart = startAngle - 2 * Math.PI;

  // reserves room for the cursor at its largest (grown) size, so it never clips the canvas
  // edges when it scales up on press, even though it's rendered smaller most of the time
  const radius = Math.max(width / 2 - maxCursorRadius, 0);
  const centerX = width / 2;
  const cursorClearance = Math.max(strokeWidth / 2, maxCursorRadius) + CURSOR_MARGIN;

  // the apex (top) is always the highest point; the two endpoints are always the lowest, symmetric point
  const centerY = radius + cursorClearance;
  const endpointY = centerY - radius * Math.cos(halfSweep);

  // Skia's SweepGradient has a hard seam at its local 0°/360° boundary (colors don't blend across
  // it, they jump). Rotating the shader by HALF_PI puts that seam at the bottom-center of the gap,
  // which is never drawn - so the gradient's local range is centered on the gap too: it spans
  // [halfGapDeg, 360 - halfGapDeg], leaving a comfortable margin on both sides of the seam for the
  // round stroke caps (which slightly overshoot the path's mathematical start/end angles) to sit
  // in without crossing it and clamping to the wrong end color.
  const gapDeg = 360 - (sweepAngleRad * 180) / Math.PI;
  const halfGapDeg = gapDeg / 2;

  return {
    radius,
    centerX,
    centerY,
    startAngle,
    endAngle,
    sweepAngleRad,
    gapStart,
    endpointY,
    gradientStartDeg: halfGapDeg,
    gradientEndDeg: 360 - halfGapDeg,
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
  value = useSharedValue(0),
  min = 0,
  max = 100,
  sweepAngle = 270,
  strokeWidth = 20,
  arcColor = theme.miramonYellow,
  arcColors,
  trackColor = theme.charlestonGreen,
  cursorColor,
  cursorOuterColor = '#ffffff',
  cursorRadius = strokeWidth,
  cursorPressScale = 1.25,
  showLabels = true,
  labelStyle,
  formatLabel = (labelValue: number) => `${labelValue}`,
  showValueBubble = true,
  disabled = false,
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
  arcColors?: string[];
  trackColor?: string;
  cursorColor?: string;
  cursorOuterColor?: string;
  cursorRadius?: number;
  cursorPressScale?: number;
  showLabels?: boolean;
  labelColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  formatLabel?: (labelValue: number) => string;
  showValueBubble?: boolean;
  disabled?: boolean;
  onSlidingComplete?: (value: number) => void;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) => {
  const [width, setWidth] = useState(0);

  const geometry = useMemo(
    () =>
      width > 0
        ? getArcGeometry(width, strokeWidth, cursorRadius * cursorPressScale, sweepAngle)
        : null,
    [width, strokeWidth, cursorRadius, cursorPressScale, sweepAngle],
  );

  const path = useMemo(() => {
    if (!geometry) {
      return null;
    }

    const { radius, startAngle, endAngle, leftX, rightX, endpointY } = geometry;
    const largeArcFlag = startAngle - endAngle > Math.PI ? 1 : 0;

    return Skia.Path.MakeFromSVGString(
      `M ${leftX} ${endpointY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${rightX} ${endpointY}`,
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

  const cursorFillColor = useDerivedValue(() => {
    if (!arcColors || arcColors.length === 0) {
      return cursorColor ?? arcColor;
    }

    const positions = arcColors.map((_, index) => index / Math.max(arcColors.length - 1, 1));

    return interpolateColor(percentComplete.value, positions, arcColors);
  }, [arcColors, cursorColor, arcColor]);

  const pressScale = useSharedValue(1);

  const cursorOuterRadius = useDerivedValue(() => cursorRadius * pressScale.value);
  const cursorInnerRadius = useDerivedValue(() => cursorRadius * 0.75 * pressScale.value);

  // formatLabel is a plain JS function from the consumer's own file, so it can't be safely called
  // from this worklet (Reanimated can only run worklets on the UI thread, and it has no way to
  // auto-workletize a function it never saw at build time) - stick to worklet-safe built-ins.
  const bubbleText = useDerivedValue(() => `${Math.round(value.value)}`);

  const [bubbleWidth, setBubbleWidth] = useState(0);
  const [bubbleHeight, setBubbleHeight] = useState(0);

  const bubbleStyle = useAnimatedStyle(() => {
    // fades and pops in lockstep with the cursor's own press-grow animation
    const progress = interpolate(
      pressScale.value,
      [1, cursorPressScale],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: progress,
      backgroundColor: interpolateColor(
        BUBBLE_DARKEN_FACTOR,
        [0, 1],
        [cursorFillColor.value, '#000000'],
      ),
      transform: [
        { translateX: cursorX.value - bubbleWidth / 2 },
        { translateY: cursorY.value - cursorOuterRadius.value - BUBBLE_GAP - bubbleHeight },
        { scale: 0.8 + progress * 0.2 },
      ],
    };
  }, [bubbleWidth, bubbleHeight, cursorPressScale]);

  const updateFromTouch = (x: number, y: number) => {
    'worklet';
    if (!geometry) {
      return;
    }

    const { centerX, centerY, startAngle, endAngle, sweepAngleRad, gapStart } = geometry;
    const rawTheta = Math.atan2(-(y - centerY), x - centerX);

    let percent;
    if (rawTheta <= gapStart) {
      // wrapped past the atan2 (-π, π] boundary, still on the valid arc
      percent = clamp((startAngle - (rawTheta + 2 * Math.PI)) / sweepAngleRad, 0, 1);
    } else if (rawTheta < endAngle) {
      // touched inside the gap at the bottom: snap to whichever end is closer
      percent = rawTheta > -HALF_PI ? 1 : 0;
    } else {
      percent = clamp((startAngle - rawTheta) / sweepAngleRad, 0, 1);
    }

    value.value = min + percent * (max - min);
  };

  const gesture = Gesture.Pan()
    .minDistance(0)
    .enabled(!disabled)
    .onBegin(({ x, y }) => {
      pressScale.value = withSpring(cursorPressScale);
      scheduleOnRN(vibrate, HapticFeedbackType.Light);
      updateFromTouch(x, y);
    })
    .onUpdate(({ x, y }) => {
      updateFromTouch(x, y);
    })
    .onFinalize(() => {
      pressScale.value = withSpring(1);
      scheduleOnRN(vibrate, HapticFeedbackType.Light);
      if (onSlidingComplete) {
        scheduleOnRN(onSlidingComplete, value.value);
      }
    });

  return (
    <View
      style={[style, geometry && { height: geometry.height }]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => {
        setWidth((previous) =>
          previous === nativeEvent.layout.width ? previous : nativeEvent.layout.width,
        );
      }}>
      {geometry && path ? (
        <GestureDetector gesture={gesture}>
          <Canvas style={[{ width, height: geometry.height }, disabled && { opacity: 0.4 }]}>
            <Path
              color={trackColor}
              path={path}
              strokeCap="round"
              strokeWidth={strokeWidth}
              // eslint-disable-next-line tailwindcss/no-custom-classname
              style="stroke"
            />
            <Path
              color={arcColors ? undefined : arcColor}
              end={percentComplete}
              path={path}
              start={0}
              strokeCap="round"
              strokeWidth={strokeWidth}
              // eslint-disable-next-line tailwindcss/no-custom-classname
              style="stroke">
              {arcColors ? (
                <SweepGradient
                  c={vec(geometry.centerX, geometry.centerY)}
                  colors={arcColors}
                  end={geometry.gradientEndDeg}
                  origin={vec(geometry.centerX, geometry.centerY)}
                  start={geometry.gradientStartDeg}
                  transform={[{ rotate: HALF_PI }]}
                />
              ) : null}
            </Path>
            <Circle color={cursorOuterColor} cx={cursorX} cy={cursorY} r={cursorOuterRadius} />
            <Circle color={cursorFillColor} cx={cursorX} cy={cursorY} r={cursorInnerRadius} />
          </Canvas>
        </GestureDetector>
      ) : null}
      {geometry && showLabels ? (
        <>
          <AppText
            pointerEvents="none"
            style={[
              tw`absolute ml-6 text-left`,
              {
                position: 'absolute',
                left: geometry.leftX,
                top: geometry.endpointY,
              },
              labelStyle,
            ]}>
            {formatLabel(min)}
          </AppText>
          <AppText
            pointerEvents="none"
            style={[
              tw`absolute mr-6 text-right`,
              {
                position: 'absolute',
                right: width - geometry.rightX,
                top: geometry.endpointY,
              },
              labelStyle,
            ]}>
            {formatLabel(max)}
          </AppText>
        </>
      ) : null}
      {geometry && showValueBubble ? (
        <Animated.View
          pointerEvents="none"
          style={[tw`absolute rounded-lg px-2 py-1 shadow-2xl shadow-black`, bubbleStyle]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            setBubbleWidth(nativeEvent.layout.width);
            setBubbleHeight(nativeEvent.layout.height);
          }}>
          {}
          <ReanimatedText style={[tw`text-xl text-black`]} text={bubbleText} />
        </Animated.View>
      ) : null}
      {children}
    </View>
  );
};

export default AppArcSlider;
