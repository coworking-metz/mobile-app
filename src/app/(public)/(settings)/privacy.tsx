import * as Calendar from 'expo-calendar';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Switch } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import { useAppPermissions } from '@/context/permissions';
import { useAppPushNotifications } from '@/context/push-notifications';
import { theme } from '@/helpers/colors';

const Privacy = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { _root } = useLocalSearchParams();
  const [calendarState, requestCalendarPermission] = Calendar.useCalendarPermissions();
  const renderPermissionsBottomSheet = useAppPermissions();
  const { arePushNotificationsEnabled, isChangingStatus, togglePushNotifications } =
    useAppPushNotifications();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(
    arePushNotificationsEnabled,
  );

  useEffect(() => {
    setPushNotificationsEnabled(arePushNotificationsEnabled);
  }, [arePushNotificationsEnabled]);

  const onCalendarPermissionsPress = useCallback(() => {
    if (!calendarState?.granted) {
      requestCalendarPermission().then((updatedState) => {
        if (!updatedState?.granted) {
          renderPermissionsBottomSheet();
        }
      });
    } else {
      renderPermissionsBottomSheet();
    }
  }, [calendarState, requestCalendarPermission, renderPermissionsBottomSheet]);

  return (
    <ServiceLayout
      contentStyle={tw`pt-6 pb-12`}
      description={t('privacy.description')}
      loading={isChangingStatus}
      title={t('privacy.title')}
      withBackButton={!_root}>
      <View style={tw`w-full max-w-xl mx-auto`}>
        <SectionTitle style={tw`mx-6`} title={t('privacy.permissions.title')} />
        <ServiceRow
          withBottomDivider
          description={t('privacy.permissions.calendar.description')}
          label={t('privacy.permissions.calendar.label')}
          prefixIcon="calendar-outline"
          style={tw`px-3 mx-3`}>
          <Switch
            value={calendarState?.granted}
            onColor={theme.meatBrown}
            onValueChange={onCalendarPermissionsPress}
          />
        </ServiceRow>
        <ServiceRow
          description={t('privacy.permissions.notifications.description')}
          label={t('privacy.permissions.notifications.label')}
          prefixIcon="bell-outline"
          style={tw`px-3 mx-3`}>
          <Switch
            value={pushNotificationsEnabled}
            onColor={theme.meatBrown}
            onValueChange={(willEnablePushNotifications) => {
              setPushNotificationsEnabled(willEnablePushNotifications);
              togglePushNotifications(willEnablePushNotifications);
            }}
          />
        </ServiceRow>
        {/*<ServiceRow
        disabled
        withBottomDivider
        description={t('privacy.permissions.bluetooth.description')}
        label={t('privacy.permissions.bluetooth.label')}
        prefixIcon="bluetooth"
        style={tw`px-3 mx-3`}></ServiceRow>
      <ServiceRow
        disabled
        description={t('privacy.permissions.location.description')}
        label={t('privacy.permissions.location.label')}
        prefixIcon="map-marker-outline"
        style={tw`px-3 mx-3`}></ServiceRow> */}
      </View>
    </ServiceLayout>
  );
};

export default Privacy;
