import { HTTP } from './http';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { DeviceEventEmitter, Platform } from 'react-native';
import Beacons, { BeaconRegion } from 'react-native-beacons-manager';
import { log } from '@/helpers/logger';

const logger = log.extend('[beacons]');

export const BEACON_UUID = '00000000-0000-0000-0000-000000000000';
const BEACON_TASK = 'beacon-monitor-task';

TaskManager.defineTask(BEACON_TASK, ({ error }) => {
  if (error) {
    logger.error('Beacon task error', error);
    return;
  }
  // Task body is handled via event listener
});

export const registerBeaconMonitoring = async (uuid: string = BEACON_UUID) => {
  const location = await Location.requestForegroundPermissionsAsync();
  if (location.status !== 'granted') {
    logger.warn('Location permission not granted');
    return;
  }

  if (Platform.OS === 'ios') {
    Beacons.requestWhenInUseAuthorization();
    Beacons.startUpdatingLocation();
  } else {
    Beacons.detectIBeacons();
    Beacons.setForegroundScanPeriod(5000);
  }

  const region: BeaconRegion = { identifier: 'targetBeacon', uuid };
  try {
    await Beacons.startMonitoringForRegion(region);
    await Beacons.startRangingBeaconsInRegion(region);
  } catch (err) {
    logger.error('Error starting beacon monitoring', err);
  }

  DeviceEventEmitter.addListener('regionDidEnter', () => {
    logger.debug('Beacon detected, sending HTTP request');
    HTTP.post('/beacon-detected', { uuid }).catch((err) => {
      logger.error('Failed to notify backend', err);
    });
  });
};
