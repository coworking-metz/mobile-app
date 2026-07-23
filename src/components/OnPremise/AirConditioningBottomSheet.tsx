import AppArcSlider from '../AppArcSlider';
import ReanimatedText from '../ReanimatedText';
import { compact } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import ReadMore from 'react-native-read-more-text';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import tw from 'twrnc';
import AirConditionerAnimation from '@/components/Animations/AirConditionerAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';

const AirConditioningBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps
> = ({ style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const targetTemperature = useSharedValue(30);

  const formattedAnimatedTemperature = useDerivedValue(() => {
    return `${targetTemperature.value.toFixed(0)}°`;
  }, [targetTemperature]);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      <AirConditionerAnimation autoPlay loop={false} style={tw`mb-2 h-[144px] w-full`} />

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
        labelStyle={tw`-mt-2 text-xl font-normal text-slate-500 dark:text-neutral-500`}
        max={30}
        min={16}
        style={tw`relative mx-auto mt-3 w-full max-w-72`}
        trackColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
        value={targetTemperature}>
        <ReanimatedText
          style={tw`pointer-events-none absolute inset-x-0 ml-6 mt-20 text-center text-6xl font-semibold leading-[6.5rem] text-slate-900 dark:text-gray-200`}
          text={formattedAnimatedTemperature}
        />
      </AppArcSlider>
    </AppBottomSheet>
  );
};

export default forwardRef(AirConditioningBottomSheet);
