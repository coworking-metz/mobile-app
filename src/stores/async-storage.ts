import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { type StateStorage } from 'zustand/middleware';
import { log } from '@/helpers/logger';

const RETRIEVE_ATTEMPTS_LIMIT = 3;

const setAsyncItem = async (name: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(name, value);
  } catch (error) {
    Sentry.captureException(error);
  }
};

const deleteAsyncItem = async (name: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    Sentry.captureException(error);
  }
};

const retrieveAsyncItem = async (name: string): Promise<string | null> => {
  let attempts = 0;
  while (attempts < RETRIEVE_ATTEMPTS_LIMIT) {
    try {
      const data = await AsyncStorage.getItem(name);

      return data ?? null;
    } catch (err) {
      if (attempts === 0) {
        log.error(`Failed to retrieve ${name} from async storage`, err);
      }
      attempts += 1;
    }
  }
  // log to Sentry if keeps failing
  Sentry.captureMessage(`Unable to retrieve ${name} from async storage`, {
    level: 'error',
  });
  await deleteAsyncItem(name);
  return null;
};

// https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#how-can-i-use-a-custom-storage-engine
export const createAsyncStorage = (): StateStorage => ({
  getItem: retrieveAsyncItem,
  setItem: setAsyncItem,
  removeItem: deleteAsyncItem,
});
