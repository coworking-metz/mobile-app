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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  Extrapolation,
  convertToRGBA,
  interpolate,
  interpolateColor,
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

  const onRestart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSwiped(false);
    onReset?.();
  }, []);

  const pan = Gesture.Pan()
    .onBegin(() => {
      isSwiping.value = 1;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    })
    .onChange((event) => {
      const newValue = event.translationX;

      if (newValue >= 0 && newValue <= swipingRange - RIGHT_PADDING) {
        sliding.value = newValue;
      }

      if (sliding.value >= swipingRange - HANDLE_ENDING_POSITION) {
        setPassedThreshold(true);
      } else {
        setPassedThreshold(false);
      }
    })
    .onFinalize(() => {
      if (sliding.value >= swipingRange - HANDLE_ENDING_POSITION) {
        sliding.value = withSpring(swipingRange - RIGHT_PADDING, {
          stiffness: 300,
        });
        setSwiped(true);
        onSwiped?.();
      } else {
        sliding.value = withSpring(0);
      }
    })
    .onEnd(() => {
      isSwiping.value = 0;
    })
    .runOnJS(true);

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
        tw.style(
          `flex flex-row justify-center items-center min-h-18 rounded-[4rem] border-4 border-[${theme.meatBrown}] bg-gray-200 dark:bg-neutral-800 overflow-hidden`,
          disabled && `opacity-50 pointer-events-none`,
        ),
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
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            tw`absolute left-0 h-16 w-16 rounded-full z-20 flex justify-center items-center`,
            handleAnimatedStyle,
          ]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            setHandleWidth(nativeEvent.layout.width);
          }}>
          <TouchableOpacity disabled={loading || disabled} onPress={onRestart}>
            {loading ? (
              <HorizontalLoadingAnimation color={tw.color(`white`)} style={tw`h-10 w-10`} />
            ) : (
              <AnimatedMaterialCommunityIcons
                animatedProps={handleIconAnimatedProps}
                name={hasSwiped ? 'restart' : 'chevron-right'}
                size={32}
                style={tw`shrink-0`}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
      <AppText
        style={[
          tw`absolute insets-0 ml-10 text-base text-center font-medium text-slate-500 dark:text-slate-400`,
          placeholderAnimatedStyle,
        ]}>
        {placeholder}
      </AppText>
      {children}
    </View>
  );
};

export default SwipeableButton;
