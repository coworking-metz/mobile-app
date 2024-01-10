import { ToastPresets } from '@ddx0510/react-native-ui-lib';
import { useGlobalSearchParams, useRootNavigation, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseErrorText, useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const authLogger = log.extend(`[${__filename.split('/').pop()}]`);

const AuthContext = createContext<{
  isFetchingToken: boolean;
  ready: boolean;
}>({ isFetchingToken: false, ready: false });

export const useAppAuth = () => {
  return useContext(AuthContext);
};

// This hook will protect the route access based on user authentication.
const useProtectedRoute = (
  refreshToken: string | null,
  ready: boolean,
  setReady: (ready: boolean) => void,
) => {
  const { t } = useTranslation();
  const segments = useSegments();
  const rootNavigation = useRootNavigation();
  const router = useRouter();
  const authStore = useAuthStore();
  const hasOnboard = useSettingsStore((state) => state.hasOnboard);
  const notifyError = useErrorNotification();

  const { accessToken: queryAccessToken, refreshToken: queryRefreshToken } = useGlobalSearchParams<{
    accessToken: string;
    refreshToken: string;
  }>();

  const checkAuthorization = useCallback(async () => {
    const [firstSegment] = segments;
    const isScreenPrivate = !firstSegment || '(private)' === firstSegment;

    if (isScreenPrivate) {
      if (refreshToken) {
        if (!authStore.accessToken) {
          authLogger.debug('Refreshing access token');
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
  }, [segments, refreshToken]);

  useEffect(() => {
    if (!rootNavigation?.isReady()) return;

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

    checkAuthorization()
      .then((isAuthorized) => {
        authLogger.debug(`isAuthorized for ${segments.join('/')}: ${isAuthorized}`);
        if (!isAuthorized) {
          authLogger.debug('redirecting to login');
          return rootNavigation.reset({
            index: 0,
            routes: [{ name: '(public)/login' }],
          });
        } else if (!segments.length) {
          authLogger.debug('redirecting to home');
          return rootNavigation.reset({
            index: 0,
            routes: [{ name: '(private)/home' }],
          });
        }
      })
      .finally(() => {
        authLogger.debug('Does user has already onboard?', { hasOnboard, segments });
        if (!hasOnboard) {
          router.push('(public)/onboarding');
        }
        setReady(true);
      });
  }, [refreshToken, rootNavigation, segments, queryRefreshToken, queryAccessToken]);

  useEffect(() => {
    if (ready) {
      authLogger.debug('Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [ready]);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const { refreshToken, isFetchingToken } = useAuthStore();

  useProtectedRoute(refreshToken, ready, setReady);

  return <AuthContext.Provider value={{ isFetchingToken, ready }}>{children}</AuthContext.Provider>;
};
