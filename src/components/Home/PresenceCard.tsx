import MaskedView from '@react-native-masked-view/masked-view';
import { Circle, runSpring, useValue } from '@shopify/react-native-skia';
import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import { Skeleton } from 'moti/skeleton';
import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import AnimatedNumber from 'react-native-animated-number';
import { LineGraph, type GraphPoint, type SelectionDotProps } from 'react-native-graph';
import { type AnimatedLineGraphProps } from 'react-native-graph/lib/typescript/LineGraphProps';
import Animated, {
  FadeInDown,
  FadeOutDown,
  runOnJS,
  useAnimatedReaction,
  type StyleProps,
} from 'react-native-reanimated';
import tw from 'twrnc';

const SelectionDot = ({
  isActive,
  color,
  circleX,
  circleY,
}: SelectionDotProps): React.ReactElement => {
  const circleRadius = useValue(0);

  const setIsActive = useCallback(
    (active: boolean) => {
      runSpring(circleRadius, active ? 5 : 0, {
        mass: 1,
        stiffness: 1000,
        damping: 50,
        velocity: 0,
      });
    },
    [circleRadius],
  );

  useAnimatedReaction(
    () => isActive.value,
    (active) => {
      runOnJS(setIsActive)(active);
    },
    [isActive, setIsActive],
  );

  return <Circle color={color} cx={circleX} cy={circleY} r={circleRadius} />;
};

const PresenceLineGraph = ({
  color,
  style,
  points,
  history = [],
  ...graphProps
}: AnimatedLineGraphProps & {
  color: string;
  history: GraphPoint[];
  style?: StyleProps;
}) => {
  const lineGraphWidth = useMemo(() => {
    // because LineGraph edges are half wide a point (thus divide by 2)
    const lineGraphEdgeWidth = (points.length - history.length) / 2;
    return ((lineGraphEdgeWidth + history.length) / history.length) * 100;
  }, [history, points]);

  return (
    <LineGraph
      color={tw.color(`${color}-700`) as string}
      gradientFillColors={[
        (tw.prefixMatch('dark') ? tw.color(`${color}-900`) : tw.color(`${color}-200`)) as string,
        (tw.prefixMatch('dark') ? tw.color(`gray-900`) : tw.color('white')) as string,
      ]}
      range={{
        y: {
          min: 0,
          max: Math.max(28, ...(history || []).map(({ value }) => value)),
        },
      }}
      style={[
        tw`h-full`,
        !!points.length && tw`left-[-${(lineGraphWidth - 100) / 2}%] w-[${lineGraphWidth}%]`,
        style,
      ]}
      {...graphProps}
      animated={true}
      points={points}
    />
  );
};

const PresenceCard = ({
  color,
  type,
  style,
  history = [],
  at,
  children,
  loading = false,
  disabled = false,
  ...graphProps
}: Omit<AnimatedLineGraphProps, 'points'> & {
  color: string;
  type: dayjs.ManipulateType;
  style?: StyleProps;
  history?: GraphPoint[];
  at?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}) => {
  const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);
  const [isHovering, setHovering] = useState<boolean>(false);

  const first = useMemo(() => {
    const [firstItem] = history;
    return firstItem;
  }, [history]);

  const last = useMemo(() => {
    const lastItem = history[history.length - 1];
    return lastItem;
  }, [history]);

  const points = useMemo(() => {
    if (first && last) {
      const historySiblings = [
        { value: 0, date: dayjs(first.date).subtract(1, type).toDate() },
        ...history,
        { value: 0, date: dayjs(last.date).add(1, type).toDate() },
      ];
      return historySiblings;
    }
    return history;
  }, [history, first, last]);

  const forecastIndex = useMemo<number>(() => {
    const indexFound = history.findIndex(({ date }) => {
      return dayjs(at).isBefore(date);
    });
    if (indexFound === -1) {
      return history.length;
    }
    return indexFound;
  }, [history]);

  useEffect(() => {
    if (isHovering && selectedPoint) {
      if (dayjs(at).isBefore(selectedPoint.date)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [isHovering, selectedPoint]);

  if (loading) {
    return (
      <View style={[tw`rounded-2xl h-full overflow-hidden bg-gray-200 dark:bg-gray-900`, style]}>
        <Skeleton
          backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
          height="100%"
          radius={16}
          width="100%"
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[tw`relative rounded-2xl h-full overflow-hidden bg-gray-200 dark:bg-gray-900`, style]}>
      {history.length > 0 ? (
        <MaskedView
          maskElement={
            <PresenceLineGraph
              color={color}
              enablePanGesture={false}
              {...graphProps}
              history={history}
              points={points}
            />
          }
          pointerEvents="none"
          style={tw`absolute top-0 left-0 bottom-0 right-0 z-30`}>
          <View
            style={[
              tw`w-[${(100 / history.length) * forecastIndex}%] h-full opacity-10`,
              { backgroundColor: tw.color(`${color}-700`) },
            ]}
          />
        </MaskedView>
      ) : (
        <></>
      )}
      <PresenceLineGraph
        color={color}
        enablePanGesture={!disabled}
        panGestureDelay={100}
        SelectionDot={SelectionDot}
        style={tw`absolute z-20`}
        onGestureEnd={() => setHovering(false)}
        onGestureStart={() => setHovering(true)}
        onPointSelected={(point) => setSelectedPoint(point)}
        {...graphProps}
        history={history}
        points={points}
      />
      {isHovering && selectedPoint && (
        <Animated.View style={tw`absolute p-6 right-0 top-0 z-10`}>
          <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutDown.duration(500)}>
            <AnimatedNumber
              style={[
                tw`text-7xl font-bold text-${color}-800 dark:text-${color}-700`,
                isHovering && dayjs(at).isBefore(selectedPoint.date) && tw`opacity-64`,
              ]}
              time={32} // milliseconds between each step
              value={selectedPoint.value || 0}
            />
          </Animated.View>
        </Animated.View>
      )}
      {children}
    </Animated.View>
  );
};

export default PresenceCard;
