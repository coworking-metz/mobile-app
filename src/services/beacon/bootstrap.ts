import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { type BeaconFailureEvent, type RegionStateChangedEvent } from 'react-native-beacon-kit';
import { log } from '@/helpers/logger';
import { unlockSteelGate } from '@/services/api/services';
import { BEACON_REGION } from '@/services/beacon/config';
import { API_BASE_URL } from '@/services/environment';
import { HTTP } from '@/services/http';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const beaconLogger = log.extend('[beacon]');

// Captured as early as this module can observe — after the imports above have
// resolved (unavoidable, ES module imports resolve before any statement in this
// file runs), but before we do anything else. Used purely to time how long each
// phase below takes.
const moduleLoadedAt = Date.now();

const waitForAuthHydration = (timeoutMs = 4_000): Promise<void> => {
  if (useAuthStore.getState().hydrated) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unsubscribe();
      resolve();
    };

    const timer = setTimeout(finish, timeoutMs);
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.hydrated,
      (hydrated) => {
        if (hydrated) finish();
      },
    );
  });
};

const handleRegionStateChanged = async ({
  region,
  state,
}: RegionStateChangedEvent): Promise<void> => {
  const eventReceivedAt = Date.now();
  const sinceModuleLoadMs = eventReceivedAt - moduleLoadedAt;
  beaconLogger.info(
    `Region ${region.identifier} -> ${state} (+${sinceModuleLoadMs}ms since module load)`,
  );

  const lastStateKey = `beacon:lastRegionState:${region.identifier}`;
  const previousState = await AsyncStorage.getItem(lastStateKey);
  await AsyncStorage.setItem(lastStateKey, state);

  if (state !== 'inside') {
    beaconLogger.info(
      'Beacon: sortie de région',
      `${region.identifier} -> outside (+${sinceModuleLoadMs}ms depuis chargement JS)`,
    );
    return;
  }

  if (previousState === 'inside') {
    beaconLogger.info(
      'Beacon: entrée répétée (ignorée)',
      `${region.identifier} déjà "inside" (+${sinceModuleLoadMs}ms) — probablement un réveil d'écran. unlockSteelGate() non appelé.`,
    );
    return;
  }

  try {
    await waitForAuthHydration();
    const authHydratedAt = Date.now();

    const token = await useAuthStore.getState().getOrRefreshAccessToken();
    const tokenObtainedAt = Date.now();

    if (token) {
      HTTP.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    HTTP.defaults.baseURL = API_BASE_URL;

    const duration = useSettingsStore.getState().unlockGateDurationInMs;
    const result = await unlockSteelGate(duration);
    const respondedAt = Date.now();

    beaconLogger.info(
      'Beacon: portail déverrouillé',
      [
        `+${authHydratedAt - eventReceivedAt}ms hydratation auth`,
        `+${tokenObtainedAt - authHydratedAt}ms token`,
        `+${respondedAt - tokenObtainedAt}ms HTTP`,
        `total +${respondedAt - moduleLoadedAt}ms depuis chargement JS`,
        `triggered=${result.triggered}`,
      ].join(' | '),
    );
  } catch (error) {
    const failedAt = Date.now();
    beaconLogger.error('unlockSteelGate failed', error);
    beaconLogger.info(
      'Beacon: échec du déverrouillage',
      `+${failedAt - moduleLoadedAt}ms depuis chargement JS | ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } finally {
    delete HTTP.defaults.headers.common.Authorization;
  }
};

const handleMonitoringFailed = async (event: BeaconFailureEvent): Promise<void> => {
  const identifier = event.region?.identifier ?? BEACON_REGION.identifier;
  beaconLogger.error(`Monitoring failed for ${identifier}: ${event.code} - ${event.message}`);
  beaconLogger.info('Beacon: monitoring en échec', `${event.code}: ${event.message}`);
};

// The iOS Simulator has no Bluetooth radio, and react-native-beacon-kit's native
// module is not guaranteed to behave on it — merely *importing* the package (which
// arms a CLLocationManager/CBCentralManager pair as a side effect, see below) is
// enough to risk a crash there. `Device.isDevice` is false on simulators/emulators,
// so the package is never even required in that case: the `import()` below is
// dynamic specifically so nothing beacon-kit-related loads unless we're on a real
// device.
const initializeBeacon = async (): Promise<void> => {
  try {
    const { default: Beacon } = await import('react-native-beacon-kit');

    // From here on: synchronous, no `await` — the dynamic import above already
    // armed the native delegate as a side effect of evaluating the module, and
    // CoreLocation can deliver a pending region event on the very next run loop
    // turn. Registering the JS listeners immediately, in the same continuation,
    // keeps that race window as tight as it can be — `NativeEventEmitter` has no
    // event queue, so a listener registered too late silently misses the event.
    Beacon.onRegionStateChanged((event) => {
      void handleRegionStateChanged(event);
    });

    Beacon.onMonitoringFailed((event) => {
      void handleMonitoringFailed(event);
    });

    // Idempotent and safe on every cold start: iOS persists region monitoring
    // across app terminations once registered, so this call is a no-op most of
    // the time and only actually matters on the very first run.
    void Beacon.startMonitoring(BEACON_REGION).catch((error) => {
      beaconLogger.error('Beacon.startMonitoring failed', error);
    });
  } catch (error) {
    // This runs before Sentry is initialized (see index.ts) and before any error
    // boundary exists — an uncaught throw here would crash every app launch,
    // including normal foreground ones. Log and swallow instead.
    console.error('[beacon] bootstrap failed', error);
  }
};

if (Device.isDevice) {
  void initializeBeacon();
} else {
  beaconLogger.info('Beacon monitoring disabled: no Bluetooth on simulator/emulator');
}
