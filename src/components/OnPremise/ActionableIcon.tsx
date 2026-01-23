import LoadingSpinner from '../LoadingSpinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { type ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppBlurView, { AppBlurViewProps } from '@/components/AppBlurView';
import AppPressable from '@/components/AppPressable';
import { theme } from '@/helpers/colors';

export type ActionableIconProps = AppBlurViewProps & {
  icon: keyof typeof mdiGlyphMap;
  activeIcon?: keyof typeof mdiGlyphMap;
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
  icon,
  activeIcon = icon,
  active = false,
  selected = false,
  disabled = false,
  loading,
  pending,
  onPress,
  style,
  iconStyle,
  children,
  ...props
}: ActionableIconProps) => {
  return (
    <AppBlurView
      style={[
        tw`absolute z-10 h-12 w-12 flex items-center justify-center rounded-full overflow-hidden`,
        tw`-mt-6 -ml-6`, // to properly center the button
        active
          ? { backgroundColor: theme.meatBrown }
          : tw`bg-gray-200/30 dark:bg-gray-900/30 bg-opacity-75 dark:bg-opacity-85`,
        // selected && tw.style(`ios:border-2 ios:border-neutral-600 ios:dark:border-neutral-500`),
        style,
      ]}
      {...props}>
      {loading && (
        <LoadingSpinner
          beamSize={2}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={tw`absolute h-full w-full`}
        />
      )}

      <AppPressable disabled={disabled} onPress={onPress}>
        <Animated.View style={iconStyle}>
          <MaterialCommunityIcons
            borderRadius={24}
            color={
              active
                ? theme.charlestonGreen
                : tw.prefixMatch('dark')
                  ? tw.color('neutral-500')
                  : tw.color('neutral-700')
            }
            iconStyle={{ marginRight: 0 }}
            name={active ? activeIcon : icon}
            size={32}
            style={[tw`shrink-0`, disabled && tw`opacity-70`, pending && tw`opacity-0`]}
          />
        </Animated.View>
        {pending && (
          <HorizontalLoadingAnimation
            color={
              !active && tw.prefixMatch('dark') ? tw.color('neutral-500') : tw.color('neutral-700')
            }
            style={tw`absolute w-10 h-10 -m-1`}
          />
        )}
        {children}
      </AppPressable>
    </AppBlurView>
  );
};

export default ActionableIcon;
