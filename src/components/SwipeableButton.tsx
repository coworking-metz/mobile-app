import HorizontalLoadingAnimation from './Animations/HorizontalLoadingAnimation';
import AppText from './AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
  type LayoutChangeEvent,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  Extrapolation,
  convertToRGBA,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const HANDLE_ENDING_POSITION = 40;
const RIGHT_PADDING = 8;

const AnimatedMaterialCommunityIcons = Animated.createAnimatedComponent(MaterialCommunityIcons);

const SwipeableButton = ({
  placeholder,
  loading = false,
  disabled = false,
  swiped = false,
  style,
  onSwiped,
  onReset,
  children,
}: {
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  swiped?: boolean;
  style?: StyleProp<ViewStyle>;
  onSwiped: () => void;
  onReset: () => void;
  children?: ReactNode;
}) => {
  const colorScheme = useColorScheme();
  const [hasPassedThreshold, setPassedThreshold] = useState(false);
  const [hasSwiped, setSwiped] = useState(swiped);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [buttonHeight, setButtonHeight] = useState(0);
  const [handleWidth, setHandleWidth] = useState(0);
  const sliding = useSharedValue(0);
  const isSwiping = useSharedValue(0);

  const swipingRange = useMemo(
    () => (buttonWidth > handleWidth ? buttonWidth - handleWidth : 0),
    [buttonWidth, handleWidth],
  );

  useEffect(() => {
    setSwiped(swiped);
  }, [swiped]);

  useEffect(() => {
    if (!hasSwiped) {
      sliding.value = withSpring(0);
      isSwiping.value = 0;
    }
  }, [hasSwiped]);

  useEffect(() => {
    if (hasPassedThreshold) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [hasPassedThreshold]);

  const onSwipe = useCallback(() => {
    setSwiped(true);
    onSwiped?.();
  }, [onSwiped]);

  const onHold = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const onRestart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSwiped(false);
    onReset?.();
  }, []);

  const animatedGestureHandler = useAnimatedGestureHandler(
    {
      onStart: () => {
        isSwiping.value = 1;
        runOnJS(onHold)();
      },
      onActive: (e) => {
        const newValue = e.translationX;

        if (newValue >= 0 && newValue <= swipingRange - RIGHT_PADDING) {
          sliding.value = newValue;
        }

        if (sliding.value >= swipingRange - HANDLE_ENDING_POSITION) {
          runOnJS(setPassedThreshold)(true);
        } else {
          runOnJS(setPassedThreshold)(false);
        }
      },
      onCancel: () => {
        isSwiping.value = 0;
      },
      onFail: () => {
        isSwiping.value = 0;
      },
      onFinish: () => {
        isSwiping.value = 0;
      },
      onEnd: () => {
        if (sliding.value >= swipingRange - HANDLE_ENDING_POSITION) {
          sliding.value = withSpring(swipingRange - RIGHT_PADDING, {
            stiffness: 300,
          });
          runOnJS(onSwipe)();
        } else {
          sliding.value = withSpring(0);
        }
      },
    },
    [swipingRange],
  );

  const colors = useDerivedValue(() => {
    const inputRange = [
      0,
      swipingRange - HANDLE_ENDING_POSITION * 2,
      swipingRange - HANDLE_ENDING_POSITION,
    ];
    const backgroundColor = colorScheme === 'dark' ? '#262626' : '#e5e7eb';

    return [
      convertToRGBA(
        interpolateColor(sliding.value, inputRange, [
          backgroundColor,
          theme.meatBrown,
          theme.meatBrown,
        ]),
      ),
      convertToRGBA(
        interpolateColor(sliding.value, inputRange, [
          backgroundColor,
          backgroundColor,
          theme.meatBrown,
        ]),
      ),
    ];
  }, [sliding.value, swipingRange, colorScheme]);

  const handleAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        isSwiping.value || sliding.value - swipingRange + HANDLE_ENDING_POSITION,
        [0, 1],
        [theme.meatBrown, theme.charlestonGreen],
        'RGB',
      ),
      transform: [
        {
          translateX: interpolate(
            sliding.value,
            [0, buttonWidth],
            [0, buttonWidth],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [buttonWidth, swipingRange]);

  const handleIconAnimatedProps = useAnimatedProps(() => {
    return {
      color: interpolateColor(
        isSwiping.value || sliding.value - swipingRange + HANDLE_ENDING_POSITION,
        [0, 1],
        [theme.charlestonGreen, '#ffffff'],
        'RGB',
      ),
    };
  });

  const placeholderAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sliding.value, [0, swipingRange / 2], [1, 0], Extrapolate.CLAMP),
      transform: [
        {
          translateX: interpolate(
            sliding.value,
            [20, swipingRange],
            [0, buttonWidth / 4],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [buttonWidth, swipingRange]);

  return (
    <View
      style={[
        tw`flex flex-row justify-center items-center min-h-18 rounded-[4rem] border-4 border-[${theme.meatBrown}] bg-gray-200 dark:bg-neutral-800 overflow-hidden`,
        disabled && tw`opacity-50`,
        style,
      ]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => {
        setButtonHeight(nativeEvent.layout.height);
        setButtonWidth(nativeEvent.layout.width);
      }}>
      {buttonHeight && buttonWidth ? (
        <Canvas style={tw`absolute inset-0`}>
          <Rect height={buttonHeight} width={buttonWidth} x={0} y={0}>
            <LinearGradient
              colors={colors}
              end={vec(buttonWidth, buttonHeight)}
              start={vec(0, buttonHeight)}
            />
          </Rect>
        </Canvas>
      ) : null}
      <PanGestureHandler enabled={!disabled && !hasSwiped} onGestureEvent={animatedGestureHandler}>
        <Animated.View
          style={[
            tw`absolute left-0 h-16 w-16 rounded-full z-20 flex justify-center items-center`,
            handleAnimatedStyle,
          ]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            setHandleWidth(nativeEvent.layout.width);
          }}>
          <TouchableOpacity disabled={disabled || !hasSwiped} onPress={onRestart}>
            {loading ? (
              <HorizontalLoadingAnimation color={tw.color(`white`)} style={tw`h-10 w-10`} />
            ) : (
              <AnimatedMaterialCommunityIcons
                animatedProps={handleIconAnimatedProps}
                name={hasSwiped ? 'restart' : 'chevron-right'}
                size={32}
                style={[tw`shrink-0`]}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
      <AppText
        style={[
          tw`absolute right-8 text-base text-right font-normal text-slate-500 dark:text-slate-400`,
          placeholderAnimatedStyle,
        ]}>
        {placeholder}
      </AppText>
      {children}
    </View>
  );
};

export default SwipeableButton;
