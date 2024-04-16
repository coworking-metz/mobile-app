import * as Sentry from '@sentry/react-native';
import * as SecureStore from 'expo-secure-store';
import { type StateStorage } from 'zustand/middleware';
import { log } from '@/helpers/logger';

// if fetchKeychain fails, try again couple times
const RETRIEVE_ATTEMPTS_LIMIT = 3;

const setStoreItem = async (name: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(name, value);
  } catch (error) {
    Sentry.captureException(error);
  }
};

const deleteStoreItem = async (name: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(name);
  } catch (error) {
    Sentry.captureException(error);
  }
};

const retrieveStoreItem = async (name: string): Promise<string | null> => {
  let attempts = 0;
  while (attempts < RETRIEVE_ATTEMPTS_LIMIT) {
    try {
      const data = await SecureStore.getItemAsync(name);

      return data ?? null;
    } catch (err) {
      if (attempts === 0) {
        log.error(`Failed to retrieve ${name} from secure storage`, err);
      }
      attempts += 1;
    }
  }
  // log to Sentry if keeps failing
  Sentry.captureMessage(`Unable to retrieve ${name} from secure storage`, {
    level: 'error',
  });
  await deleteStoreItem(name);
  return null;
};

// Custom storage object
// https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#how-can-i-use-a-custom-storage-engine
const createSecureStorage = (): StateStorage => ({
  getItem: retrieveStoreItem,
  setItem: setStoreItem,
  removeItem: deleteStoreItem,
});

export default createSecureStorage;
