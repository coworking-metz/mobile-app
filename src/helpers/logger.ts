import { logger, consoleTransport } from 'react-native-logs';

export const log = logger.createLogger({
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  },
  severity: process.env.EXPO_PUBLIC_DEFAULT_LOG_LEVEL || 'error',
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
  async: true,
  dateFormat: 'time',
  printLevel: false,
  printDate: true,
  enabled: true,
});
