import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useIsFocused } from 'expo-router';
import { isNil } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import HappySunAnimation from '@/components/Animations/HappySunAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { getOnPremiseState } from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';

const PtiPoulaillerClimateBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    loading?: boolean;
    temperatureLevel?: number;
    humidityLevel?: number;
  }
> = ({ loading = false, temperatureLevel, humidityLevel, style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const activeSince = useAppState();
  const isFocus = useIsFocused();

  const { dataUpdatedAt: onPremiseStateUpdatedAt } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
  });

  // count duration since last fetch to redraw stale data text
  // every time the screen gets focused or the app gets back to foreground
  const durationSinceLastFetch = useMemo(() => {
    return onPremiseStateUpdatedAt ? dayjs().diff(onPremiseStateUpdatedAt, 'second') : null;
  }, [onPremiseStateUpdatedAt, isFocus, activeSince]);

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
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

      <View style={tw`flex flex-col w-full mt-4`}>
        <SectionTitle loading={loading} title={t('onPremise.climate.sensors.label')}>
          {!isNil(durationSinceLastFetch) && durationSinceLastFetch > 300 && (
            <AppText
              style={tw`ml-auto text-xs font-normal text-right text-slate-500 dark:text-neutral-500`}>
              {durationSinceLastFetch > 3_600
                ? dayjs(onPremiseStateUpdatedAt).calendar()
                : dayjs(onPremiseStateUpdatedAt).fromNow()}
            </AppText>
          )}
        </SectionTitle>
        <ServiceRow
          withBottomDivider
          label={t('onPremise.climate.temperature.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <LoadingSkeleton height={24} width={48} />
          ) : !isNil(temperatureLevel) ? (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-400 text-right`}>
              {t('onPremise.climate.temperature.level', {
                level: temperatureLevel,
              })}
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

export default forwardRef(PtiPoulaillerClimateBottomSheet);
