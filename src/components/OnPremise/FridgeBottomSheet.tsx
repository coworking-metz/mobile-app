import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import PizzaIngrediantsAnimation from '@/components/Animations/PizzaIngrediantsAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';

const FridgeBottomSheet = ({
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
      <PizzaIngrediantsAnimation autoPlay loop={false} style={tw`w-full h-[144px] mb-4`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.fridge.label')}
      </AppText>

      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 mt-6 mb-3`}>
        {t('onPremise.fridge.description')}
      </AppText>
    </AppBottomSheet>
  );
};

export default FridgeBottomSheet;
