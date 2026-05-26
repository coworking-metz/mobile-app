import MobileNotificationsAnimation from '../Animations/MobileNotificationsAnimation';
import AppTextLink from '../AppTextLink';
import ServiceRow from '../Layout/ServiceRow';
import { useTrueSheet } from '@lodev09/react-native-true-sheet';
import { Link } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Switch } from 'react-native-ui-lib';
import tw from 'twrnc';
import RateStarsAnimation from '@/components/Animations/RateStarsAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import { useAppPushNotifications } from '@/context/push-notifications';
import { theme } from '@/helpers/colors';
import useNoticeStore from '@/stores/notice';

const PushNotificationsBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps
> = ({ style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const trueSheet = useTrueSheet();
  const { arePushNotificationsEnabled, togglePushNotifications } = useAppPushNotifications();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(
    arePushNotificationsEnabled,
  );

  useEffect(() => {
    setPushNotificationsEnabled(arePushNotificationsEnabled);
  }, [arePushNotificationsEnabled]);

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col py-6 px-3`, style]}
      onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <MobileNotificationsAnimation loop={false} style={tw`h-36 w-full`} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4 mx-3`}>
        {t('pushNotifications.enable.title')}
      </AppText>
      <Trans
        components={[
          <AppTextLink
            href={`/privacy`}
            key="privacy-link"
            style={tw`text-amber-500`}
            onPress={() => trueSheet.dismissAll()}
          />,
        ]}
        defaults={t('pushNotifications.enable.description')}
        parent={AppText}
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 mt-6 mx-3`}
      />
      <ServiceRow
        description={t('privacy.permissions.notifications.description')}
        label={t('privacy.permissions.notifications.label')}
        prefixIcon="bell-outline"
        style={tw`mt-6`}>
        <Switch
          value={pushNotificationsEnabled}
          onColor={theme.meatBrown}
          onValueChange={(willEnablePushNotifications) => {
            setPushNotificationsEnabled(willEnablePushNotifications);
            togglePushNotifications(willEnablePushNotifications);
          }}
        />
      </ServiceRow>
    </AppBottomSheet>
  );
};

export default forwardRef(PushNotificationsBottomSheet);
