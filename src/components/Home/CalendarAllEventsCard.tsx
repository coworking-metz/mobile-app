import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import tw from 'twrnc';

const BalanceCard = ({ loading = false }: { loading?: boolean }) => {
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
          <View style={tw`flex flex-col shrink-1 mr-auto`}>
            <Text style={tw`text-base text-slate-500 dark:text-slate-400`}>
              {t('home.calendar.all.description')}
            </Text>
            <Text style={tw`text-2xl text-slate-900 dark:text-gray-200`}>
              {t('home.calendar.all.label')}
            </Text>
          </View>
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
            iconStyle={tw`h-6 w-6 mr-0`}
            name="chevron-right"
            size={36}
            style={tw`self-center shrink-0`}
          />
        </>
      )}
    </View>
  );
};

export default BalanceCard;
