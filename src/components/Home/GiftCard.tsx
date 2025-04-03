import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      style={[tw`flex flex-col items-stretch w-36 p-1 relative rounded-2xl overflow-hidden`, style]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => {
        setHeight(nativeEvent.layout.height);
        setWidth(nativeEvent.layout.width);
      }}>
      <AppGlowingBorder
        backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
        height={height}
        style={tw`absolute top-0 left-0`}
        width={width}
      />

      <View
        style={[
          tw`flex flex-col items-start grow overflow-hidden gap-1 relative pl-3 pr-0 pt-2 pb-4`,
        ]}>
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
          name="gift"
          size={40}
        />

        <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
          {t('home.profile.gift.label')}
        </AppText>
        <AppText
          ellipsizeMode={'clip'}
          numberOfLines={2}
          style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
          {t('home.profile.gift.description')}
        </AppText>
      </View>
    </Animated.View>
  );
};

export default GiftCard;
