import { createAsyncStorage } from './async-storage';
import * as Sentry from '@sentry/react-native';
import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { log } from '@/helpers/logger';
import { IS_DEV } from '@/services/environment';
import { setAppThemePreference, type AppThemePreference } from '@/services/theme';

export const SYSTEM_OPTION = 'system';

export type StoreLanguage = string | typeof SYSTEM_OPTION;

interface SettingsState {
  hydrated: boolean; // whether the store has been loaded from the storage
  hasOnboard: boolean;
  hasLearnPullToRefresh: boolean;
  hasBeenInvitedToReview: boolean;
  hasSeenBirthdayPresentAt: string | null;
  withNativePullToRefresh: boolean;
  language: StoreLanguage;
  theme: AppThemePreference;
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
        hasBeenInvitedToReview: false,
        hasSeenBirthdayPresentAt: null,
        withNativePullToRefresh: IS_DEV,
        language: SYSTEM_OPTION,
        theme: SYSTEM_OPTION,
        apiBaseUrl: null,
        areTokensInAsyncStorage: false,
        clear: async (): Promise<void> => {
          await set({
            hasOnboard: false,
            hasLearnPullToRefresh: false,
            hasBeenInvitedToReview: false,
            hasSeenBirthdayPresentAt: null,
            withNativePullToRefresh: IS_DEV,
            language: SYSTEM_OPTION,
            theme: SYSTEM_OPTION,
            apiBaseUrl: null,
            areTokensInAsyncStorage: false,
          } as Omit<SettingsState, 'clear' | 'hydrated'>);
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
                'hasBeenInvitedToReview',
                'hasSeenBirthdayPresentAt',
                'withNativePullToRefresh',
                'language',
                'theme',
                'apiBaseUrl',
                'areTokensInAsyncStorage',
              ].includes(key),
            ),
          ),
        onRehydrateStorage: (_state) => {
          settingsLogger.info(`Hydrating settings storage`);
          return (_, error) => {
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

useSettingsStore.subscribe(
  (state) => state.theme,
  (newTheme) => {
    setAppThemePreference(newTheme);
  },
  { fireImmediately: true },
);

export default useSettingsStore;
