import UpliftingDeskAnimation from '../Animations/UpliftingDeskAnimation';
import ServiceRow from '../Layout/ServiceRow';
import LoadingSkeleton from '../LoadingSkeleton';
import { isNil } from 'lodash';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';

const FlexDeskBottomSheet = ({
  occupied,
  loading = false,
  style,
  onClose,
}: {
  occupied?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch px-6 pt-6`}
      style={style}
      onClose={onClose}>
      <UpliftingDeskAnimation autoPlay loop={false} style={tw`w-full h-[144px] mb-2`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mb-6`}>
        {t('onPremise.flexDesk.label')}
      </AppText>

      <AppText style={tw`text-left text-base font-normal text-slate-500 mt-6`}>
        {t('onPremise.flexDesk.description')}
      </AppText>

      <ServiceRow label={t('onPremise.flexDesk.occupancy.label')} style={tw`w-full px-0 mt-2`}>
        {loading ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
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

export default FlexDeskBottomSheet;
