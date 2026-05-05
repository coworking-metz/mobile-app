import { useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  PanResponder,
  Platform,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import { AppTopFader } from '@/components/AppFader';
import AppSquircleView from '@/components/AppSquircleView';
import SpaceshipRefreshAnimation from '@/components/Home/SpaceshipRefreshAnimation';
import SunnyRefreshAnimation from '@/components/Home/SunnyRefreshAnimation';
import { HapticFeedbackType, vibrate } from '@/helpers/haptics';
import useAppScreen, { useAppPaddingBottom } from '@/helpers/screen';
import { IS_RUNNING_IN_EXPO_GO } from '@/services/environment';
import useSettingsStore from '@/stores/settings';

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
  style?: StyleProp<ViewStyle>;
}) {
  useDeviceContext(tw);

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const reduceMotion = useReducedMotion();
  const refreshing = useSharedValue(false);
  const completed = useSharedValue(false);
  const { isWide } = useAppScreen();
  const [isRefresing, setRefreshing] = useState(false);
  const settingsStore = useSettingsStore();
  const navigation = useNavigation();
  const paddingBottom = useAppPaddingBottom();
  const enableAnimations = useMemo(
    () => !settingsStore.withNativePullToRefresh && !IS_RUNNING_IN_EXPO_GO && !reduceMotion,
    [settingsStore.withNativePullToRefresh, reduceMotion],
  );

  // https://github.com/facebook/react-native/issues/54183#issuecomment-3467125323
  const [progressViewOffset, setProgressViewOffset] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressViewOffset(Platform.OS === 'ios' ? insets.top : 0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [insets.top]);

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
    // set it to 1 to not trigger onMoveShouldSetPanResponder
    // and let the user easely scroll down
    pullDownPosition.value = withTiming(1, { duration: 300 });
    completed.value = false;
  }, [pullDownPosition.value, completed.value]);

  // reset animation state when the screen is blurred
  useEffect(() => {
    if (enableAnimations) {
      const unsubscribe = navigation.addListener('blur', () => {
        onRefreshComplete();
      });
      return unsubscribe;
    }
  }, [enableAnimations]);

  const panResponderRef = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gestureState) => {
        const isDraggingDownFromTop = scrollPosition.value <= 0 && gestureState.dy >= 0;
        const wantsToRefresh = isDraggingDownFromTop && !completed.value && !refreshing.value;
        if (Platform.OS === 'android') {
          return wantsToRefresh && gestureState.dy >= 1;
        }

        return wantsToRefresh && Math.abs(gestureState.dx) < 10;
      },
      onPanResponderMove: (_event, gestureState) => {
        pullDownPosition.value = Math.max(Math.min(refreshHeight, gestureState.dy), 0);

        if (pullDownPosition.value >= refreshThreshold && isReadyToRefresh.value === false) {
          isReadyToRefresh.value = true;
          vibrate(HapticFeedbackType.Medium);
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
      {/* <HomeBackground /> */}
      {enableAnimations ? (
        <Animated.View style={[tw`absolute top-0 inset-x-0`, refreshAnimationStyles]}>
          <AppSquircleView
            style={[tw`overflow-hidden w-full`, isWide && tw`max-w-sm mx-auto rounded-b-[3.5rem]`]}>
            {colorScheme === 'light' ? (
              <SunnyRefreshAnimation
                completed={completed}
                pullProgress={refreshProgress}
                released={refreshing}
                style={tw`w-full h-full`}
                onEnd={onRefreshComplete}
              />
            ) : (
              <SpaceshipRefreshAnimation
                completed={completed}
                pullProgress={refreshProgress}
                released={refreshing}
                style={tw`w-full h-full`}
                onEnd={onRefreshComplete}
              />
            )}
          </AppSquircleView>
        </Animated.View>
      ) : null}

      <Animated.View
        {...(enableAnimations && panResponderRef.current.panHandlers)}
        style={[tw`flex flex-col grow relative w-full`]}>
        <Animated.ScrollView
          horizontal={false}
          {...(!enableAnimations && {
            refreshControl: (
              <RefreshControl
                progressViewOffset={progressViewOffset}
                refreshing={isRefresing}
                onRefresh={() => {
                  setRefreshing(true);
                  onRefresh?.().finally(() => {
                    setRefreshing(false);
                  });
                }}
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
              tw.style(`flex flex-col items-start justify-start w-full bg-gray-100 dark:bg-black`, {
                paddingBottom: paddingBottom + (Platform.OS === 'android' ? 64 : 16),
              }),
              enableAnimations && pullDownStyles,
            ]}>
            {children}
          </Animated.View>
        </Animated.ScrollView>

        <AppTopFader style={[tw`absolute inset-x-0 top-0`, topFaderStyles]} />

        {!!insets.bottom && (
          <AppTopFader
            position={Fader.position.BOTTOM}
            size={insets.bottom}
            style={tw.style(`absolute inset-x-0 bottom-0`, { height: insets.bottom })}
          />
        )}
      </Animated.View>

      {outerChildren}
    </View>
  );
}
