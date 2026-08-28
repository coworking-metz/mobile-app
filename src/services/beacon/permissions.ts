import * as Location from 'expo-location';
import { log } from '@/helpers/logger';

const permissionsLogger = log.extend('[beacon:permissions]');

/**
 * react-native-beacon-kit only checks permissions, it never requests them.
 * iOS requires the two-step dance: "When In Use" must be granted before
 * "Always" can even be prompted for.
 */
export const requestBeaconLocationPermission = async (): Promise<void> => {
  const foreground = await Location.requestForegroundPermissionsAsync();
  permissionsLogger.info(`Foreground location permission: ${foreground.status}`);
  if (foreground.status !== 'granted') {
    return;
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  permissionsLogger.info(`Background (Always) location permission: ${background.status}`);
};
