import * as Calendar from 'expo-calendar';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import AppText from '@/components/AppText';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import { useAppPermissions } from '@/context/permissions';
import { theme } from '@/helpers/colors';

const Privacy = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const [calendarState, requestCalendarPermission] = Calendar.useCalendarPermissions();
  const renderPermissionsBottomSheet = useAppPermissions();

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
      title={t('privacy.title')}>
      <AppText style={tw`text-sm font-normal uppercase text-slate-500 mx-6`}>
        {t('privacy.permissions.title')}
      </AppText>
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
      {/* <ServiceRow
        disabled
        withBottomDivider
        description={t('privacy.permissions.notifications.description')}
        label={t('privacy.permissions.notifications.label')}
        prefixIcon="bell-outline"
        style={tw`px-3 mx-3`}></ServiceRow>
      <ServiceRow
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
    </ServiceLayout>
  );
};

export default Privacy;
