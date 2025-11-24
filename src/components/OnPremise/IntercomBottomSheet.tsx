import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import RingingBellAnimation from '@/components/Animations/RingingBellAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';

const IntercomBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch pt-6 px-6`}
      style={style}
      onClose={onClose}>
      <RingingBellAnimation autoPlay loop={false} style={tw`w-full h-[144px] -my-4`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.intercom.label')}
      </AppText>

      <AppText style={tw`text-left text-base font-normal text-slate-500 mt-6`}>
        {t('onPremise.intercom.description')}
      </AppText>
    </AppBottomSheet>
  );
};

export default IntercomBottomSheet;
