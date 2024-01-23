import * as Updates from 'expo-updates';

export const APP_ENVIRONMENT = Updates.channel || 'local';
export const IS_DEV = ['staging', 'local'].includes(APP_ENVIRONMENT);
