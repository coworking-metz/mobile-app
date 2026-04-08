import { Redirect } from 'expo-router';
import { useAppAuth } from '@/context/auth';
import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const logger = log.extend(`[splashscreen]`);
export default function Splashscreen() {
  const { ready } = useAppAuth();
  const hasSeenIntroduction = useSettingsStore((state) => state.hasSeenIntroduction);
  const user = useAuthStore((s) => s.user);

  if (ready) {
    logger.debug(`Has user already seen introduction? ${hasSeenIntroduction}`);
    if (!hasSeenIntroduction && !user) {
      return <Redirect href="/introduction" />;
    }
    return <Redirect href="/home" />;
  }

  return null;
}
