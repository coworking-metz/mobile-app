import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const MAX_DEPLETION_ALLOWED = 5;

const BalanceCard = ({
  count = 0,
  total = 10,
  loading = false,
}: {
  count?: number;
  total?: number;
  loading?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <View
      style={tw`flex flex-row items-start justify-start gap-2 bg-gray-200 dark:bg-gray-900 rounded-2xl h-24 self-stretch relative overflow-hidden px-3 py-2`}>
      {loading ? (
        <View style={tw`flex flex-row justify-between items-end grow pt-1`}>
          <View style={tw`flex flex-col gap-2`}>
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={16}
              show={loading}
              width={128}
            />
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={28}
              show={loading}
              width={192}
            />
          </View>
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={32}
            radius="round"
            show={loading}
          />
        </View>
      ) : (
        <>
          <View style={tw`flex flex-col shrink grow`}>
            <Text style={tw`text-base text-slate-500 dark:text-slate-400`}>
              {t('home.tickets.coupons.label')}
            </Text>
            <Text style={tw`text-2xl text-slate-900 dark:text-gray-200`}>
              {count >= 0
                ? t('home.tickets.coupons.available', {
                    count: count,
                  })
                : t('home.tickets.coupons.depleted', {
                    count: -count,
                  })}
            </Text>
          </View>
          {count < 0 && (
            <MaterialCommunityIcons
              color={tw.color('yellow-500')}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="alert"
              size={36}
              style={tw`self-center shrink-0 grow-0`}
            />
          )}
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
            iconStyle={tw`h-6 w-6 mr-0`}
            name="ticket"
            size={36}
            style={tw`self-center shrink-0`}
          />
        </>
      )}

      <View style={tw`absolute bottom-0 left-0 right-0 h-2 bg-neutral-300 dark:bg-gray-800`}>
        {count >= 0 ? (
          <LinearGradient
            colors={[theme.peachYellow, theme.meatBrown]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 1 }}
            style={tw`rounded-full h-full w-[${count < total ? (count / total) * 100 : 100}%]`}
          />
        ) : (
          <LinearGradient
            colors={
              tw.prefixMatch('dark')
                ? ([tw.color('red-700'), tw.color('red-900')] as string[])
                : ([tw.color('red-600'), tw.color('red-800')] as string[])
            }
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 1 }}
            style={tw`rounded-full h-full w-[${
              -count < MAX_DEPLETION_ALLOWED ? (-count / MAX_DEPLETION_ALLOWED) * 100 : 100
            }%]`}
          />
        )}
      </View>
    </View>
  );
};

export default BalanceCard;
