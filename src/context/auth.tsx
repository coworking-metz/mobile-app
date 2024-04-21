import { useGlobalSearchParams, useRootNavigation, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const authLogger = log.extend(`[auth.tsx]`);

const AuthContext = createContext<{
  isFetchingToken: boolean;
  ready: boolean;
}>({ isFetchingToken: false, ready: false });

export const useAppAuth = () => {
  return useContext(AuthContext);
};

// This hook will protect the route access based on user authentication.
const useProtectedRoute = (ready: boolean, setReady: (ready: boolean) => void) => {
  const { t } = useTranslation();
  const segments = useSegments();
  const rootNavigation = useRootNavigation();
  const router = useRouter();

  const authStore = useAuthStore();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasOnboard = useSettingsStore((state) => state.hasOnboard);
  const isAuthStoreHydrated = useAuthStore((state) => state.hydrated);
  const isSettingsStoreHydrated = useSettingsStore((state) => state.hydrated);
  const notifyError = useErrorNotification();

  const { accessToken: queryAccessToken, refreshToken: queryRefreshToken } = useGlobalSearchParams<{
    accessToken: string;
    refreshToken: string;
  }>();

  const checkAuthorization = useCallback(
    async (seg: string[], rt: string | null, at: string | null) => {
      const [firstSegment] = seg;
      const isScreenPrivate = !firstSegment || '(private)' === firstSegment;

      if (isScreenPrivate) {
        if (rt) {
          if (!at) {
            return authStore
              .refreshAccessToken()
              .then(() => Promise.resolve(true))
              .catch((error) => {
                notifyError(t('auth.login.onRefreshTokenFail.message'), error);
                return Promise.resolve(false);
              });
          }
        } else {
          return Promise.resolve(false);
        }
      }

      return Promise.resolve(true);
    },
    [],
  );

  useEffect(() => {
    console.log(
      { isAuthStoreHydrated, isSettingsStoreHydrated, refreshToken },
      rootNavigation?.isReady(),
    );
    if (!rootNavigation?.isReady()) return;
    if (!isAuthStoreHydrated || !isSettingsStoreHydrated) return;

    authLogger.debug('Path or tokens have changed', {
      queryRefreshToken,
      queryAccessToken,
      refreshToken,
      segments: segments.join('/'),
    });

    if (queryRefreshToken && queryAccessToken && refreshToken !== queryRefreshToken) {
      authLogger.debug('Setting tokens from query params', {
        queryRefreshToken,
      });
      authStore.setTokens(queryAccessToken, queryRefreshToken);
      router.setParams({ accessToken: '', refreshToken: '' });
      // setting a new refreshToken will re-trigger the useEffect
      return;
    }

    checkAuthorization(segments, refreshToken, accessToken)
      .then((isAuthorized) => {
        authLogger.debug(`isAuthorized for "/${segments.join('/') || 'index'}": ${isAuthorized}`);
        if (!isAuthorized) {
          authLogger.debug('redirecting to login');
          return rootNavigation.reset({
            index: 0,
            routes: [{ name: '(public)/login' }],
          });
        } else if (
          !segments.length ||
          // hack to prevent redirecting to login view once user is logged in
          (segments.includes('home') &&
            rootNavigation.getState().routes.some(({ name }) => name === '(public)/login'))
        ) {
          authLogger.debug('redirecting to /home');
          return rootNavigation.reset({
            index: 0,
            routes: [{ name: '(private)/home' }],
          });
        }
      })
      .finally(() => {
        setReady(true);
      });
  }, [
    rootNavigation,
    segments,
    queryRefreshToken,
    queryAccessToken,
    isAuthStoreHydrated,
    isSettingsStoreHydrated,
    refreshToken,
  ]);

  useLayoutEffect(() => {
    if (ready) {
      authLogger.debug('Does user has already onboard?', hasOnboard);
      if (!hasOnboard && !refreshToken) {
        router.push('(public)/onboarding');
      }

      authLogger.debug('Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [ready, hasOnboard, refreshToken]);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const authStore = useAuthStore();

  useProtectedRoute(ready, setReady);

  return (
    <AuthContext.Provider value={{ isFetchingToken: authStore.isFetchingToken, ready }}>
      {children}
    </AuthContext.Provider>
  );
};
