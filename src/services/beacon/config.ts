import type { BeaconRegion } from 'react-native-beacon-kit';
import { log } from '@/helpers/logger';
import { API_BASE_URL } from '@/services/environment';

const configLogger = log.extend('[beacon:config]');

const PLACEHOLDER_UUID = '2BDA481F-3A93-4DA2-B6B8-114FDD537D9C';

if (!process.env.EXPO_PUBLIC_BEACON_UUID) {
  configLogger.warn(
    'EXPO_PUBLIC_BEACON_UUID is not set — falling back to a placeholder UUID that will never match the real Feasycom FSC-BP108 beacon.',
  );
}

export const BEACON_REGION: BeaconRegion = {
  identifier: process.env.EXPO_PUBLIC_BEACON_IDENTIFIER || 'coworking-metz-gate',
  uuid: process.env.EXPO_PUBLIC_BEACON_UUID || PLACEHOLDER_UUID,
  major: Number(process.env.EXPO_PUBLIC_BEACON_MAJOR) || 50408,
  minor: Number(process.env.EXPO_PUBLIC_BEACON_MINOR) || 17551,
};
