import { version as packageVersion } from '../../package.json';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import * as Updates from 'expo-updates';
import { compact } from 'lodash';
import { Platform } from 'react-native';

export const APP_NAME = 'COWORKING_MOBILE';
export const APP_ENVIRONMENT = Updates.channel || 'local';
export const APP_VERSION = packageVersion;
export const IS_DEV = ['staging', 'local'].includes(APP_ENVIRONMENT);
export const IS_RUNNING_IN_EXPO_GO =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const BUILD_VERSION = compact([
  Constants.expoConfig?.version ?? APP_VERSION,
  IS_DEV ? Constants.expoConfig?.extra?.gitBranch : undefined,
]).join('-');

let environmentApiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://tickets.coworking-metz.fr';

// Was fed up with Android emulators not being able to reach localhost
if (!Device.isDevice && Platform.OS === 'android' && APP_ENVIRONMENT === 'local') {
  const url = new URL(environmentApiBaseUrl);
  url.hostname = '10.0.2.2'; // https://developer.android.com/studio/run/emulator-networking
  environmentApiBaseUrl = url.toString();
}

export const API_BASE_URL = environmentApiBaseUrl;

export const WORDPRESS_BASE_URL =
  process.env.EXPO_PUBLIC_WORDPRESS_BASE_URL || 'https://coworking-metz.fr';

export const PROBE_BASE_URL =
  process.env.EXPO_PUBLIC_PROBE_BASE_URL || 'https://probe.coworking-metz.fr';

export const MANAGER_BASE_URL =
  process.env.EXPO_PUBLIC_MANAGER_BASE_URL || 'https://manager.coworking-metz.fr';

export const SUPPORT_EMAIL = 'contact@coworking-metz.fr';
