import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Updates from 'expo-updates';

export const APP_ENVIRONMENT = Updates.channel || 'local';
export const IS_DEV = ['staging', 'local'].includes(APP_ENVIRONMENT);
export const IS_RUNNING_IN_EXPO_GO =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
