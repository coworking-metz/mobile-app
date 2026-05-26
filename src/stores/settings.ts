import { createAsyncStorage } from './async-storage';
import * as Sentry from '@sentry/react-native';
import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { CommutingMode } from '@/helpers/commute';
import { log } from '@/helpers/logger';
import { IS_DEV } from '@/services/environment';
import { setAppThemePreference, type AppThemePreference } from '@/services/theme';

export const SYSTEM_OPTION = 'system';

export type StoreLanguage = string | typeof SYSTEM_OPTION;

interface SettingsState {
  hydrated: boolean; // whether the store has been loaded from the storage
  hasSeenIntroduction: boolean;
  hasLearnPullToRefresh: boolean;
  hasBeenInvitedToReview: boolean;
  hasSeenBirthdayPresentAt: string | null;
  hasReadOnboardingInstructionsAt: string | null;
  hidePushNotificationsAlert: boolean;
  withNativePullToRefresh: boolean;
  language: StoreLanguage;
  theme: AppThemePreference;
  commutingMode: CommutingMode;
  upcomingEventsPeriod: {
    count: number;
    unit: 'day' | 'week' | 'month';
  };
  apiBaseUrl: string | null;
  areTokensInAsyncStorage: boolean;
  clear: () => Promise<void>;
}

const settingsLogger = log.extend(`[settings]`);

const defaultSettingsState: Omit<SettingsState, 'hydrated' | 'clear'> = {
  hasSeenIntroduction: false,
  hasLearnPullToRefresh: false,
  hasBeenInvitedToReview: false,
  hasSeenBirthdayPresentAt: null,
  hasReadOnboardingInstructionsAt: null,
  hidePushNotificationsAlert: false,
  withNativePullToRefresh: IS_DEV,
  language: SYSTEM_OPTION,
  theme: SYSTEM_OPTION,
  commutingMode: CommutingMode.ON_FOOT,
  upcomingEventsPeriod: {
    count: 5,
    unit: 'day',
  },
  apiBaseUrl: null,
  areTokensInAsyncStorage: false,
};

const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector(
    persist(
      (set, _get) => ({
        ...defaultSettingsState,
        hydrated: false,
        clear: async (): Promise<void> => {
          await set(defaultSettingsState);
        },
      }),
      {
        name: 'settings-storage',
        storage: createJSONStorage(createAsyncStorage),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) =>
              Object.keys(defaultSettingsState).includes(key),
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
