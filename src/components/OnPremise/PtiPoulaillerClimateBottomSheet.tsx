import HappySunAnimation from '../Animations/HappySunAnimation';
import AppBottomSheet from '../AppBottomSheet';
import ServiceRow from '../Settings/ServiceRow';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

const PtiPoulaillerClimateBottomSheet = ({
  loading = false,
  temperatureLevel = 0,
  humidityLevel = 0,
  style,
  onClose,
}: {
  loading?: boolean;
  temperatureLevel?: number;
  humidityLevel?: number;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch p-6`}
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <HappySunAnimation autoPlay style={tw`w-full h-[224px] -my-4`} />
      <Text
        style={tw`text-center self-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.climate.label')}
      </Text>
      <Text style={tw`text-left text-base font-normal text-slate-500 mt-6`}>
        {t('onPremise.climate.description')}
      </Text>

      <View style={tw`flex flex-col w-full mt-2`}>
        <ServiceRow
          withBottomDivider
          label={t('onPremise.climate.temperature.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={24}
              width={48}
            />
          ) : (
            <Text
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
              {t('onPremise.climate.temperature.level', { level: temperatureLevel })}
            </Text>
          )}
        </ServiceRow>
        <ServiceRow label={t('onPremise.climate.humidity.label')} style={tw`w-full px-0`}>
          {loading ? (
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={24}
              width={48}
            />
          ) : (
            <Text
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
              {t('onPremise.climate.humidity.level', { level: humidityLevel })}
            </Text>
          )}
        </ServiceRow>
      </View>
    </AppBottomSheet>
  );
};

export default PtiPoulaillerClimateBottomSheet;
