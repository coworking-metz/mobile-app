import { useTrueSheet } from '@lodev09/react-native-true-sheet';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Switch } from 'react-native-ui-lib';
import tw from 'twrnc';
import MobileNotificationsAnimation from '@/components/Animations/MobileNotificationsAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import AppTextLink from '@/components/AppTextLink';
import ServiceRow from '@/components/Layout/ServiceRow';
import { useAppPushNotifications } from '@/context/push-notifications';
import { theme } from '@/helpers/colors';

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
      style={[tw`flex flex-col px-3 py-6`, style]}
      onClose={onClose}>
      <View style={tw`flex h-40 items-center justify-center overflow-visible`}>
        <MobileNotificationsAnimation loop={false} style={tw`h-36 w-full`} />
      </View>
      <AppText
        style={tw`mx-3 mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
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
        style={tw`mx-3 mt-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
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
            togglePushNotifications(willEnablePushNotifications).then(
              (hasEnabledPushNotifications) => {
                setPushNotificationsEnabled(hasEnabledPushNotifications);
              },
            );
          }}
        />
      </ServiceRow>
    </AppBottomSheet>
  );
};

export default forwardRef(PushNotificationsBottomSheet);
