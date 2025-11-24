import AppPressable from '../AppPressable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppBlurView, { AppBlurViewProps } from '@/components/AppBlurView';
import { theme } from '@/helpers/colors';

const ActionablePhoneBooths = ({
  icon,
  activeIcon = icon,
  unknownIcon = icon,
  actives = [false, false],
  selected = false,
  disabled = false,
  loading,
  onPress,
  style,
  ...props
}: {
  activeIcon?: keyof typeof mdiGlyphMap;
  icon: keyof typeof mdiGlyphMap;
  unknownIcon?: keyof typeof mdiGlyphMap;
  actives?: (boolean | null)[];
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
} & AppBlurViewProps) => {
  const isFirstPhoneBoothSelected = useMemo(() => {
    const [firstPhoneBooth] = actives;
    return firstPhoneBooth;
  }, [actives]);

  const isSecondPhoneBoothSelected = useMemo(() => {
    const [_, secondPhoneBooth] = actives;
    return secondPhoneBooth;
  }, [actives]);

  return (
    <AppBlurView
      style={[
        tw`absolute z-10 h-12 w-24 flex items-stretch rounded-full overflow-hidden bg-gray-200 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-85`,
        selected && tw.style(`border-2 border-gray-500 dark:border-gray-400`),
        style,
      ]}
      {...props}>
      <AppPressable disabled={disabled} style={tw`h-full w-full`} onPress={onPress}>
        {loading ? (
          <HorizontalLoadingAnimation
            color={
              !isFirstPhoneBoothSelected && tw.prefixMatch('dark')
                ? tw.color('gray-200')
                : tw.color('gray-700')
            }
            style={tw`w-10 h-10 m-auto`}
          />
        ) : (
          <Animated.View style={tw`flex flex-row items-center grow`}>
            <Animated.View
              style={[
                tw`h-full grow p-1 flex flex-row items-center justify-center`,
                isFirstPhoneBoothSelected && { backgroundColor: theme.meatBrown },
              ]}>
              <MaterialCommunityIcons
                backgroundColor="transparent"
                borderRadius={24}
                color={isFirstPhoneBoothSelected ? theme.charlestonGreen : tw.color('gray-500')}
                iconStyle={{ marginRight: 0 }}
                name={
                  isNil(isFirstPhoneBoothSelected)
                    ? unknownIcon
                    : isFirstPhoneBoothSelected
                      ? activeIcon
                      : icon
                }
                size={32}
                style={[tw`shrink-0`, disabled && tw`opacity-70`, loading && tw`opacity-0`]}
                underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
              />
            </Animated.View>
            <Animated.View
              style={[
                tw`h-full grow p-1 flex flex-row items-center justify-center`,
                isSecondPhoneBoothSelected && { backgroundColor: theme.meatBrown },
              ]}>
              <MaterialCommunityIcons
                backgroundColor="transparent"
                borderRadius={24}
                color={isSecondPhoneBoothSelected ? theme.charlestonGreen : tw.color('gray-500')}
                iconStyle={{ marginRight: 0 }}
                name={
                  isNil(isSecondPhoneBoothSelected)
                    ? unknownIcon
                    : isSecondPhoneBoothSelected
                      ? activeIcon
                      : icon
                }
                size={32}
                style={[tw`shrink-0`, disabled && tw`opacity-70`, loading && tw`opacity-0`]}
                underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
              />
            </Animated.View>
          </Animated.View>
        )}
      </AppPressable>
    </AppBlurView>
  );
};

export default ActionablePhoneBooths;
