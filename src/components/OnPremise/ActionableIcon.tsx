import LoadingSpinner from '../LoadingSpinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { type ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppBlurView from '@/components/AppBlurView';
import AppTouchable from '@/components/AppTouchable';
import { theme } from '@/helpers/colors';

export type ActionableIconProps = {
  activeIcon: keyof typeof mdiGlyphMap;
  inactiveIcon: keyof typeof mdiGlyphMap;
  active?: boolean;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  pending?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const ActionableIcon = ({
  activeIcon,
  inactiveIcon,
  active = false,
  selected = false,
  disabled = false,
  loading,
  pending,
  onPress,
  style,
  iconStyle,
  children,
}: ActionableIconProps) => {
  return (
    <AppBlurView
      style={[
        tw`absolute z-10 h-12 w-12 flex items-center justify-center rounded-full overflow-hidden`,
        { transform: [{ translateX: -24 }, { translateY: -24 }] }, // to properly center the button
        active
          ? { backgroundColor: theme.meatBrown }
          : tw`bg-gray-200 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-85`,
        selected && tw.style(`border-2 border-gray-500 dark:border-gray-400`),
        style,
      ]}>
      {loading && (
        <LoadingSpinner
          beamSize={2}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={tw`absolute h-full w-full`}
        />
      )}

      <AppTouchable disabled={disabled} onPress={onPress}>
        <Animated.View style={iconStyle}>
          <MaterialCommunityIcons
            backgroundColor="transparent"
            borderRadius={24}
            color={active ? theme.charlestonGreen : tw.color('gray-500')}
            iconStyle={{ marginRight: 0 }}
            name={active ? activeIcon : inactiveIcon}
            size={32}
            style={[tw`shrink-0`, disabled && tw`opacity-70`, pending && tw`opacity-0`]}
            underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
          />
        </Animated.View>
        {pending && (
          <HorizontalLoadingAnimation
            color={!active && tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
            style={tw`absolute w-10 h-10 -m-1`}
          />
        )}
        {children}
      </AppTouchable>
    </AppBlurView>
  );
};

export default ActionableIcon;
