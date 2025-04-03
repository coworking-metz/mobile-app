import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';
import ScrollDownAnimation from '@/components/Animations/ScrollDownAnimation';
import AppText from '@/components/AppText';
import useSettingsStore from '@/stores/settings';

const PullToRefreshHint = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { t } = useTranslation();
  const hasLearnPullToRefresh = useSettingsStore((state) => state.hasLearnPullToRefresh);

  if (hasLearnPullToRefresh) {
    return null;
  }

  return (
    <View style={[tw`flex flex-col items-center gap-1`, style]}>
      <ScrollDownAnimation style={tw`h-6 w-full`} />
      <AppText style={tw`text-xs font-extralight text-slate-500 dark:text-slate-400`}>
        {t('home.refresh.hint')}
      </AppText>
    </View>
  );
};

export default PullToRefreshHint;
