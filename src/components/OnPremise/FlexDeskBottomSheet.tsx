import { isNil } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import tw from 'twrnc';
import UpliftingDeskAnimation from '@/components/Animations/UpliftingDeskAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const FlexDeskBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    occupied?: boolean;
    loading?: boolean;
  }
> = ({ occupied, loading = false, style, onClose }, forwardedRef) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
      onClose={onClose}>
      <UpliftingDeskAnimation autoPlay loop={false} style={tw`mb-2 h-[144px] w-full`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.flexDesk.label')}
      </AppText>

      <Trans
        components={[
          <AppText key="emphasis" style={tw`font-medium text-slate-900 dark:text-gray-200`} />,
        ]}
        defaults={t('onPremise.flexDesk.description')}
        parent={AppText}
        style={tw`mt-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
      />

      <ServiceRow label={t('onPremise.flexDesk.occupancy.label')} style={tw`mt-2 w-full px-0`}>
        {loading ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <AppText
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {isNil(occupied)
              ? t('onPremise.flexDesk.occupancy.value.unknown')
              : occupied
                ? t('onPremise.flexDesk.occupancy.value.occupied')
                : t('onPremise.flexDesk.occupancy.value.available')}
          </AppText>
        )}
      </ServiceRow>
    </AppBottomSheet>
  );
};

export default forwardRef(FlexDeskBottomSheet);
