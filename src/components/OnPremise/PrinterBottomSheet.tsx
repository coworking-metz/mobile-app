import AppFader from '../AppFader';
import AppTextLink from '../AppTextLink';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import PaperPrintingAnimation from '@/components/Animations/PaperPrintingAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import { WORDPRESS_BASE_URL } from '@/services/environment';

const PrinterBottomSheet = ({
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
      <View style={tw`relative w-full`}>
        <PaperPrintingAnimation autoPlay loop={false} style={tw`w-full h-[192px]`} />
        <AppFader
          position={Fader.position.BOTTOM}
          size={64}
          style={tw`inset-0 absolute bottom-0`}
          tintColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white') || ''}
        />
      </View>

      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.printer.label')}
      </AppText>

      <Trans
        components={[
          <AppTextLink
            href={`${WORDPRESS_BASE_URL}/print/`}
            key="print-from-account-link"
            style={tw`text-amber-500`}
            target="_blank"
          />,
          <AppTextLink
            href={`${WORDPRESS_BASE_URL}/boutique/impressions/`}
            key="print-contribution-link"
            style={tw`text-amber-500`}
            target="_blank"
          />,
        ]}
        defaults={t('onPremise.printer.description')}
        parent={AppText}
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 mt-6`}
      />
    </AppBottomSheet>
  );
};

export default PrinterBottomSheet;
