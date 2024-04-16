import { createAsyncStorage } from './async-storage';
import createSecureStorage from './secure-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const SYSTEM_OPTION = 'system';

export type StoreLanguage = string | typeof SYSTEM_OPTION;

interface SettingsState {
  hasOnboard: boolean;
  setOnboard: (hasOnboard: boolean) => Promise<void>;
  hasLearnPullToRefresh: boolean;
  setLearnPullToRefresh: (hasPullToRefresh: boolean) => Promise<void>;
  language: StoreLanguage;
  setLanguange: (language: StoreLanguage) => Promise<void>;
  apiBaseUrl: string | null;
  setApiBaseUrl: (apiBaseUrl: string) => Promise<void>;
  clear: () => Promise<void>;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, _get) => ({
      hasOnboard: false,
      setOnboard: async (hasOnboard: boolean): Promise<void> => {
        await set({ hasOnboard });
      },
      hasLearnPullToRefresh: false,
      setLearnPullToRefresh: async (hasPullToRefresh: boolean): Promise<void> => {
        await set({ hasLearnPullToRefresh: hasPullToRefresh });
      },
      language: SYSTEM_OPTION,
      setLanguange: async (language: StoreLanguage): Promise<void> => {
        await set({ language });
      },
      apiBaseUrl: null,
      setApiBaseUrl: async (apiBaseUrl: string | null): Promise<void> => {
        await set({ apiBaseUrl: apiBaseUrl || null });
      },
      clear: async (): Promise<void> => {
        await set({
          hasOnboard: false,
          hasLearnPullToRefresh: false,
          language: SYSTEM_OPTION,
        });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(createAsyncStorage),
    },
  ),
);

export default useSettingsStore;
