import createSecureStorage from './SecureStorage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const SYSTEM_OPTION = 'system';

export type StoreLanguage = string | typeof SYSTEM_OPTION;

interface SettingsState {
  hasOnboard: boolean;
  setOnboard: (hasOnboard: boolean) => Promise<void>;
  language: StoreLanguage;
  setLanguange: (language: StoreLanguage) => Promise<void>;
  clear: () => Promise<void>;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      hasOnboard: false,
      setOnboard: async (hasOnboard: boolean): Promise<void> => {
        await set({ hasOnboard });
      },
      language: SYSTEM_OPTION,
      setLanguange: async (language: StoreLanguage): Promise<void> => {
        await set({ language });
      },
      clear: async (): Promise<void> => {
        await set({
          hasOnboard: false,
          language: SYSTEM_OPTION,
        });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(createSecureStorage),
    },
  ),
);

export default useSettingsStore;
