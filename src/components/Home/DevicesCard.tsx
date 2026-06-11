import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import Animated, { AnimatedProps, BounceIn, BounceOut } from 'react-native-reanimated';
import tw from 'twrnc';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const DevicesCard = ({
  count,
  pending,
  style,
}: AnimatedProps<ViewProps> & {
  count?: number;
  pending?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();

  return (
    <View style={[tw`relative flex flex-row items-stretch`]}>
      <AppSquircleView
        style={[
          tw`relative flex flex-col items-start gap-1 rounded-2xl bg-gray-300/60 px-3 pb-4 pt-2 dark:bg-zinc-900/85`,
          style,
        ]}>
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
          name="devices"
          size={40}
        />

        <AppText
          ellipsizeMode={'clip'}
          numberOfLines={2}
          style={tw`grow text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {t('home.profile.devices.description')}
        </AppText>

        {pending ? (
          <LoadingSkeleton height={24} width={80} />
        ) : (
          <AppText
            ellipsizeMode={'clip'}
            numberOfLines={1}
            style={[
              tw`mt-auto w-full text-2xl font-normal`,
              count
                ? tw`text-slate-900 dark:text-gray-200`
                : tw`text-gray-400 dark:text-neutral-700`,
            ]}>
            {t('home.profile.devices.count', { count: count ?? 0 })}
          </AppText>
        )}
      </AppSquircleView>

      {count === 0 && (
        <Animated.View
          entering={BounceIn.duration(1000).delay(300)}
          exiting={BounceOut.duration(1000)}
          style={tw`absolute -right-1 -top-1 z-10 flex size-5 items-center justify-center rounded-full bg-gray-100 dark:bg-black`}>
          <View style={tw`size-3 rounded-full bg-red-600 dark:bg-red-700`} />
        </Animated.View>
      )}
    </View>
  );
};

export default DevicesCard;
