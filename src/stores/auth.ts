import { createAsyncStorage } from './async-storage';
import createSecureStorage from './secure-storage';
import useSettingsStore from './settings';
import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { log } from '@/helpers/logger';
import { type ApiUser, decodeToken, getAccessAndRefreshTokens } from '@/services/api/auth';

/**
 * In order to avoid asking for multiple refresh tokens at the same time when it has expired,
 * this singleton holds the http request Promise until a new token is fetched.
 */
let refreshTokenPromise: Promise<string | null> | null = null;

interface AuthState {
  hydrated: boolean; // whether the store has been loaded from the storage
  accessToken: string | null;
  refreshToken: string | null;
  user: ApiUser | null;
  isFetchingToken: boolean;
  refreshAccessToken: () => Promise<string | null>;
  getOrRefreshAccessToken: () => Promise<string | null>;
  setTokens: (accessToken: string | null, refreshToken: string | null) => Promise<void>;
  logout: () => Promise<void>;
  clear: () => Promise<void>;
}

const authLogger = log.extend(`[auth]`);

const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        hydrated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isFetchingToken: false,
        setTokens: async (
          accessToken: string | null,
          refreshToken: string | null,
        ): Promise<void> => {
          await set({ accessToken, refreshToken });
        },
        refreshAccessToken: (): Promise<string | null> => {
          if (!refreshTokenPromise) {
            authLogger.debug('Refreshing access token');
            set({ isFetchingToken: true });
            refreshTokenPromise = getAccessAndRefreshTokens(get().refreshToken as string)
              .then(async ({ accessToken, refreshToken }) => {
                // const user = accessToken ? decodeToken(accessToken) : null;
                // Sentry.setUser({ email: user?.email });
                await set({ accessToken, refreshToken });
                return accessToken;
              })
              .finally(() => {
                set({ isFetchingToken: false });
                refreshTokenPromise = null;
              });
          }
          return refreshTokenPromise;
        },
        getOrRefreshAccessToken: async (): Promise<string | null> => {
          const accessToken = get().accessToken;
          const expired = accessToken ? decodeToken(accessToken)?.exp : null;
          if (!expired || dayjs().isAfter(dayjs.unix(expired))) {
            return get().refreshAccessToken();
          }

          return accessToken;
        },
        clear: async (): Promise<void> => {
          Sentry.setUser(null);
          await set({
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
          Object.fromEntries(
            Object.entries(state).filter(([key]) => ['accessToken', 'refreshToken'].includes(key)),
          ),
        skipHydration: true,
      },
    ),
  ),
);

useAuthStore.subscribe(
  (state) => state.accessToken,
  (accessToken) => {
    const user = accessToken ? decodeToken(accessToken) : null;
    Sentry.setUser({ email: user?.email });
    useAuthStore.setState({ user });
  },
);

/**
 * Some users don't have access to the SecureStorage (don't ask why 🤷‍♀️).
 * This will give them the option to switch to AsyncStorage instead.
 */
const unsubscribe = useSettingsStore.subscribe(
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
        onRehydrateStorage: (prehydrationState) => {
          if (!prehydrationState.hydrated) {
            authLogger.info(`Hydrating auth storage`);
            return (_hydratedState, error) => {
              if (error) {
                authLogger.error(`Unable to hydrate auth storage`, error);
                Sentry.captureException(error);
              } else {
                authLogger.info(`Auth storage hydrated`);
                useAuthStore.setState({ hydrated: true });
              }
            };
          }
        },
      });

      await useAuthStore.persist.rehydrate();
      unsubscribe();
    }
  },
  { fireImmediately: true },
);

export default useAuthStore;
