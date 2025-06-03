import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import { SquircleView } from 'expo-squircle-view';
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
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import SpaceshipRefreshAnimation from '@/components/Home/SpaceshipRefreshAnimation';
import SunnyRefreshAnimation from '@/components/Home/SunnyRefreshAnimation';
import useAppScreen from '@/helpers/screen';
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
  const refreshing = useSharedValue(false);
  const completed = useSharedValue(false);
  const { isWide } = useAppScreen();
  const [isRefresing, setRefreshing] = useState(false);
  const settingsStore = useSettingsStore();
  const navigation = useNavigation();
  const enableAnimations = useMemo(
    () => !settingsStore.withNativePullToRefresh && !IS_RUNNING_IN_EXPO_GO,
    [settingsStore.withNativePullToRefresh],
  );

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
      {enableAnimations ? (
        <Animated.View style={[tw`absolute top-0 inset-x-0`, refreshAnimationStyles]}>
          <SquircleView
            cornerSmoothing={100} // 0-100
            preserveSmoothing={true} // false matches figma, true has more rounding
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
          </SquircleView>
        </Animated.View>
      ) : null}

      <Animated.View
        {...(enableAnimations && panResponderRef.current.panHandlers)}
        style={[tw`w-full grow flex flex-col relative`]}>
        <Animated.ScrollView
          horizontal={false}
          {...(!enableAnimations && {
            refreshControl: (
              <RefreshControl
                progressViewOffset={Platform.OS === 'ios' ? insets.top : 0}
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
              tw.style(`flex flex-col items-start justify-start bg-gray-100 dark:bg-black w-full`, {
                paddingBottom: insets.top + insets.bottom + 32,
              }),
              enableAnimations && pullDownStyles,
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

        {!!insets.bottom && (
          <Animated.View style={[tw`absolute bottom-0 left-0 right-0`, { height: insets.bottom }]}>
            <Fader
              position={Fader.position.BOTTOM}
              size={insets.bottom}
              tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
            />
          </Animated.View>
        )}
      </Animated.View>

      {outerChildren}
    </View>
  );
}
