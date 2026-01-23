import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { usePostHog } from 'posthog-react-native';
import { createContext, useContext, useEffect, useState } from 'react';
import LoginBottomSheet from '@/components/Settings/LoginBottomSheet';
import LogoutBottomSheet from '@/components/Settings/LogoutBottomSheet';
import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const authLogger = log.extend(`[auth.tsx]`);

const AuthContext = createContext<{
  isFetchingToken: boolean;
  ready: boolean;
  login?: () => void;
  logout?: () => void;
}>({ isFetchingToken: false, ready: false });

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

export const useAppAuth = () => {
  return useContext(AuthContext);
};

// This hook will protect the route access based on user authentication.
const useProtectedRoute = (_ready: boolean, setReady: (ready: boolean) => void) => {
  const router = useRouter();
  const authStore = useAuthStore();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthStoreHydrated = useAuthStore((state) => state.hydrated);
  const isSettingsStoreHydrated = useSettingsStore((state) => state.hydrated);
  const queryClient = useQueryClient();

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
    if (!isAuthStoreHydrated || !isSettingsStoreHydrated) return;

    if (queryRefreshToken && queryAccessToken && refreshToken !== queryRefreshToken) {
      authLogger.debug('Setting tokens from query params', {
        queryRefreshToken,
        queryAccessToken,
      });
      authStore.setTokens(queryAccessToken, queryRefreshToken);

      // should reset all queries in cache
      Promise.all([queryClient.clear(), Image.clearDiskCache(), Image.clearMemoryCache()]);

      router.setParams({ accessToken: undefined, refreshToken: undefined });
    }

    setReady(true);
  }, [queryRefreshToken, queryAccessToken, isAuthStoreHydrated, isSettingsStoreHydrated]);

  useEffect(() => {
    if (loggedOut) {
      authStore.logout().then(() => {
        router.setParams({ loggedOut: undefined });
        queryClient.clear();
      });
    }
  }, [loggedOut]);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const authStore = useAuthStore();
  const [isLoggingIn, setLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setLoggingOut] = useState<boolean>(false);
  const posthog = usePostHog();
  const pathname = usePathname();

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

  useEffect(() => {
    posthog.screen(pathname);
  }, [pathname]);

  useProtectedRoute(ready, setReady);

  return (
    <AuthContext.Provider
      value={{
        isFetchingToken: authStore.isFetchingToken,
        ready,
        login: () => setLoggingIn(true),
        logout: () => setLoggingOut(true),
      }}>
      {children}

      {isLoggingIn && <LoginBottomSheet onClose={() => setLoggingIn(false)} />}
      {isLoggingOut && <LogoutBottomSheet onClose={() => setLoggingOut(false)} />}
    </AuthContext.Provider>
  );
};
