import { createAsyncStorage } from './async-storage';
import * as Sentry from '@sentry/react-native';
import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { log } from '@/helpers/logger';

export const SYSTEM_OPTION = 'system';

export type StoreLanguage = string | typeof SYSTEM_OPTION;

interface SettingsState {
  hydrated: boolean; // whether the store has been loaded from the storage
  hasOnboard: boolean;
  hasLearnPullToRefresh: boolean;
  language: StoreLanguage;
  apiBaseUrl: string | null;
  areTokensInAsyncStorage: boolean;
  clear: () => Promise<void>;
}

const settingsLogger = log.extend(`[settings]`);

const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector(
    persist(
      (set, _get) => ({
        hydrated: false,
        hasOnboard: false,
        hasLearnPullToRefresh: false,
        language: SYSTEM_OPTION,
        apiBaseUrl: null,
        areTokensInAsyncStorage: false,
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
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) =>
              [
                'hasOnboard',
                'hasLearnPullToRefresh',
                'language',
                'apiBaseUrl',
                'areTokensInAsyncStorage',
              ].includes(key),
            ),
          ),
        onRehydrateStorage: (state) => {
          settingsLogger.info(`Hydrating`);
          return (state, error) => {
            if (error) {
              settingsLogger.error(`Unable to hydrate settings storage`, error);
              Sentry.captureException(error);
            } else {
              settingsLogger.info(`Settings storage hydrated`);
              useSettingsStore.setState({ hydrated: true });
            }
          };
        },
      },
    ),
  ),
);

export default useSettingsStore;
