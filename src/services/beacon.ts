import axios from 'axios';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import {
  type BeaconFailureEvent,
  type BeaconRegion,
  type RegionStateChangedEvent,
} from 'react-native-beacon-kit';
import { log } from '@/helpers/logger';
import {
  API_BASE_URL,
  APP_NAME,
  APP_VERSION,
  IS_GATE_UNLOCK_ON_APPROACH_ENABLED,
} from '@/services/environment';
import { HTTP } from '@/services/http';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';
import useUnlockGateStore from '@/stores/unlock-gate';

const beaconLogger = log.extend('[beacon]');

export const isBeaconMonitoringAvailable = Device.isDevice;

const scheduleNotification = async (title: string, body: string): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          pathname: `/logs/${new Date().toISOString().slice(0, 10)}`,
        },
      },
      trigger: null,
    });
  } catch (error) {
    beaconLogger.error('Failed to schedule notification', error);
  }
};

// Reference point for the timing breadcrumbs logged below.
const moduleLoadedAt = Date.now();

// Resolves once the store's persisted state has loaded, or rejects after timeoutMs.
// Callers must not proceed as if hydrated — in-memory defaults look like real values.
const waitForHydration = (
  store: {
    getState: () => { hydrated: boolean };
    subscribe: (
      selector: (state: { hydrated: boolean }) => boolean,
      listener: (hydrated: boolean) => void,
    ) => () => void;
  },
  timeoutMs = 4_000,
): Promise<void> => {
  if (store.getState().hydrated) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unsubscribe();
      resolve();
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      unsubscribe();
      reject(new Error(`hydration timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    const unsubscribe = store.subscribe(
      (state) => state.hydrated,
      (hydrated) => {
        if (hydrated) finish();
      },
    );
  });
};

const waitForAuthHydration = () => waitForHydration(useAuthStore);
const waitForSettingsHydration = () => waitForHydration(useSettingsStore);
const waitForUnlockGateHydration = () => waitForHydration(useUnlockGateStore);

const handleRegionStateChanged = async ({
  region,
  state,
}: RegionStateChangedEvent): Promise<void> => {
  const eventReceivedAt = Date.now();
  const sinceModuleLoadMs = eventReceivedAt - moduleLoadedAt;
  beaconLogger.debug(
    `Region ${region.identifier} -> ${state} (+${sinceModuleLoadMs}ms since module load)`,
  );

  const previousState = useUnlockGateStore.getState().lastRegionState;
  useUnlockGateStore.setState({ lastRegionState: state });

  if (state !== 'inside') {
    beaconLogger.debug(
      'Beacon: sortie de région',
      `${region.identifier} -> outside (+${sinceModuleLoadMs}ms depuis chargement JS)`,
    );
    return;
  }

  if (previousState === 'inside') {
    beaconLogger.debug(
      'Beacon: entrée répétée (ignorée)',
      `${region.identifier} déjà "inside" (+${sinceModuleLoadMs}ms) — probablement un réveil d'écran. unlockSteelGate() non appelé.`,
    );
    return;
  }

  // Guards against a stale monitoring registration firing after the toggle was disabled.
  if (!useSettingsStore.getState().withGateUnlockOnApproach) {
    beaconLogger.debug(
      `Region ${region.identifier} -> inside ignored: beacon monitoring is disabled in settings`,
    );
    return;
  }

  const lastAttemptAt = useUnlockGateStore.getState().lastAttemptAt;
  const minRetryIntervalInMs = useUnlockGateStore.getState().minRetryIntervalInMs;
  if (lastAttemptAt && eventReceivedAt - lastAttemptAt < minRetryIntervalInMs) {
    beaconLogger.debug(
      `Region ${region.identifier} -> inside ignored: last attempt was ${
        eventReceivedAt - lastAttemptAt
      }ms ago (< ${minRetryIntervalInMs}ms cooldown)`,
    );
    return;
  }
  // Recorded before attempting so a crash mid-request still counts toward the cooldown.
  useUnlockGateStore.setState({ lastAttemptAt: eventReceivedAt });

  try {
    await waitForAuthHydration().catch((error) => {
      beaconLogger.error('Unable to hydrate the auth store', error);
      throw error;
    });
    const authHydratedAt = Date.now();

    const token = await useAuthStore.getState().getOrRefreshAccessToken(false);
    if (!token) return;
    const tokenObtainedAt = Date.now();

    const duration = useSettingsStore.getState().unlockGateDurationInMs;
    if (useUnlockGateStore.getState().shouldUnlock) {
      await axios.post(
        '/api/on-premise/unlock-gate',
        { duration },
        {
          baseURL: API_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
            'X-APP-NAME': APP_NAME,
            'X-APP-VERSION': APP_VERSION,
          },
        },
      );
    }

    const respondedAt = Date.now();

    const successMessage = [
      `+${authHydratedAt - eventReceivedAt}ms hydratation auth`,
      `+${tokenObtainedAt - authHydratedAt}ms token`,
      `+${respondedAt - tokenObtainedAt}ms HTTP`,
      `total +${respondedAt - moduleLoadedAt}ms depuis chargement JS`,
      // `triggered=${result.triggered}`,
    ].join(' | ');
    beaconLogger.info('Beacon: portail déverrouillé', successMessage);
    await scheduleNotification('Portail déverrouillé', successMessage);
  } catch (error) {
    const failedAt = Date.now();
    const failureMessage = `+${failedAt - moduleLoadedAt}ms depuis chargement JS | ${
      error instanceof Error ? error.message : String(error)
    }`;
    beaconLogger.error('Beacon: échec du déverrouillage', failureMessage, error);
    await scheduleNotification('Échec du déverrouillage', failureMessage);
  } finally {
    delete HTTP.defaults.headers.common.Authorization;
  }
};

const handleMonitoringFailed = async (event: BeaconFailureEvent): Promise<void> => {
  const identifier =
    event.region?.identifier ?? useUnlockGateStore.getState().beaconRegion?.identifier ?? 'unknown';
  beaconLogger.error(`Monitoring failed for ${identifier}: ${event.code} - ${event.message}`);
  beaconLogger.warn('Beacon: monitoring en échec', `${event.code}: ${event.message}`);
};

type BeaconModule = typeof import('react-native-beacon-kit').default;

// Last region told to CoreLocation — needed to explicitly stop it if the
// identifier changes, since iOS only dedupes same-identifier registrations.
let lastAppliedRegion: BeaconRegion | null = null;

// Explicitly stops monitoring when disabled — iOS persists region registrations
// at the OS level, so skipping startMonitoring alone wouldn't stop background wakes.
const applyMonitoringState = (Beacon: BeaconModule, enabled: boolean): void => {
  const targetRegion = useUnlockGateStore.getState().beaconRegion;

  if (enabled) {
    if (!targetRegion) {
      beaconLogger.error('Cannot start monitoring: beacon config not fetched yet');
      return;
    }
    if (lastAppliedRegion && lastAppliedRegion.identifier !== targetRegion.identifier) {
      void Beacon.stopMonitoring(lastAppliedRegion).catch(() => {});
    }
    void Beacon.startMonitoring(targetRegion).catch((error) => {
      beaconLogger.error('Beacon.startMonitoring failed', error);
    });
    lastAppliedRegion = targetRegion;
  } else {
    const regionToStop = lastAppliedRegion ?? targetRegion;
    if (regionToStop) {
      void Beacon.stopMonitoring(regionToStop).catch((error) => {
        beaconLogger.error('Beacon.stopMonitoring failed', error);
      });
    }
    lastAppliedRegion = null;
  }
};

// Importing this package arms CLLocationManager/CBCentralManager as a side
// effect — risky on the Simulator (no Bluetooth radio, hence Device.isDevice)
// and it's what triggers iOS's Bluetooth prompt on a real device. Must stay
// gated behind withGateUnlockOnApproach too, or the prompt fires on first launch.
let hasRegisteredListeners = false;

const ensureBeaconInitialized = async (): Promise<BeaconModule> => {
  const { default: Beacon } = await import('react-native-beacon-kit');

  if (!hasRegisteredListeners) {
    hasRegisteredListeners = true;

    // No await below: the import above already armed the native delegate, and
    // NativeEventEmitter has no event queue — a late listener misses the event.
    Beacon.onRegionStateChanged((event) => {
      void handleRegionStateChanged(event);
    });

    Beacon.onMonitoringFailed((event) => {
      void handleMonitoringFailed(event);
    });
  }

  return Beacon;
};

const applySetting = async (enabled: boolean): Promise<void> => {
  try {
    const Beacon = await ensureBeaconInitialized();
    applyMonitoringState(Beacon, enabled);
  } catch (error) {
    // Can run before Sentry/error boundaries exist — log and swallow instead of crashing.
    beaconLogger.error('bootstrap failed', error);
  }
};

export const bootBeacon = async (): Promise<void> => {
  // Wait for both stores to hydrate so beaconRegion reflects the last persisted
  // config instead of racing the AsyncStorage read and reading null.
  try {
    await waitForSettingsHydration();
    if (useSettingsStore.getState().withGateUnlockOnApproach) {
      await waitForUnlockGateHydration();
      void applySetting(true);
    }
  } catch (error) {
    // Runs unawaited from index.ts — log instead of an unhandled rejection.
    // The subscriptions below still self-correct once hydration completes.
    beaconLogger.error('Initial beacon setup failed', error);
  }

  // Reacts to the toggle changing at runtime, including the first time it's
  // switched on — which is when the Bluetooth prompt fires.
  useSettingsStore.subscribe(
    (state) => state.withGateUnlockOnApproach,
    (enabled) => void applySetting(enabled),
  );

  // Reacts to a fresh beacon config from the backend (see
  // UnlockGateOptionsBottomSheet.tsx) while monitoring is already enabled.
  useUnlockGateStore.subscribe((state, previousState) => {
    if (state.beaconRegion === previousState.beaconRegion) return;
    if (useSettingsStore.getState().withGateUnlockOnApproach) {
      void applySetting(true);
    }
  });
};

export const requestBeaconLocationPermission = async (): Promise<boolean> => {
  const foreground = await Location.requestForegroundPermissionsAsync();
  beaconLogger.info(`Foreground location permission: ${foreground.status}`);
  if (foreground.status !== 'granted') {
    return false;
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  beaconLogger.info(`Background (Always) location permission: ${background.status}`);
  return background.status === 'granted';
};

export const bootstrapBeaconScan = async () => {
  if (IS_GATE_UNLOCK_ON_APPROACH_ENABLED && Device.isDevice) {
    await bootBeacon();
  }
};
