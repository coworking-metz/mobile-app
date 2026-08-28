// to ensure beacon scanning is started as soon as possible
import { bootstrapBeaconScan } from '@/services/beacon';
bootstrapBeaconScan();

import 'expo-router/entry';
// eslint-disable-next-line import/order
import { configureReanimatedLogger } from 'react-native-reanimated';
import { initSentry } from '@/services/sentry';

initSentry();

configureReanimatedLogger({
  strict: false, // Reanimated runs in strict mode by default
});
