import GiftCard from './GiftCard';
import AppSquircleView from '../AppSquircleView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isNil } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import useSettingsStore from '@/stores/settings';

const BirthdayCard = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { t } = useTranslation();
  const settingsStore = useSettingsStore();

  if (isNil(settingsStore.hasSeenBirthdayPresentAt)) {
    return <GiftCard style={[tw`-m-1`, style]} />;
  }

  return (
    <AppSquircleView
      style={[
        tw`flex flex-col items-start gap-1 bg-gray-300/60 dark:bg-zinc-900/85 rounded-2xl px-3 pt-2 pb-4`,
        style,
      ]}>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
        name="cake"
        size={40}
      />

      <AppText
        ellipsizeMode={'clip'}
        numberOfLines={2}
        style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow`}>
        {t('home.profile.birthday.label')}
      </AppText>

      <AppText style={tw`mt-auto text-2xl font-normal text-gray-400 dark:text-slate-600`}>
        🥳
      </AppText>
    </AppSquircleView>
  );
};

export default BirthdayCard;
