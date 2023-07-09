import * as SecureStore from 'expo-secure-store';
import { type StateStorage } from 'zustand/middleware';

// Custom storage object
// https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#how-can-i-use-a-custom-storage-engine
const createSecureStorage = (): StateStorage => ({
  getItem: async (name: string): Promise<string | null> => {
    return (await SecureStore.getItemAsync(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
});

export default createSecureStorage;
