import { useQuery } from '@tanstack/react-query';
import { compact } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import AirConditionerAnimation from '@/components/Animations/AirConditionerAnimation';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppArcSlider from '@/components/AppArcSlider';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppIcon from '@/components/AppIcon';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import ReanimatedText from '@/components/ReanimatedText';
import { handleSilentError } from '@/helpers/error';
import {
  getOnPremiseState,
  OnPremiseState,
  turnOffAirConditioner,
  turnOnAirConditioner,
  updateAirConditionerTargetTemperature,
} from '@/services/api/services';
import { IS_DEV } from '@/services/environment';
import { onPremiseQueryKeys, useAppQueryClient } from '@/services/query';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const DEFAULT_MIN_TEMPERATURE = 16;
const DEFAULT_MAX_TEMPERATURE = 30;

const AirConditioningBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    airConditionerId: keyof OnPremiseState['airConditioners'];
  }
> = ({ style, onClose, airConditionerId }, forwardedRef) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const noticeStore = useNoticeStore();
  const { updateAirConditionerQueryData } = useAppQueryClient();
  const targetTemperature = useSharedValue(0);
  const [isTogglingActive, setTogglingActive] = useState(false);
  const [isUpdatingTargetTemperature, setUpdatingTargetTemperature] = useState(false);

  const { data: onPremiseState, isFetching: isFetchingOnPremiseState } = useQuery({
    queryKey: onPremiseQueryKeys.state(),
    queryFn: getOnPremiseState,
  });

  const airConditioner = useMemo(() => {
    return onPremiseState?.airConditioners?.[airConditionerId] ?? null;
  }, [onPremiseState]);

  useEffect(() => {
    if (airConditioner) {
      targetTemperature.value = airConditioner.targetTemperature;
    }
  }, [airConditioner]);

  const formattedAnimatedTemperature = useDerivedValue(() => {
    return targetTemperature.value ? `${Number(targetTemperature.value).toFixed(0)}°` : '';
  }, [targetTemperature]);

  const onSlidingComplete = (value: number) => {
    if (!airConditioner) {
      return;
    }

    setUpdatingTargetTemperature(true);
    updateAirConditionerTargetTemperature(airConditionerId, value)
      .then((updatedAirConditioner) => {
        updateAirConditionerQueryData(airConditionerId, updatedAirConditioner);
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
      ? turnOffAirConditioner(airConditionerId)
      : turnOnAirConditioner(airConditionerId)
    )
      .then((updatedAirConditioner) => {
        updateAirConditionerQueryData(airConditionerId, updatedAirConditioner);
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('onPremise.airConditioning.onToggle.fail'),
        }),
      )
      .finally(() => setTogglingActive(false));
  };

  const animationTranslateY = useSharedValue(0);

  useEffect(() => {
    animationTranslateY.value = withTiming(!airConditioner?.active ? 24 : 0, { duration: 1_200 });
  }, [airConditioner?.active]);

  const animationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animationTranslateY.value }],
  }));

  const rotation = useSharedValue(0);

  const iconAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }),
    [rotation],
  );

  useEffect(() => {
    if (airConditioner?.active) {
      cancelAnimation(rotation);
      rotation.value = 0;
      rotation.value = withSequence(
        withTiming(180, {
          easing: Easing.in(Easing.ease),
          duration: 1200,
        }),
        withRepeat(
          withTiming(360, {
            easing: Easing.linear,
            duration: 600,
          }),
          Infinity,
        ),
      );
    } else if (rotation.value > 0) {
      cancelAnimation(rotation);
      rotation.value = 0;
      rotation.value = withTiming(360, {
        easing: Easing.out(Easing.ease),
        duration: 2000,
      });
    }
  }, [airConditioner?.active]);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      <Animated.View style={[tw`h-[144px] w-full`, animationAnimatedStyle]}>
        <AirConditionerAnimation
          autoPlay={!!airConditioner?.active}
          loop={!!airConditioner?.active}
          style={tw`mb-2 size-full`}
          {...(!airConditioner?.active && { progress: 1, speed: 0 })}
        />
      </Animated.View>

      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.airConditioning.label')}
      </AppText>

      <AppText
        style={tw`mt-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('onPremise.airConditioning.description')}
      </AppText>

      {IS_DEV && (
        <>
          <AppArcSlider
            {...(airConditioner?.active
              ? {
                  arcColors: compact([
                    ,
                    tw.color('blue-400')?.toString(),
                    tw.color('emerald-400')?.toString(),
                    tw.color('amber-400')?.toString(),
                    tw.color('red-600')?.toString(),
                  ]),
                }
              : {
                  arcColor: tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200'),
                })}
            cursorOuterColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
            disabled={
              !airConditioner ||
              !user?.capabilities?.includes('AIR_CONDITIONING_ACCESS') ||
              isUpdatingTargetTemperature
            }
            labelStyle={tw`-mt-4 text-2xl font-normal text-slate-500 dark:text-neutral-500`}
            loading={isFetchingOnPremiseState || isUpdatingTargetTemperature}
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
            disabled={
              !airConditioner ||
              isTogglingActive ||
              !user?.capabilities?.includes('AIR_CONDITIONING_ACCESS')
            }
            label={t(
              airConditioner?.active
                ? 'onPremise.airConditioning.turnOff'
                : 'onPremise.airConditioning.turnOn',
            )}
            prefixIcon={airConditioner?.active ? 'power-off' : 'power'}
            renderPrefix={() =>
              isTogglingActive ? (
                <HorizontalLoadingAnimation style={tw`-ml-2 size-8`} />
              ) : (
                <Animated.View style={[tw`-ml-2 shrink-0`, iconAnimatedStyle]}>
                  <AppIcon
                    color={
                      tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('neutral-800')
                    }
                    icon="fan"
                    size={32}
                    style={[tw`shrink-0`]}
                  />
                </Animated.View>
              )
            }
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
        </>
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(AirConditioningBottomSheet);
