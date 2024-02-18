import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppBlurView from '@/components/AppBlurView';
import { theme } from '@/helpers/colors';

const ActionablePhoneBooths = ({
  activeIcon,
  inactiveIcon,
  actives = [false, false],
  disabled = false,
  loading,
  onPress,
  style,
}: {
  activeIcon: keyof typeof mdiGlyphMap;
  inactiveIcon: keyof typeof mdiGlyphMap;
  actives?: boolean[];
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProps;
}) => {
  const isFirstPhoneBoothSelected = useMemo(() => {
    const [firstPhoneBooth] = actives;
    return !!firstPhoneBooth;
  }, [actives]);

  const isSecondPhoneBoothSelected = useMemo(() => {
    const [_, secondPhoneBooth] = actives;
    return !!secondPhoneBooth;
  }, [actives]);

  return (
    <AppBlurView
      intensity={8}
      style={[
        tw`absolute z-10 h-12 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-85`,
        style,
      ]}
      tint={tw.prefixMatch('dark') ? 'dark' : 'light'}>
      <TouchableOpacity
        disabled={disabled}
        style={tw`flex flex-row items-center justify-between h-full w-full`}
        onPress={onPress}>
        {loading ? (
          <HorizontalLoadingAnimation
            color={
              !isFirstPhoneBoothSelected && tw.prefixMatch('dark')
                ? tw.color('gray-200')
                : tw.color('gray-700')
            }
          />
        ) : (
          <>
            <Animated.View
              style={[
                tw`h-full w-1/2 p-2 flex flex-row items-center justify-center`,
                isFirstPhoneBoothSelected && { backgroundColor: theme.meatBrown },
              ]}>
              <MaterialCommunityIcons
                backgroundColor="transparent"
                borderRadius={24}
                color={isFirstPhoneBoothSelected ? theme.charlestonGreen : tw.color('gray-500')}
                iconStyle={{ marginRight: 0 }}
                name={isFirstPhoneBoothSelected ? activeIcon : inactiveIcon}
                size={32}
                style={[tw`shrink-0`, disabled && tw`opacity-70`, loading && tw`opacity-0`]}
                underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
              />
            </Animated.View>
            <Animated.View
              style={[
                tw`h-full w-1/2 p-2 flex flex-row items-center justify-center`,
                isSecondPhoneBoothSelected && { backgroundColor: theme.meatBrown },
              ]}>
              <MaterialCommunityIcons
                backgroundColor="transparent"
                borderRadius={24}
                color={isSecondPhoneBoothSelected ? theme.charlestonGreen : tw.color('gray-500')}
                iconStyle={{ marginRight: 0 }}
                name={isSecondPhoneBoothSelected ? activeIcon : inactiveIcon}
                size={32}
                style={[tw`shrink-0`, disabled && tw`opacity-70`, loading && tw`opacity-0`]}
                underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
              />
            </Animated.View>
          </>
        )}
      </TouchableOpacity>
    </AppBlurView>
  );
};

export default ActionablePhoneBooths;
