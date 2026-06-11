import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';
import RingingBellAnimation from '@/components/Animations/RingingBellAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';

const IntercomBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
      onClose={onClose}>
      <RingingBellAnimation autoPlay loop={false} style={tw`-my-4 h-[144px] w-full`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.intercom.label')}
      </AppText>

      <AppText
        style={tw`mb-3 mt-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('onPremise.intercom.description')}
      </AppText>
    </AppBottomSheet>
  );
};

export default forwardRef(IntercomBottomSheet);
