import { useQueryClient } from '@tanstack/react-query';
import { useGlobalSearchParams, useNavigationContainerRef, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { usePostHog } from 'posthog-react-native';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoginBottomSheet from '@/components/Settings/LoginBottomSheet';
import { useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';
import useResetNavigation from '@/helpers/navigation';
import { IS_DEV } from '@/services/environment';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const authLogger = log.extend(`[auth.tsx]`);

const AuthContext = createContext<{
  isFetchingToken: boolean;
  ready: boolean;
  login?: () => void;
}>({ isFetchingToken: false, ready: false });

SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export const useAppAuth = () => {
  return useContext(AuthContext);
};

// This hook will protect the route access based on user authentication.
const useProtectedRoute = (ready: boolean, setReady: (ready: boolean) => void) => {
  const rootNavigation = useNavigationContainerRef();
  const router = useRouter();
  const resetNavigation = useResetNavigation();

  const { t } = useTranslation();
  const authStore = useAuthStore();
  const toastStore = useToastStore();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthStoreHydrated = useAuthStore((state) => state.hydrated);
  const isSettingsStoreHydrated = useSettingsStore((state) => state.hydrated);
  const queryClient = useQueryClient();
  const notifyError = useErrorNotification();

  const {
    accessToken: queryAccessToken,
    refreshToken: queryRefreshToken,
    loggedOut,
  } = useGlobalSearchParams<{
    accessToken: string;
    refreshToken: string;
    loggedOut: string;
  }>();

  useEffect(() => {
    if (!rootNavigation?.isReady()) return;
    if (!isAuthStoreHydrated || !isSettingsStoreHydrated) return;

    if (queryRefreshToken && queryAccessToken && refreshToken !== queryRefreshToken) {
      authLogger.debug('Setting tokens from query params', {
        queryRefreshToken,
        queryAccessToken,
      });
      authStore.setTokens(queryAccessToken, queryRefreshToken);

      // should reset all queries in cache
      queryClient.invalidateQueries();

      router.setParams({ accessToken: '', refreshToken: '' });
      // setting a new refreshToken will re-trigger the useEffect
      return;
    }

    setReady(true);
  }, [
    rootNavigation,
    queryRefreshToken,
    queryAccessToken,
    isAuthStoreHydrated,
    isSettingsStoreHydrated,
    refreshToken,
  ]);

  const onLoggedOut = useCallback(async () => {
    return authStore
      .logout()
      .then(() =>
        toastStore.add({
          message: t('auth.logout.onSuccess.message'),
          type: 'success',
          timeout: 3000,
        }),
      )
      .then(() => {
        // navigate to first screen
        resetNavigation('/home');
      })
      .catch((error) => {
        notifyError(t('errors.default.message'), error);
      });
  }, [authStore, toastStore, t]);

  useEffect(() => {
    if (loggedOut) {
      onLoggedOut();
    }
  }, [loggedOut]);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const authStore = useAuthStore();
  const [isLoggingIn, setLoggingIn] = useState<boolean>(false);
  const posthog = usePostHog();

  useEffect(() => {
    if (isLoggingIn && authStore.accessToken) {
      setLoggingIn(false);
    }
  }, [authStore.accessToken, isLoggingIn]);

  useEffect(() => {
    if (ready) {
      authLogger.debug('Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    if (authStore.user) {
      posthog.identify(authStore.user.email, {
        email: authStore.user.email,
        name: authStore.user.name,
      });
    }
  }, [authStore.user]);

  useProtectedRoute(ready, setReady);

  return (
    <AuthContext.Provider
      value={{
        isFetchingToken: authStore.isFetchingToken,
        ready,
        login: () => setLoggingIn(true),
      }}>
      {children}

      {isLoggingIn && <LoginBottomSheet onClose={() => setLoggingIn(false)} />}
    </AuthContext.Provider>
  );
};
