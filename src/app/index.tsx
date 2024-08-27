import { Redirect } from 'expo-router';
import { useAppAuth } from '@/context/auth';
import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const logger = log.extend(`[splashscreen]`);
export default function Splashscreen() {
  const { ready } = useAppAuth();
  const hasOnboard = useSettingsStore((state) => state.hasOnboard);
  const user = useAuthStore((s) => s.user);

  if (ready) {
    logger.debug(`Does user has already onboard? ${hasOnboard}`);
    if (!hasOnboard && !user) {
      return <Redirect href="/onboarding" />;
    }
    return <Redirect href="/home" />;
  }

  return null;
}
