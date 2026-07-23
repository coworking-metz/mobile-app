import AppArcSlider from '../AppArcSlider';
import AppIcon from '../AppIcon';
import ReanimatedText from '../ReanimatedText';
import { useQueryClient } from '@tanstack/react-query';
import { compact } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import tw from 'twrnc';
import AirConditionerAnimation from '@/components/Animations/AirConditionerAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { handleSilentError } from '@/helpers/error';
import {
  OnPremiseAirConditioner,
  OnPremiseState,
  turnOffAirConditioner,
  turnOnAirConditioner,
  updateAirConditionerTargetTemperature,
} from '@/services/api/services';
import { onPremiseQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const DEFAULT_MIN_TEMPERATURE = 16;
const DEFAULT_MAX_TEMPERATURE = 30;

type SelectedAirConditioner = OnPremiseAirConditioner & { id: 'north' | 'south' };

const AirConditioningBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    airConditioner?: SelectedAirConditioner | null;
    loading?: boolean;
  }
> = ({ airConditioner, loading = false, style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const noticeStore = useNoticeStore();
  const queryClient = useQueryClient();
  const targetTemperature = useSharedValue(
    airConditioner?.targetTemperature ?? DEFAULT_MIN_TEMPERATURE,
  );
  const [isTogglingActive, setTogglingActive] = useState(false);
  const [isUpdatingTargetTemperature, setUpdatingTargetTemperature] = useState(false);

  useEffect(() => {
    if (airConditioner) {
      targetTemperature.value = airConditioner.targetTemperature;
    }
  }, [airConditioner?.id]);

  const formattedAnimatedTemperature = useDerivedValue(() => {
    return targetTemperature.value ? `${Number(targetTemperature.value).toFixed(0)}°` : '';
  }, [targetTemperature]);

  const onSlidingComplete = (value: number) => {
    if (!airConditioner) {
      return;
    }

    setUpdatingTargetTemperature(true);
    updateAirConditionerTargetTemperature(airConditioner.id, value)
      .then((updatedAirConditioner) => {
        queryClient.setQueryData(onPremiseQueryKeys.state(), (state: OnPremiseState) => ({
          ...state,
          airConditioners: {
            ...state.airConditioners,
            [airConditioner.id]: {
              ...state.airConditioners[airConditioner.id],
              ...updatedAirConditioner,
            },
          },
        }));
        queryClient.invalidateQueries({ queryKey: onPremiseQueryKeys.state() });
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('onPremise.airConditioning.onToggle.fail'),
        }),
      )
      .finally(() => setUpdatingTargetTemperature(false));
  };

  const toggleActive = () => {
    if (!airConditioner) {
      return;
    }

    setTogglingActive(true);
    (airConditioner.active
      ? turnOffAirConditioner(airConditioner.id)
      : turnOnAirConditioner(airConditioner.id)
    )
      .then(({ active }) => {
        queryClient.setQueryData(onPremiseQueryKeys.state(), (state: OnPremiseState) => ({
          ...state,
          airConditioners: {
            ...state.airConditioners,
            [airConditioner.id]: {
              ...state.airConditioners[airConditioner.id],
              active,
            },
          },
        }));
        queryClient.invalidateQueries({ queryKey: onPremiseQueryKeys.state() });
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('onPremise.airConditioning.onToggle.fail'),
        }),
      )
      .finally(() => setTogglingActive(false));
  };

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      <AirConditionerAnimation
        autoPlay={airConditioner?.active}
        loop={airConditioner?.active}
        style={tw`mb-2 h-[144px] w-full`}
      />

      <AppText
        style={tw`mb-6 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.airConditioning.label')}
      </AppText>

      <ReadMore
        numberOfLines={2}
        renderRevealedFooter={(handlePress) => (
          <AppText style={tw`text-left text-base font-normal text-amber-500`} onPress={handlePress}>
            {t('actions.hide')}
          </AppText>
        )}
        renderTruncatedFooter={(handlePress) => (
          <AppText style={tw`text-left text-base font-normal text-amber-500`} onPress={handlePress}>
            {t('actions.readMore')}
          </AppText>
        )}>
        <AppText style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {t('onPremise.airConditioning.description')}
        </AppText>
      </ReadMore>

      <AppArcSlider
        arcColors={compact([
          tw.color('blue-400')?.toString(),
          tw.color('emerald-400')?.toString(),
          tw.color('amber-400')?.toString(),
          tw.color('red-600')?.toString(),
        ])}
        cursorOuterColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
        disabled={
          loading ||
          !airConditioner ||
          isUpdatingTargetTemperature ||
          !user?.capabilities?.includes('AIR_CONDITIONING_ACCESS')
        }
        labelStyle={tw`-mt-4 text-2xl font-normal text-slate-500 dark:text-neutral-500`}
        max={airConditioner?.maxTemperature ?? DEFAULT_MAX_TEMPERATURE}
        min={airConditioner?.minTemperature ?? DEFAULT_MIN_TEMPERATURE}
        style={tw`relative mx-auto mt-3 w-full max-w-72`}
        sweepAngle={235}
        trackColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
        value={targetTemperature}
        onSlidingComplete={onSlidingComplete}>
        <ReanimatedText
          style={tw`pointer-events-none absolute inset-x-0 ml-6 mt-20 text-center text-6xl font-semibold leading-[6.5rem] text-slate-900 dark:text-gray-200`}
          text={formattedAnimatedTemperature}
        />
      </AppArcSlider>

      <AppRoundedButton
        disabled={!airConditioner || !user?.capabilities?.includes('AIR_CONDITIONING_ACCESS')}
        label={t(
          airConditioner?.active
            ? 'onPremise.airConditioning.turnOff'
            : 'onPremise.airConditioning.turnOn',
        )}
        loading={isTogglingActive}
        prefixIcon={airConditioner?.active ? 'power-off' : 'power'}
        style={tw`mt-6 w-full max-w-sm self-center`}
        onPress={toggleActive}
      />
      {!user?.capabilities?.includes('AIR_CONDITIONING_ACCESS') && (
        <View style={tw`mt-3 flex flex-row items-start gap-3 overflow-hidden`}>
          <AppIcon
            color={tw.color('yellow-500')}
            icon="alert"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText
            style={tw`shrink grow basis-0 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {t('onPremise.airConditioning.missingCapability')}
          </AppText>
        </View>
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(AirConditioningBottomSheet);
