import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import PeopleMeetingAnimation from '@/components/Animations/PeopleMeetingAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';

const GroupWorkBottomSheet = ({
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
      <PeopleMeetingAnimation autoPlay loop={false} style={tw`w-full h-64 -my-8`} />

      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.groupWork.label')}
      </AppText>
      <AppText style={tw`text-left text-base font-normal text-slate-500 mt-6`}>
        {t('onPremise.groupWork.description')}
      </AppText>
    </AppBottomSheet>
  );
};

export default GroupWorkBottomSheet;
