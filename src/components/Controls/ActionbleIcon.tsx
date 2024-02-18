import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppBlurView from '@/components/AppBlurView';
import { theme } from '@/helpers/colors';

const ActionableIcon = ({
  activeIcon,
  inactiveIcon,
  active = false,
  disabled = false,
  loading,
  onPress,
  style,
  iconStyle,
}: {
  activeIcon: keyof typeof mdiGlyphMap;
  inactiveIcon: keyof typeof mdiGlyphMap;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProps;
  iconStyle?: StyleProps;
}) => {
  return (
    <AppBlurView
      intensity={8}
      style={[
        tw`absolute z-10 h-12 w-12 rounded-full p-2 overflow-hidden`,
        { transform: [{ translateX: -24 }, { translateY: -24 }] }, // to properly center the button
        active
          ? { backgroundColor: theme.meatBrown }
          : tw`bg-gray-200 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-85`,
        style,
      ]}
      tint={tw.prefixMatch('dark') ? 'dark' : 'light'}>
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        {loading && (
          <HorizontalLoadingAnimation
            color={!active && tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
          />
        )}
        <Animated.View style={iconStyle}>
          <MaterialCommunityIcons
            backgroundColor="transparent"
            borderRadius={24}
            color={active ? theme.charlestonGreen : tw.color('gray-500')}
            iconStyle={{ marginRight: 0 }}
            name={active ? activeIcon : inactiveIcon}
            size={32}
            style={[tw`shrink-0`, disabled && tw`opacity-70`, loading && tw`opacity-0`]}
            underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
          />
        </Animated.View>
      </TouchableOpacity>
    </AppBlurView>
  );
};

export default ActionableIcon;
