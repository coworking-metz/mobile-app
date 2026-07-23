import AppIcon from '../AppIcon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';
import tw from 'twrnc';
import { AppGlowingBorder } from '@/components/AppGlowingBorder';
import AppText from '@/components/AppText';

const GiftCard = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { t } = useTranslation();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  return (
    <Animated.View
      entering={FadeInLeft.duration(500)}
      exiting={FadeOutLeft.duration(500)}
      style={[tw`relative flex flex-col items-stretch overflow-hidden rounded-2xl p-1`, style]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => {
        setHeight(nativeEvent.layout.height);
        setWidth(nativeEvent.layout.width);
      }}>
      <AppGlowingBorder
        backgroundColor={tw.prefixMatch('dark') ? tw.color('zinc-900/85') : tw.color('gray-300/60')}
        height={height}
        style={tw`absolute left-0 top-0`}
        width={width}
      />

      <View
        style={tw`relative flex grow flex-col items-start gap-1 overflow-hidden pb-4 pl-3 pr-0 pt-2`}>
        <AppIcon
          color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
          icon="gift"
          size={40}
        />

        <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
          {t('home.profile.gift.label')}
        </AppText>
        <AppText
          ellipsizeMode={'clip'}
          numberOfLines={2}
          style={tw`text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {t('home.profile.gift.description')}
        </AppText>
      </View>
    </Animated.View>
  );
};

export default GiftCard;
