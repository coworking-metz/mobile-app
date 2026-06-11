import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
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
      <AirConditionerAnimation autoPlay loop={false} style={tw`mb-2 h-[144px] w-full`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.airConditioning.label')}
      </AppText>

      <AppText
        style={tw`mb-3 mt-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('onPremise.airConditioning.description')}
      </AppText>
    </AppBottomSheet>
  );
};

export default forwardRef(AirConditioningBottomSheet);
