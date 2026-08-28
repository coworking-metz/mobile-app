import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import { File, Paths } from 'expo-file-system';
import { logger, consoleTransport, fileAsyncTransport, sentryTransport } from 'react-native-logs';
import { APP_ENVIRONMENT } from '@/services/environment';

const LOG_FILE_PREFIX = 'app-';
const LOG_FILE_EXTENSION = '.log';
const LOG_DATE_FORMAT = 'YYYY-MM-DD';
const LOG_FILE_NAME_REGEX = /^app-(\d{4}-\d{2}-\d{2})\.log$/;

export const getLogFileName = (logDate: string) =>
  `${LOG_FILE_PREFIX}${logDate}${LOG_FILE_EXTENSION}`;

export type LogFileInfo = {
  date: string;
  size: number;
  created: string | null;
  modified: string | null;
};

// one file per day so a single file never grows large enough to be slow to read/render
export const listLogFiles = (): LogFileInfo[] => {
  try {
    const entries = Paths.document.list();
    return entries
      .filter((entry): entry is File => entry instanceof File)
      .flatMap((file) => {
        const date = file.name.match(LOG_FILE_NAME_REGEX)?.[1];
        return date
          ? [
              {
                date,
                size: file.size,
                created: file.creationTime ? dayjs(file.creationTime).toISOString() : null,
                modified: file.modificationTime ? dayjs(file.modificationTime).toISOString() : null,
              },
            ]
          : [];
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    // eg. Android can throw a permission-check exception here rather than fail silently like iOS
    return [];
  }
};

const fileTransportOptions = {
  FS: { File, Paths },
  fileName: getLogFileName(dayjs().format(LOG_DATE_FORMAT)),
  // fileAsyncTransport interpolates `filePath` into a template string, which would
  // stringify a `Paths.document` Directory instance to "[object Object]" — pass its uri instead
  filePath: Paths.document.uri,
};

export const log = logger.createLogger({
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  },
  severity: process.env.EXPO_PUBLIC_DEFAULT_LOG_LEVEL || 'info',
  ...(APP_ENVIRONMENT === 'local'
    ? {
        transport: [consoleTransport, fileAsyncTransport],
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
          ...fileTransportOptions,
        },
      }
    : ({
        transport: [sentryTransport, fileAsyncTransport],
        transportOptions: {
          SENTRY: Sentry,
          errorLevels: 'error',
          ...fileTransportOptions,
        },
      } as never)),
  async: true,
  dateFormat: 'time',
  // the level is printed so the log viewer screen can color each line by level, like the console does
  printLevel: true,
  printDate: true,
  enabled: true,
});
