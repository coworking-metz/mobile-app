import { useQueryClient } from '@tanstack/react-query';
import { useGlobalSearchParams, useNavigationContainerRef, useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import LoginBottomSheet from '@/components/Settings/LoginBottomSheet';
import SplashscreenWrapper from '@/components/SplashscreenWrapper';
import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const authLogger = log.extend(`[auth.tsx]`);

const AuthContext = createContext<{
  isFetchingToken: boolean;
  ready: boolean;
  login?: () => void;
}>({ isFetchingToken: false, ready: false });

export const useAppAuth = () => {
  return useContext(AuthContext);
};

// This hook will protect the route access based on user authentication.
const useProtectedRoute = (ready: boolean, setReady: (ready: boolean) => void) => {
  const rootNavigation = useNavigationContainerRef();
  const router = useRouter();

  const authStore = useAuthStore();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthStoreHydrated = useAuthStore((state) => state.hydrated);
  const isSettingsStoreHydrated = useSettingsStore((state) => state.hydrated);
  const queryClient = useQueryClient();

  const { accessToken: queryAccessToken, refreshToken: queryRefreshToken } = useGlobalSearchParams<{
    accessToken: string;
    refreshToken: string;
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
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const authStore = useAuthStore();
  const [isLoggingIn, setLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggingIn && authStore.accessToken) {
      setLoggingIn(false);
    }
  }, [authStore.accessToken, isLoggingIn]);

  useProtectedRoute(ready, setReady);

  return (
    <AuthContext.Provider
      value={{
        isFetchingToken: authStore.isFetchingToken,
        ready,
        login: () => setLoggingIn(true),
      }}>
      <SplashscreenWrapper ready={ready}>{children}</SplashscreenWrapper>

      {isLoggingIn && <LoginBottomSheet onClose={() => setLoggingIn(false)} />}
    </AuthContext.Provider>
  );
};
