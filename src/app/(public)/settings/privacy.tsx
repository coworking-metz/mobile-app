import * as Calendar from 'expo-calendar';
import * as Location from 'expo-location';
import { compact } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';
import { useBeaconEnvironment } from 'react-native-beacon-kit';
import tw, { useDeviceContext } from 'twrnc';
import AppSwitch from '@/components/AppSwitch';
import AppText from '@/components/AppText';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout, { useContentInsets } from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import { useOnPremise } from '@/components/OnPremise/OnPremiseContext';
import { useAppPermissions } from '@/context/permissions';
import { useAppPushNotifications } from '@/context/push-notifications';
import { useAppUnlockGateOptions } from '@/context/unlock-gate-duration';
import { requestBluetoothPermission } from '@/helpers/label-printer';
import useAppScreen from '@/helpers/screen';
import { requestBeaconLocationPermission } from '@/services/beacon';
import { IS_GATE_UNLOCK_ON_APPROACH_ENABLED } from '@/services/environment';

const Privacy = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { isWide } = useAppScreen();
  const { selectUnlockGateOptions } = useAppUnlockGateOptions();
  const { selectPrintLabel } = useOnPremise();
  const [calendarState, requestCalendarPermission] = Calendar.useCalendarPermissions({
    writeOnly: true,
  });
  const [locationState, , getLocationPermission] = Location.useBackgroundPermissions();
  const { state: beaconEnvironment, refresh: refreshBeaconEnvironment } = useBeaconEnvironment();
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

  const onLocationPermissionsPress = useCallback(() => {
    if (!locationState?.granted) {
      requestBeaconLocationPermission()
        .then(async (isAlwaysGranted) => {
          await getLocationPermission();
          if (!isAlwaysGranted) {
            renderPermissionsBottomSheet();
          }
        })
        .catch(() => renderPermissionsBottomSheet());
    } else {
      renderPermissionsBottomSheet();
    }
  }, [locationState, getLocationPermission, renderPermissionsBottomSheet]);

  const onBluetoothPermissionsPress = useCallback(() => {
    if (!beaconEnvironment?.bluetoothPermissionGranted) {
      requestBluetoothPermission()
        .then(async (isGranted) => {
          await refreshBeaconEnvironment();
          if (!isGranted) {
            renderPermissionsBottomSheet();
          }
        })
        .catch(() => renderPermissionsBottomSheet());
    } else {
      renderPermissionsBottomSheet();
    }
  }, [beaconEnvironment, refreshBeaconEnvironment, renderPermissionsBottomSheet]);

  const contentInsets = useContentInsets(null, 12);

  return (
    <ServiceLayout
      contentStyle={[tw`px-3 pb-12 pt-6`, contentInsets]}
      description={t('privacy.description')}
      loading={isChangingStatus}
      title={t('privacy.title')}
      withBackButton={!isWide}>
      <View style={tw`mx-auto w-full max-w-xl`}>
        <SectionTitle style={tw`mx-3`} title={t('privacy.permissions.title')} />
        <ServiceRow
          withBottomDivider
          description={t('privacy.permissions.calendar.description')}
          label={t('privacy.permissions.calendar.label')}
          prefixIcon="calendar-outline"
          style={tw`px-3`}>
          <AppSwitch value={calendarState?.granted} onValueChange={onCalendarPermissionsPress} />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          description={t('privacy.permissions.notifications.description')}
          label={t('privacy.permissions.notifications.label')}
          prefixIcon="bell-outline"
          style={tw`px-3`}>
          <AppSwitch
            value={pushNotificationsEnabled}
            onValueChange={(willEnablePushNotifications) => {
              setPushNotificationsEnabled(willEnablePushNotifications);
              togglePushNotifications(willEnablePushNotifications);
            }}
          />
        </ServiceRow>

        {IS_GATE_UNLOCK_ON_APPROACH_ENABLED && (
          <>
            <ServiceRow
              withBottomDivider
              description={t('privacy.permissions.location.description')}
              label={t('privacy.permissions.location.label')}
              prefixIcon="map-marker-outline"
              renderDescription={(descriptionText, disabled) => (
                <Trans
                  components={[
                    <AppText
                      key="unlock-gate-options"
                      style={tw`text-amber-500`}
                      onPress={selectUnlockGateOptions}
                    />,
                  ]}
                  defaults={descriptionText}
                  parent={AppText}
                  style={[
                    tw`text-sm font-normal text-slate-500 dark:text-neutral-500`,
                    disabled && tw`opacity-40`,
                  ]}
                />
              )}
              style={tw`px-3`}>
              <AppSwitch
                value={locationState?.granted}
                onValueChange={onLocationPermissionsPress}
              />
            </ServiceRow>
          </>
        )}

        <ServiceRow
          withBottomDivider
          description={compact([
            t('privacy.permissions.bluetooth.description.printer'),
            IS_GATE_UNLOCK_ON_APPROACH_ENABLED &&
              t('privacy.permissions.bluetooth.description.beacon'),
          ]).join('\n\n')}
          label={t('privacy.permissions.bluetooth.label')}
          prefixIcon="bluetooth"
          renderDescription={(descriptionText, disabled) => (
            <Trans
              components={[
                <AppText
                  key="unlock-gate-options"
                  style={tw`text-amber-500`}
                  onPress={selectUnlockGateOptions}
                />,
                <AppText
                  key="label-printing"
                  style={tw`text-amber-500`}
                  onPress={selectPrintLabel}
                />,
              ]}
              defaults={descriptionText}
              parent={AppText}
              style={[
                tw`text-sm font-normal text-slate-500 dark:text-neutral-500`,
                disabled && tw`opacity-40`,
              ]}
            />
          )}
          style={tw`px-3`}>
          <AppSwitch
            value={beaconEnvironment?.bluetoothPermissionGranted}
            onValueChange={onBluetoothPermissionsPress}
          />
        </ServiceRow>

        <ServiceRow
          label={t('privacy.permissions.ask.title')}
          prefix={<View style={tw`min-h-10 w-6 shrink-0`} />}
          style={tw`px-3`}
          suffixIcon="open-in-new"
          onPress={Linking.openSettings}
        />
      </View>
    </ServiceLayout>
  );
};

export default Privacy;
