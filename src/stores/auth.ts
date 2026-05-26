import { createAsyncStorage } from './async-storage';
import useNoticeStore from './notice';
import useNotificationStore from './notification';
import createSecureStorage from './secure-storage';
import useSettingsStore from './settings';
import useToastStore from './toast';
import * as Sentry from '@sentry/react-native';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner-native';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { AnyError, parseErrorText } from '@/helpers/error';
import { log } from '@/helpers/logger';
import i18n from '@/i18n';
import { getAccessAndRefreshTokens, type ApiUser } from '@/services/api/auth';
import { removePushToken } from '@/services/api/push-tokens';

/**
 * In order to avoid asking for multiple refresh tokens at the same time when it has expired,
 * this singleton holds the http request Promise until a new token is fetched.
 */
let refreshTokensPromise: Promise<string | null> | null = null;

interface AuthState {
  hydrated: boolean; // whether the store has been loaded from the storage
  accessToken: string | null;
  refreshToken: string | null;
  user: ApiUser | null;
  isFetchingToken: boolean;
  refreshAccessToken: () => Promise<string | null>;
  getOrRefreshAccessToken: () => Promise<string | null>;
  setTokens: (accessToken: string | null, refreshToken: string | null) => Promise<void>;
  clear: () => Promise<void>;
  logout: () => Promise<void>;
  disconnect: (error: AxiosError) => Promise<void>;
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
          if (!refreshTokensPromise) {
            authLogger.debug('Refreshing access token');
            set({ isFetchingToken: true });
            refreshTokensPromise = getAccessAndRefreshTokens(
              get().refreshToken as string,
              get().accessToken as string,
            )
              .then(async ({ accessToken, refreshToken }) => {
                await get().setTokens(accessToken, refreshToken);
                return accessToken;
              })
              .catch(async (error: AxiosError) => {
                if (error.response?.status === 401) {
                  authLogger.debug('Disconnecting user due to server-side unauthorized error');
                  get().disconnect(error);

                  // prefix a descriptive error message
                  // to let the user know that refreshing tokens failed
                  const errorMessage = await parseErrorText(error);
                  const prefixedError = new Error(
                    [i18n.t('auth.onRefreshToken.fail'), errorMessage].filter(Boolean).join('\n'),
                    { cause: error },
                  );
                  return Promise.reject(prefixedError);
                }

                return Promise.reject(error);
              })
              .finally(() => {
                set({ isFetchingToken: false });
                refreshTokensPromise = null;
              });
          }
          return refreshTokensPromise;
        },
        getOrRefreshAccessToken: async (): Promise<string | null> => {
          const accessToken = get().accessToken;
          const expired = accessToken ? jwtDecode<ApiUser | null>(accessToken)?.exp : null;
          if (!expired || dayjs().isAfter(dayjs.unix(expired))) {
            return get().refreshAccessToken();
          }

          return accessToken;
        },
        /**
         * Remove all data relative to authentication
         */
        clear: async (): Promise<void> => {
          await get().setTokens(null, null);
        },
        /**
         * Clear user credentials
         */
        logout: async (): Promise<void> => {
          const userId = get().user?.id;
          const notificationStore = useNotificationStore.getState();
          const expoPushToken = notificationStore.expoPushToken;
          if (userId && expoPushToken) {
            removePushToken(userId, expoPushToken);
            notificationStore.clear();
          }
          await get().clear();
        },
        /**
         * Disconnect the user following a server-side request (401 Unauthorized)
         */
        disconnect: async (error: AnyError): Promise<void> => {
          await get().logout();

          const toastStore = useToastStore.getState();
          const noticeStore = useNoticeStore.getState();
          const disconnectedMessage = i18n.t('auth.onDisconnected.message');
          const errorMessage = await parseErrorText(error);
          toastStore.add({
            message: disconnectedMessage,
            type: 'error',
            action: {
              label: i18n.t('actions.more'),
              onPress: () => {
                noticeStore.add({
                  message: disconnectedMessage,
                  description: errorMessage,
                  type: 'error',
                });
                toast.dismiss();
              },
            },
          });
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(createSecureStorage),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => ['refreshToken', 'accessToken'].includes(key)),
          ),
        skipHydration: true,
      },
    ),
  ),
);

useAuthStore.subscribe(
  (state) => state.accessToken,
  (accessToken) => {
    if (accessToken) {
      const user = jwtDecode<ApiUser | null>(accessToken);
      Sentry.setUser({ email: user?.email });
      useAuthStore.setState({ user });
    } else {
      Sentry.setUser(null);
      useAuthStore.setState({ user: null });
    }
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
