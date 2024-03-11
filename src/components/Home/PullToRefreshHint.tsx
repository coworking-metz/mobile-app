import ScrollDownAnimation from '../Animations/ScrollDownAnimation';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import useSettingsStore from '@/stores/settings';

const PullToRefreshHint = ({ style }: { style?: StyleProps }) => {
  const { t } = useTranslation();
  const hasLearnPullToRefresh = useSettingsStore((state) => state.hasLearnPullToRefresh);

  if (hasLearnPullToRefresh) {
    return null;
  }

  return (
    <View style={[tw`flex flex-col items-center gap-1`, style]}>
      <ScrollDownAnimation style={tw`h-6 w-full`} />
      <Animated.Text style={tw`text-xs font-extralight text-slate-500 dark:text-slate-400`}>
        {t('home.refresh.hint')}
      </Animated.Text>
    </View>
  );
};

export default PullToRefreshHint;
