import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import tw from 'twrnc';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const BalanceCard = ({
  valid,
  count = 0,
  loading = false,
  style,
}: {
  valid?: boolean;
  count?: number;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();

  return (
    <View style={[tw`relative flex flex-row items-stretch`]}>
      <AppSquircleView
        style={[
          tw`flex flex-col items-start gap-1 rounded-2xl bg-gray-300/60 px-3 pb-4 pt-2 dark:bg-zinc-900/85`,
          style,
        ]}>
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
          name="ticket"
          size={40}
        />

        <AppText
          ellipsizeMode="clip"
          numberOfLines={2}
          style={tw`grow text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {t('home.profile.tickets.label')}
        </AppText>
        {loading ? (
          <LoadingSkeleton height={28} show={loading} width={96} />
        ) : (
          <Trans
            components={[
              <AppText
                key="emphasis"
                numberOfLines={1}
                style={tw`text-2xl font-normal text-slate-900 dark:text-gray-200`}
              />,
            ]}
            defaults={
              count >= 0
                ? t('home.profile.tickets.available', { count: count })
                : t('home.profile.tickets.depleted', { count: -count })
            }
            ellipsizeMode="clip"
            numberOfLines={1}
            parent={AppText}
            style={[
              tw`flex-shrink font-normal`,
              count != 0
                ? tw`ml-0.5 text-sm leading-[1.625rem] text-slate-500 dark:text-neutral-500`
                : tw`text-2xl text-gray-400 dark:text-neutral-700`,
            ]}
          />
        )}

        {count > 0 && (
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('emerald-700') : tw.color('emerald-600')}
            name="check-circle"
            size={20}
            style={tw`absolute right-3 top-3 z-10`}
          />
        )}
      </AppSquircleView>

      {valid === false && (
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

export default BalanceCard;
