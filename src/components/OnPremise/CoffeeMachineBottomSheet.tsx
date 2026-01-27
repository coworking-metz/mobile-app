import AppTextLink from '../AppTextLink';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import CoffeeMachineAnimation from '@/components/Animations/CoffeeMachineAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import { WORDPRESS_BASE_URL } from '@/services/environment';

const CoffeeMachineBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch px-6`}
      style={style}
      onClose={onClose}>
      <CoffeeMachineAnimation autoPlay loop={false} style={tw`w-full h-[192px] mb-2`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.coffeeMachine.label')}
      </AppText>

      <Trans
        components={[
          <AppTextLink
            href={`${WORDPRESS_BASE_URL}/boutique/mug-personnalise/`}
            key="mug-link"
            style={tw`text-amber-500`}
            target="_blank"
          />,
          <AppTextLink
            href={`${WORDPRESS_BASE_URL}/boutique/contribution-cafe-the/`}
            key="coffee-contribution-link"
            style={tw`text-amber-500`}
            target="_blank"
          />,
        ]}
        defaults={t('onPremise.coffeeMachine.description')}
        parent={AppText}
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 mt-6`}
      />
    </AppBottomSheet>
  );
};

export default CoffeeMachineBottomSheet;
