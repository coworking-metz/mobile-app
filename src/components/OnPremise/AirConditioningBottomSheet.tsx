import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
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

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      <AirConditionerAnimation autoPlay loop={false} style={tw`w-full h-[144px] mb-2`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.airConditioning.label')}
      </AppText>

      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 mt-6 mb-3`}>
        {t('onPremise.airConditioning.description')}
      </AppText>
    </AppBottomSheet>
  );
};

export default forwardRef(AirConditioningBottomSheet);
