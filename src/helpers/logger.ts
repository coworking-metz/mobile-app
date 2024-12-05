import * as Sentry from '@sentry/react-native';
import { logger, consoleTransport, sentryTransport } from 'react-native-logs';
import { APP_ENVIRONMENT } from '@/services/environment';

export const log = logger.createLogger({
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  },
  severity: process.env.EXPO_PUBLIC_DEFAULT_LOG_LEVEL || 'error',
  ...(APP_ENVIRONMENT === 'local'
    ? {
        transport: consoleTransport,
        transportOptions: {
          colors: {
            trace: 'grey',
            info: 'blueBright',
            warn: 'yellowBright',
            error: 'red',
          },
          extensionColors: {
            '[auth.tsx]': 'yellow',
            '[http]': 'grey',
          },
        },
      }
    : ({
        transport: sentryTransport,
        transportOptions: {
          SENTRY: Sentry,
          errorLevels: 'error',
        },
      } as never)),
  async: true,
  dateFormat: 'time',
  printLevel: false,
  printDate: true,
  enabled: true,
});
