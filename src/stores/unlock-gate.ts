import { createAsyncStorage } from './async-storage';
import * as Sentry from '@sentry/react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { log } from '@/helpers/logger';
import { ApiBeaconRegion } from '@/services/api/services';

type BeaconRegionState = 'inside' | 'outside';

const unlockGateLogger = log.extend('[unlock-gate]');

interface UnlockGateState {
  /**
   * Whether the store has been loaded from the storage.
   */
  hydrated: boolean;
  beaconRegion: ApiBeaconRegion | null;
  /**
   * Last known beacon region state, kept in memory only (not persisted, see
   * partialize below). Used to dedupe repeated "inside" events (like a screen
   * wake) that aren't a real transition. Not persisting it means a stale
   * "inside" from before a full app kill can't survive an unobserved
   * outside/inside cycle and silently block the next real unlock.
   */
  lastRegionState: BeaconRegionState | null;
  /**
   * Timestamp of the last unlock attempt, regardless of outcome.
   * Used to enforce a cooldown between attempts.
   */
  lastAttemptAt: number | null;
  clear: () => Promise<void>;

  /** DEBUG variables */
  shouldUnlock?: boolean;
  minRetryIntervalInMs: number;
}

const useUnlockGateStore = create<UnlockGateState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        hydrated: false,
        beaconRegion: null,
        lastRegionState: null,
        lastAttemptAt: null,
        shouldUnlock: false,
        minRetryIntervalInMs: 60_000,
        clear: async () => {
          set({
            beaconRegion: null,
            lastRegionState: null,
            lastAttemptAt: null,
            shouldUnlock: false,
            minRetryIntervalInMs: 60_000,
          });
        },
      }),
      {
        name: 'unlock-gate-options-storage',
        storage: createJSONStorage(createAsyncStorage),
        partialize: (state) => ({
          beaconRegion: state.beaconRegion,
          lastAttemptAt: state.lastAttemptAt,
          shouldUnlock: state.shouldUnlock,
          minRetryIntervalInMs: state.minRetryIntervalInMs,
        }),
        onRehydrateStorage: (_state) => {
          unlockGateLogger.info('Hydrating unlock-gate storage');
          return (_, error) => {
            if (error) {
              unlockGateLogger.error('Unable to hydrate unlock-gate storage', error);
              Sentry.captureException(error);
            } else {
              unlockGateLogger.info('Unlock-gate storage hydrated');
              useUnlockGateStore.setState({ hydrated: true });
            }
          };
        },
      },
    ),
  ),
);

export default useUnlockGateStore;
