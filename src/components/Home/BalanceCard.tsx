import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

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
    <View
      style={[
        tw`flex flex-col items-start gap-1 bg-gray-200 dark:bg-gray-900 rounded-2xl w-32 relative overflow-hidden px-3 pt-2 pb-4`,
        style,
      ]}>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
        name="ticket"
        size={40}
      />

      <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow`}>
        {t('home.profile.tickets.label')}
      </Text>
      {loading ? (
        <Skeleton
          backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
          height={28}
          show={loading}
          width={96}
        />
      ) : (
        <View style={tw`flex flex-row items-baseline gap-1`}>
          {count != 0 && (
            <Text
              numberOfLines={1}
              style={tw`text-2xl font-normal text-slate-900 dark:text-gray-200`}>
              {Math.abs(count)}
            </Text>
          )}
          <Text
            numberOfLines={1}
            style={[
              tw`font-normal`,
              count != 0
                ? tw`leading-6 text-sm text-slate-500 dark:text-slate-400`
                : tw`text-2xl text-gray-400 dark:text-slate-600`,
            ]}>
            {count < 0
              ? t('home.profile.tickets.depleted', {
                count: count,
              })
              : t('home.profile.tickets.available', {
                count: -count,
              })}
          </Text>
        </View>
      )}

      {valid === false ? (
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('yellow-600') : tw.color('yellow-500')}
          name="alert"
          size={20}
          style={tw`absolute top-3 right-3`}
        />
      ) : (
        count > 0 && (
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('emerald-700') : tw.color('emerald-600')}
            name="check-circle"
            size={20}
            style={tw`absolute top-3 right-3`}
          />
        )
      )}
    </View>
  );
};

export default BalanceCard;
