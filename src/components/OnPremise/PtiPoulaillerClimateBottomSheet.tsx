import { isNil } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import HappySunAnimation from '@/components/Animations/HappySunAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const PtiPoulaillerClimateBottomSheet = ({
  loading = false,
  temperatureLevel,
  humidityLevel,
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
      contentContainerStyle={tw`flex flex-col items-stretch pt-6 px-6`}
      style={style}
      onClose={onClose}>
      <HappySunAnimation autoPlay style={tw`w-full h-[224px] -my-4`} />
      <AppText
        style={tw`text-center self-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.climate.label')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 mt-6`}>
        {t('onPremise.climate.description')}
      </AppText>

      <View style={tw`flex flex-col w-full mt-2`}>
        <ServiceRow
          withBottomDivider
          label={t('onPremise.climate.temperature.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : !isNil(temperatureLevel) ? (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-400 text-right`}>
              {t('onPremise.climate.temperature.level', { level: temperatureLevel })}
            </AppText>
          ) : null}
        </ServiceRow>
        <ServiceRow label={t('onPremise.climate.humidity.label')} style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : !isNil(humidityLevel) ? (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-400 text-right`}>
              {t('onPremise.climate.humidity.level', { level: humidityLevel })}
            </AppText>
          ) : null}
        </ServiceRow>
      </View>
    </AppBottomSheet>
  );
};

export default PtiPoulaillerClimateBottomSheet;
