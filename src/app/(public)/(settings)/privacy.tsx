import * as Calendar from 'expo-calendar';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Linking, PermissionsAndroid, Platform, View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import AppSwitch from '@/components/AppSwitch';
import AppText from '@/components/AppText';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import { useAppPermissions } from '@/context/permissions';
import { useAppPushNotifications } from '@/context/push-notifications';
import { useAppUnlockGateOptions } from '@/context/unlock-gate-duration';
import { requestBeaconLocationPermission } from '@/services/beacon';
import { IS_GATE_UNLOCK_ON_APPROACH_ENABLED } from '@/services/environment';

const Privacy = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { _root } = useLocalSearchParams();
  const { selectUnlockGateOptions } = useAppUnlockGateOptions();
  const [calendarState, requestCalendarPermission] = Calendar.useCalendarPermissions();
  const [locationState, , getLocationPermission] = Location.useBackgroundPermissions();
  const [areBluetoothPermissionsGranted, setBluetoothPermissionsGranted] = useState<boolean>(false);
  const renderPermissionsBottomSheet = useAppPermissions();
  const { arePushNotificationsEnabled, isChangingStatus, togglePushNotifications } =
    useAppPushNotifications();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(
    arePushNotificationsEnabled,
  );

  useEffect(() => {
    setPushNotificationsEnabled(arePushNotificationsEnabled);
  }, [arePushNotificationsEnabled]);

  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'android') {
        const isBluetoothGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        setBluetoothPermissionsGranted(isBluetoothGranted);
      }
    };
    checkPermissions();
  }, []);

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

  return (
    <ServiceLayout
      contentStyle={tw`pb-12 pt-6`}
      description={t('privacy.description')}
      loading={isChangingStatus}
      title={t('privacy.title')}
      withBackButton={!_root}>
      <View style={tw`mx-auto w-full max-w-xl`}>
        <SectionTitle style={tw`mx-6`} title={t('privacy.permissions.title')} />
        <ServiceRow
          withBottomDivider
          description={t('privacy.permissions.calendar.description')}
          label={t('privacy.permissions.calendar.label')}
          prefixIcon="calendar-outline"
          style={tw`mx-3 px-3`}>
          <AppSwitch value={calendarState?.granted} onValueChange={onCalendarPermissionsPress} />
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          description={t('privacy.permissions.notifications.description')}
          label={t('privacy.permissions.notifications.label')}
          prefixIcon="bell-outline"
          style={tw`mx-3 px-3`}>
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
              style={tw`mx-3 px-3`}>
              <AppSwitch
                value={locationState?.granted}
                onValueChange={onLocationPermissionsPress}
              />
            </ServiceRow>
            {/*
              iOS doesn't expose a real, separately-checkable Bluetooth scanning
              authorization status (CBManager.authorization isn't surfaced by any
              library used here) — only whether the radio itself is powered on,
              which isn't the same thing as "authorized". Kept informational/disabled
              rather than showing a status we can't actually verify.
            */}
            <ServiceRow
              withBottomDivider
              description={t('privacy.permissions.bluetooth.description')}
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
                  ]}
                  defaults={descriptionText}
                  parent={AppText}
                  style={[
                    tw`text-sm font-normal text-slate-500 dark:text-neutral-500`,
                    disabled && tw`opacity-40`,
                  ]}
                />
              )}
              style={tw`mx-3 px-3`}>
              <AppSwitch disabled value={areBluetoothPermissionsGranted} />
            </ServiceRow>
          </>
        )}

        <ServiceRow
          label={t('privacy.permissions.ask.title')}
          style={tw`mx-3 px-3`}
          suffixIcon="open-in-new"
          onPress={Linking.openSettings}
        />
      </View>
    </ServiceLayout>
  );
};

export default Privacy;
