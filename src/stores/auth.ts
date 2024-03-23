import createSecureStorage from './SecureStorage';
import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { log } from '@/helpers/logger';
import { type ApiUser, decodeToken, getAccessAndRefreshTokens } from '@/services/api/auth';

/**
 * In order to avoid asking for multiple refresh tokens at the same time when it has expired,
 * this singleton holds the http request Promise until a new token is fetched.
 */
let refreshTokenPromise: Promise<void> | null = null;

interface AuthState {
  user: ApiUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isFetchingToken: boolean;
  refreshAccessToken: () => Promise<void>;
  getOrRefreshAccessToken: () => Promise<string | null>;
  setTokens: (accessToken: string | null, refreshToken: string | null) => Promise<void>;
  logout: () => Promise<void>;
  clear: () => Promise<void>;
}

const authLogger = log.extend(`[auth]`);

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isFetchingToken: false,
      setTokens: async (accessToken: string | null, refreshToken: string | null): Promise<void> => {
        const user = accessToken ? decodeToken(accessToken) : null;
        await set({ user, accessToken, refreshToken });
      },
      refreshAccessToken: (): Promise<void> => {
        if (!refreshTokenPromise) {
          authLogger.debug('Refreshing access token');
          set({ isFetchingToken: true });
          refreshTokenPromise = getAccessAndRefreshTokens(get().refreshToken as string)
            .then(async ({ accessToken, refreshToken }) => {
              const user = accessToken ? decodeToken(accessToken) : null;
              Sentry.setUser({ email: user?.email });
              await set({ user, accessToken, refreshToken });
            })
            .finally(() => {
              set({ isFetchingToken: false });
              refreshTokenPromise = null;
            });
        }
        return refreshTokenPromise;
      },
      async getOrRefreshAccessToken() {
        const accessToken = get().accessToken;
        if (accessToken) {
          const { exp } = decodeToken(accessToken);
          if (exp && dayjs().isAfter(dayjs.unix(exp))) {
            await get().refreshAccessToken();
          }
        }

        return get().accessToken;
      },
      logout: async (): Promise<void> => {
        Sentry.setUser(null);
        await set({ user: null, accessToken: null, refreshToken: null });
      },
      clear: async (): Promise<void> => {
        Sentry.setUser(null);
        await set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(createSecureStorage),
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter(([key]) => ['refreshToken'].includes(key))),
    },
  ),
);

export default useAuthStore;
