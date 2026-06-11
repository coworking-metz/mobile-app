import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import AppPressable, { AppPressableRef } from '@/components/AppPressable';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';

const OnPremiseCard: ForwardRefRenderFunction<
  AppPressableRef,
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
    <AppPressable ref={ref} disabled={disabled} style={tw`flex-1`} onPress={onPress}>
      <AppSquircleView
        style={[
          tw`relative flex min-h-20 flex-row items-center gap-4 overflow-hidden rounded-3xl bg-gray-300/60 px-4 dark:bg-zinc-900/85`,
          style,
        ]}>
        <Animated.View style={tw`z-20 rounded-full bg-gray-300 p-2 dark:bg-zinc-800`}>
          <View style={tw`relative size-8 shrink-0`}>
            <MaterialCommunityIcons
              color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
              iconStyle={{ height: 32, width: 32, marginRight: 0 }}
              name="floor-plan"
              size={32}
              style={[tw`shrink-0`, disabled && tw`opacity-40`]}
            />
          </View>
        </Animated.View>
        <Animated.View style={tw`z-20 flex w-full shrink grow flex-col`}>
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
              style={tw`flex flex-row items-center text-base font-normal text-slate-500 dark:text-neutral-500`}>
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
      </AppSquircleView>
    </AppPressable>
  );
};

export default forwardRef(OnPremiseCard);
