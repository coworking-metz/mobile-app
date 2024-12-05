import 'expo-router/entry';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { initSentry } from '@/services/sentry';

initSentry();

configureReanimatedLogger({
  strict: false, // Reanimated runs in strict mode by default
});
