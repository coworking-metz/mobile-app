import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';
import TelevisionSlideshowAnimation from '@/components/Animations/TelevisionSlideshowAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';

const TelevisionBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
      onClose={onClose}>
      <TelevisionSlideshowAnimation autoPlay loop style={tw`w-full h-32 my-6`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.television.label')}
      </AppText>

      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 mt-6 mb-3`}>
        {t('onPremise.television.description')}
      </AppText>
    </AppBottomSheet>
  );
};

export default forwardRef(TelevisionBottomSheet);
