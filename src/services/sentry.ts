import { IS_DEV } from './environment';
import * as Sentry from '@sentry/react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export const initSentry = () => {
  Sentry.init({
    dsn:
      process.env.EXPO_PUBLIC_SENTRY_DSN ||
      'https://c9153d09b7ba476985cac82872da4098@o4505571822862336.ingest.us.sentry.io/4505571856023552',
    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,
    // Enable Logs
    enableLogs: true,
    enabled: Constants.executionEnvironment === ExecutionEnvironment.Bare && !IS_DEV,
    integrations: [Sentry.mobileReplayIntegration()],
  });
};
