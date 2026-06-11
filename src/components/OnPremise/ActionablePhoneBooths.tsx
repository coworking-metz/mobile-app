import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppBlurView, { AppBlurViewProps } from '@/components/AppBlurView';
import { MaterialCommunityIconsName } from '@/components/AppIcon';
import AppPressable from '@/components/AppPressable';
import { theme } from '@/helpers/colors';

const ActionablePhoneBooths = ({
  icon,
  activeIcon = icon,
  unknownIcon = icon,
  actives = [false, false],
  disabled = false,
  loading,
  onPress,
  style,
  ...props
}: {
  activeIcon?: MaterialCommunityIconsName;
  icon: MaterialCommunityIconsName;
  unknownIcon?: MaterialCommunityIconsName;
  actives?: (boolean | null)[];
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
      radius={Platform.OS === 'ios' ? 15 : 30}
      style={[
        tw`absolute z-10 flex h-12 w-24 items-stretch overflow-hidden rounded-full`,
        // selected && tw.style(`ios:border-2 ios:border-neutral-600 ios:dark:border-neutral-500`),
        style,
      ]}
      {...props}>
      <AppPressable disabled={disabled} style={tw`size-full`} onPress={onPress}>
        {loading ? (
          <HorizontalLoadingAnimation
            color={
              !isFirstPhoneBoothSelected && tw.prefixMatch('dark')
                ? tw.color('neutral-400')
                : tw.color('neutral-700')
            }
            style={tw`m-auto size-10`}
          />
        ) : (
          <Animated.View style={tw`flex grow flex-row items-center`}>
            <Animated.View
              style={[
                tw`flex h-full grow flex-row items-center justify-center bg-gray-200/30 p-1 dark:bg-zinc-900/30`,
                isFirstPhoneBoothSelected && { backgroundColor: theme.meatBrown },
              ]}>
              <MaterialCommunityIcons
                borderRadius={24}
                color={
                  isFirstPhoneBoothSelected
                    ? theme.charlestonGreen
                    : tw.prefixMatch('dark')
                      ? tw.color('neutral-400')
                      : tw.color('neutral-700')
                }
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
              />
            </Animated.View>
            <Animated.View
              style={[
                tw`flex h-full grow flex-row items-center justify-center bg-gray-200/30 p-1 dark:bg-zinc-900/30`,
                isSecondPhoneBoothSelected && { backgroundColor: theme.meatBrown },
              ]}>
              <MaterialCommunityIcons
                borderRadius={24}
                color={
                  isSecondPhoneBoothSelected
                    ? theme.charlestonGreen
                    : tw.prefixMatch('dark')
                      ? tw.color('neutral-400')
                      : tw.color('neutral-700')
                }
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
              />
            </Animated.View>
          </Animated.View>
        )}
      </AppPressable>
    </AppBlurView>
  );
};

export default ActionablePhoneBooths;
