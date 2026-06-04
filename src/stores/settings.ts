import { createAsyncStorage } from './async-storage';
import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { CommutingMode } from '@/helpers/commute';
import { log } from '@/helpers/logger';
import { IS_DEV } from '@/services/environment';
import { setAppThemePreference, type AppThemePreference } from '@/services/theme';

export const SYSTEM_OPTION = 'system';

export type StoreLanguage = string | typeof SYSTEM_OPTION;

interface SettingsState {
  /**
   * Whether the store has been loaded from the storage.
   */
  hydrated: boolean;
  /**
   * Whether the user has seen at least once the introduction.
   */
  hasSeenIntroduction: boolean;
  /**
   * Whether user has pulled to refresh at least once the home screen.
   */
  hasLearnPullToRefresh: boolean;
  /**
   * Whether the user has been invited to review the app at least once
   * following a great experience.
   */
  hasBeenInvitedToReview: boolean;
  /**
   * Last time the user has seen the birthday present on the home screen, in ISO format.
   * Used to highlight the birthday card on the home screen.
   */
  hasSeenBirthdayPresentAt: string | null;
  /**
   * Last time the user has read the onboarding instructions, in ISO format.
   * Used to highlight the onboarding card on the home screen.
   */
  hasReadOnboardingInstructionsAt: string | null;
  /**
   * Whether the user has dismissed the push notifications alert
   * on messages screen.
   */
  hidePushNotificationsAlert: boolean;
  /**
   * Whether home screen should use the native pull to refresh
   * instead of custom animations from rive.
   */
  withNativePullToRefresh: boolean;
  /**
   * Whether each bottom sheet should take the full height of the screen when opened.
   */
  withBottomSheetFullHeight: boolean;
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
  withBottomSheetFullHeight: Platform.OS === 'ios' && Math.floor(Number(Platform.Version)) <= 15, // iOS 15- has some issues with react-native-true-sheet 'auto' detent
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
