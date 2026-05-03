import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { usePostHog } from 'posthog-react-native';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import LoginBottomSheet from '@/components/Settings/LoginBottomSheet';
import LogoutBottomSheet from '@/components/Settings/LogoutBottomSheet';
import { log } from '@/helpers/logger';
import { ApiUser } from '@/services/api/auth';
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
  const pathname = usePathname();
  const authStore = useAuthStore();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthStoreHydrated = useAuthStore((state) => state.hydrated);
  const isSettingsStoreHydrated = useSettingsStore((state) => state.hydrated);

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

      router.setParams({ accessToken: undefined, refreshToken: undefined });
    }

    setReady(true);
  }, [queryRefreshToken, queryAccessToken, isAuthStoreHydrated, isSettingsStoreHydrated]);

  useEffect(() => {
    if (loggedOut) {
      authStore.logout().then(() => {
        router.setParams({ loggedOut: undefined });

        authLogger.debug('Reset navigation since user just logged out');
        router.dismissAll();
        router.replace(pathname);
      });
    }
  }, [loggedOut]);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const authStore = useAuthStore();
  const router = useRouter();
  const [isLoggingIn, setLoggingIn] = useState<boolean>(false);
  const [previousUser, setPreviousUser] = useState<ApiUser | null>(null);
  const posthog = usePostHog();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const loginBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const logoutBottomSheetRef = useRef<AppBottomSheetRef>(null);

  useEffect(() => {
    if (isLoggingIn && authStore.accessToken) {
      setLoggingIn(false);

      authLogger.debug('Reset navigation since user just logged in');
      router.dismissAll();
      router.replace(pathname);
    }
  }, [authStore.accessToken, isLoggingIn]);

  useEffect(() => {
    if (ready) {
      authLogger.debug('Hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    if (previousUser?.id !== authStore.user?.id) {
      authLogger.debug('Resetting all cache since user has changed');
      Promise.all([queryClient.resetQueries(), Image.clearDiskCache(), Image.clearMemoryCache()]);
    }

    if (authStore.user) {
      const realUser = authStore.user.impersonatedBy ?? authStore.user;
      posthog.identify(realUser.email, {
        email: realUser.email,
        name: realUser.name,
      });
    }

    setPreviousUser(authStore.user);
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
        login: () => {
          setLoggingIn(true);
          loginBottomSheetRef.current?.open();
        },
        logout: () => {
          logoutBottomSheetRef.current?.open();
        },
      }}>
      {children}

      <LoginBottomSheet ref={loginBottomSheetRef} onClose={() => setLoggingIn(false)} />
      <LogoutBottomSheet ref={logoutBottomSheetRef} />
    </AuthContext.Provider>
  );
};
