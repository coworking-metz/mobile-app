import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';

const intentLogger = log.extend(`[+native-intent]`);

// hydrating after setTokens would overwrite them with the stored ones
const waitForAuthHydration = () =>
  useAuthStore.persist.hasHydrated()
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
          unsubscribe();
          resolve();
        });
      });

// login redirects here with tokens: store them before routing so they never reach navigation state
export async function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  const [pathname, query = ''] = path.split('?');
  const params = new URLSearchParams(query);
  const accessToken = params.get('accessToken');
  const refreshToken = params.get('refreshToken');
  if (!accessToken || !refreshToken) return path;

  intentLogger.debug('Setting tokens from incoming link', { initial });
  await waitForAuthHydration();
  await useAuthStore.getState().setTokens(accessToken, refreshToken);

  params.delete('accessToken');
  params.delete('refreshToken');
  const rest = params.toString();
  return rest ? `${pathname}?${rest}` : pathname;
}
