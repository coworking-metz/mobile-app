import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';

const UnlockCard: ForwardRefRenderFunction<
  TouchableOpacity,
  {
    children?: ReactNode;
    disabled?: boolean;
    style?: StyleProps;
  }
> = ({ children, disabled = false, style }, ref) => {
  const { t } = useTranslation();

  return (
    <Animated.View
      style={[
        tw`flex flex-row items-center gap-3 px-3 rounded-2xl min-h-18 overflow-hidden relative bg-gray-200 dark:bg-gray-900`,
        style,
      ]}>
      <Animated.View style={tw`bg-gray-300 dark:bg-gray-700 rounded-full p-2 z-20`}>
        <View style={[tw`relative h-8 w-8 shrink-0`]}>
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
            iconStyle={{ height: 32, width: 32, marginRight: 0 }}
            name="lightbulb-group-outline"
            size={32}
            style={[tw`shrink-0`, disabled && tw`opacity-40`]}
          />
        </View>
      </Animated.View>
      <Animated.View style={tw`flex flex-col z-20 w-full shrink`}>
        <Text
          style={[
            tw`text-xl font-medium text-slate-900 dark:text-gray-200`,
            disabled && tw`opacity-30`,
          ]}>
          {t('controls.title')}
        </Text>
        {/* <View style={[tw`flex flex-row items-center gap-1`]}>
          <Text
            style={[
              tw`flex flex-row items-center text-base text-slate-500 dark:text-slate-400 grow`,
              disabled && tw`opacity-30`,
            ]}>
            {t('controls.description')}
          </Text>
        </View> */}
      </Animated.View>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
        iconStyle={{ height: 32, width: 32, marginRight: 0 }}
        name="chevron-right"
        size={32}
        style={[tw`shrink-0`, disabled && tw`opacity-40`]}
      />
    </Animated.View>
  );
};

export default forwardRef(UnlockCard);
