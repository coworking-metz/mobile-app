import SpaceshipRefreshAnimation from './SpaceshipRefreshAnimation';
import * as Haptics from 'expo-haptics';
import React, { type ReactNode, useRef, useCallback, useMemo } from 'react';
import { PanResponder, Platform, RefreshControl, View, useColorScheme } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type StyleProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import SunnyRefreshAnimation from '@/components/Home/SunnyRefreshAnimation';
import { IS_RUNNING_IN_EXPO_GO } from '@/services/environment';

const REFRESH_HEIGHT_IN_PIXELS = 172;
const REFRESH_THRESHOLD = 144;

export default function HomeLayout({
  children,
  outerChildren,
  onRefresh,
  style,
}: {
  children?: ReactNode;
  outerChildren?: ReactNode;
  onRefresh?: () => Promise<unknown>;
  style?: StyleProps;
}) {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const refreshing = useSharedValue(false);
  const completed = useSharedValue(false);

  const scrollPosition = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollPosition.value = event.contentOffset.y;
    },
  });

  const refreshHeight = useMemo(() => REFRESH_HEIGHT_IN_PIXELS, [insets.top]);
  const refreshThreshold = useMemo(() => REFRESH_THRESHOLD, [insets.top]);

  const onShouldRefresh = () => {
    refreshing.value = true;
    completed.value = false;
    onRefresh?.().finally(() => {
      refreshing.value = false;
      completed.value = true;
    });
  };

  const pullDownPosition = useSharedValue(0);
  const isReadyToRefresh = useSharedValue(false);
  const onPanRelease = () => {
    if (isReadyToRefresh.value) {
      pullDownPosition.value = withTiming(refreshThreshold, { duration: 180 });
      isReadyToRefresh.value = false;

      // trigger the refresh action
      onShouldRefresh();
    } else {
      pullDownPosition.value = withTiming(0, { duration: 180 });
    }
  };

  const onRefreshComplete = useCallback(() => {
    pullDownPosition.value = withTiming(0, { duration: 300 });
    completed.value = false;
  }, [pullDownPosition.value, completed.value]);

  const panResponderRef = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gestureState) => {
        const isDraggingDownFromTop = scrollPosition.value <= 0 && gestureState.dy >= 0;
        if (Platform.OS === 'android') {
          return isDraggingDownFromTop;
        }

        return (
          isDraggingDownFromTop &&
          Math.abs(gestureState.dx) < 10 &&
          !completed.value &&
          !refreshing.value
        );
      },
      onPanResponderMove: (_event, gestureState) => {
        pullDownPosition.value = Math.max(Math.min(refreshHeight, gestureState.dy), 0);

        if (pullDownPosition.value >= refreshThreshold && isReadyToRefresh.value === false) {
          isReadyToRefresh.value = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        if (pullDownPosition.value < refreshThreshold && isReadyToRefresh.value === true) {
          isReadyToRefresh.value = false;
        }
      },
      onPanResponderRelease: onPanRelease,
      onPanResponderTerminate: onPanRelease,
    }),
  );

  const pullDownStyles = useAnimatedStyle(() => {
    return {
      marginTop: pullDownPosition.value,
    };
  });

  const refreshProgress = useDerivedValue(() => {
    return (pullDownPosition.value / refreshThreshold) * 100;
  }, [pullDownPosition]);

  const refreshAnimationStyles = useAnimatedStyle(
    () => ({
      height: Math.max(insets.top - 16, 0) + pullDownPosition.value,
      opacity: refreshProgress.value / 100,
    }),
    [insets.top],
  );

  const topFaderStyles = useAnimatedStyle(() => {
    return {
      opacity: Number((scrollPosition.value - 16 - pullDownPosition.value) / insets.top),
    };
  }, []);

  return (
    <View
      style={[
        tw`w-full grow flex flex-col items-stretch relative bg-gray-100 dark:bg-black`,
        style,
      ]}>
      {!IS_RUNNING_IN_EXPO_GO ? (
        <Animated.View
          style={[
            tw`absolute inset-x-0 w-full bg-gray-200 dark:bg-slate-800 overflow-hidden`,
            { top: 0 ?? insets.top },
            refreshAnimationStyles,
          ]}>
          {colorScheme === 'light' ? (
            <SunnyRefreshAnimation
              completed={completed}
              pullProgress={refreshProgress}
              released={refreshing}
              style={[tw`w-full h-full`]}
              onEnd={onRefreshComplete}
            />
          ) : (
            <SpaceshipRefreshAnimation
              completed={completed}
              pullProgress={refreshProgress}
              released={refreshing}
              style={[tw`w-full h-full`]}
              onEnd={onRefreshComplete}
            />
          )}
        </Animated.View>
      ) : null}

      <Animated.View
        {...(!IS_RUNNING_IN_EXPO_GO && panResponderRef.current.panHandlers)}
        style={[tw`w-full grow flex flex-col relative`]}>
        <Animated.ScrollView
          entering={FadeIn.duration(750)}
          horizontal={false}
          {...(IS_RUNNING_IN_EXPO_GO && {
            refreshControl: (
              <RefreshControl
                progressViewOffset={insets.top}
                refreshing={refreshing.value}
                onRefresh={onShouldRefresh}
              />
            ),
          })}
          contentContainerStyle={tw`flex flex-col grow`}
          scrollEventThrottle={16} // Good practice for smooth performance
          showsVerticalScrollIndicator={false}
          style={[tw`w-full grow flex flex-col`, { paddingTop: insets.top }]}
          onScroll={scrollHandler}>
          <Animated.View
            style={[
              tw`flex flex-col items-start justify-start bg-gray-100 dark:bg-black`,
              { paddingBottom: insets.top + insets.bottom + 32 },
              !IS_RUNNING_IN_EXPO_GO && pullDownStyles,
            ]}>
            {children}
          </Animated.View>
        </Animated.ScrollView>

        <Animated.View style={[tw`absolute top-0 left-0 right-0`, topFaderStyles]}>
          <Fader
            position={Fader.position.TOP}
            size={insets.top || (Platform.OS === 'android' ? 16 : 0)}
            tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
          />
        </Animated.View>
      </Animated.View>

      {outerChildren}
    </View>
  );
}
