import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import PaperPrintingAnimation from '@/components/Animations/PaperPrintingAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppFader from '@/components/AppFader';
import AppText from '@/components/AppText';
import AppTextLink from '@/components/AppTextLink';
import { WORDPRESS_BASE_URL } from '@/services/environment';

const PrinterBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
      onClose={onClose}>
      <View style={tw`relative w-full`}>
        <PaperPrintingAnimation autoPlay loop={false} style={tw`h-[192px] w-full`} />
        <AppFader
          position={Fader.position.BOTTOM}
          size={64}
          style={tw`absolute inset-0`}
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
        style={tw`mb-3 mt-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
      />
    </AppBottomSheet>
  );
};

export default forwardRef(PrinterBottomSheet);
