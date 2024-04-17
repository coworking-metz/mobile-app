import * as Sentry from '@sentry/react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { logger, consoleTransport, sentryTransport } from 'react-native-logs';

export const log = logger.createLogger({
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  },
  severity: process.env.EXPO_PUBLIC_DEFAULT_LOG_LEVEL || 'error',
  ...(Constants.executionEnvironment === ExecutionEnvironment.Bare
    ? {
        transport: sentryTransport,
        transportOptions: {
          SENTRY: Sentry,
          errorLevels: 'error',
        },
      }
    : {
        transport: consoleTransport,
        transportOptions: {
          colors: {
            trace: 'gray',
            info: 'blueBright',
            warn: 'yellowBright',
            error: 'red',
          },
          extensionColors: {
            '[auth.tsx]': 'yellow',
            '[http]': 'grey',
          },
        },
      }),
  async: true,
  dateFormat: 'time',
  printLevel: false,
  printDate: true,
  enabled: true,
});
