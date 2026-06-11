import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';
import PeopleMeetingAnimation from '@/components/Animations/PeopleMeetingAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';

const GroupWorkBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
      onClose={onClose}>
      <PeopleMeetingAnimation autoPlay loop={false} style={tw`-my-8 h-64 w-full`} />

      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.groupWork.label')}
      </AppText>
      <AppText
        style={tw`mb-3 mt-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('onPremise.groupWork.description')}
      </AppText>
    </AppBottomSheet>
  );
};

export default forwardRef(GroupWorkBottomSheet);
