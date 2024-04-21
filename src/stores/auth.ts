import { createAsyncStorage } from './async-storage';
import createSecureStorage from './secure-storage';
import useSettingsStore from './settings';
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
  hydrated: boolean; // whether the store has been loaded from the storage
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
      hydrated: false,
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
      getOrRefreshAccessToken: async (): Promise<string | null> => {
        const exp = get().user?.exp;
        if (!exp || dayjs().isAfter(dayjs.unix(exp))) {
          await get().refreshAccessToken();
        }

        return get().accessToken;
      },
      clear: async (): Promise<void> => {
        Sentry.setUser(null);
        await set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },
      logout: async (): Promise<void> => {
        await get().clear();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(createSecureStorage),
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter(([key]) => ['refreshToken'].includes(key))),
      skipHydration: true,
    },
  ),
);

/**
 * Some users don't have access to the SecureStorage (don't ask why 🤷‍♀️).
 * This will give them the option to switch to AsyncStorage instead.
 */
useSettingsStore.subscribe(
  (state) => [state.hydrated, state.areTokensInAsyncStorage],
  async ([hydrated, areTokensInAsyncStorage]) => {
    if (hydrated) {
      authLogger.info(
        `Hydrate auth storage from ${areTokensInAsyncStorage ? 'AsyncStorage' : 'SecureStorage'}`,
      );
      useAuthStore.persist.setOptions({
        storage: createJSONStorage(
          areTokensInAsyncStorage ? createAsyncStorage : createSecureStorage,
        ),
        onRehydrateStorage: (state) => {
          authLogger.info(`Hydrating`);
          return (state, error) => {
            if (error) {
              authLogger.error(`Unable to hydrate auth storage`, error);
              Sentry.captureException(error);
            } else {
              authLogger.info(`Auth storage hydrated`);
              useAuthStore.setState({ hydrated: true });
            }
          };
        },
      });

      await useAuthStore.persist.rehydrate();
    }
  },
  { fireImmediately: true },
);

export default useAuthStore;
