import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import AppTouchable, { AppTouchableRef } from '@/components/AppTouchable';

const OnPremiseCard: ForwardRefRenderFunction<
  AppTouchableRef,
  {
    children?: ReactNode;
    disabled?: boolean;
    location?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
  }
> = ({ onPress, disabled = false, location, style }, ref) => {
  const { t } = useTranslation();

  return (
    <AppTouchable
      ref={ref}
      disabled={disabled}
      style={[
        tw`flex flex-row items-center gap-4 px-4 rounded-2xl min-h-20 overflow-hidden relative bg-gray-200 dark:bg-gray-900`,
        style,
      ]}
      onPress={onPress}>
      <Animated.View style={tw`bg-gray-300 dark:bg-gray-700 rounded-full p-2 z-20`}>
        <View style={[tw`relative h-8 w-8 shrink-0`]}>
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
            iconStyle={{ height: 32, width: 32, marginRight: 0 }}
            name="floor-plan"
            size={32}
            style={[tw`shrink-0`, disabled && tw`opacity-40`]}
          />
        </View>
      </Animated.View>
      <Animated.View style={tw`flex flex-col z-20 w-full shrink grow`}>
        <AppText
          numberOfLines={location ? 1 : 2}
          style={[
            tw`text-xl font-medium text-slate-900 dark:text-gray-200`,
            disabled && tw`opacity-30`,
          ]}>
          {t('onPremise.title')}
        </AppText>
        {location && (
          <AppText
            numberOfLines={1}
            style={[
              tw`flex flex-row items-center text-base font-normal text-slate-500 dark:text-slate-400`,
            ]}>
            {location}
          </AppText>
        )}
      </Animated.View>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
        iconStyle={{ height: 32, width: 32, marginRight: 0 }}
        name="chevron-right"
        size={32}
        style={[tw`shrink-0`, disabled && tw`opacity-40`]}
      />
    </AppTouchable>
  );
};

export default forwardRef(OnPremiseCard);
