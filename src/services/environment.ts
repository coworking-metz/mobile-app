import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Updates from 'expo-updates';

export const APP_ENVIRONMENT = Updates.channel || 'local';
export const IS_DEV = ['staging', 'local'].includes(APP_ENVIRONMENT);
export const IS_RUNNING_IN_EXPO_GO =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://tickets.coworking-metz.fr/';

export const WORDPRESS_BASE_URL =
  process.env.EXPO_PUBLIC_WORDPRESS_BASE_URL || 'https://coworking-metz.fr/';

export const PROBE_BASE_URL =
  process.env.EXPO_PUBLIC_PROBE_BASE_URL || 'https://probe.coworking-metz.fr';
