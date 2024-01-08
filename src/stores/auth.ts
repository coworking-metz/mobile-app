import createSecureStorage from './SecureStorage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  setTokens: (accessToken: string | null, refreshToken: string | null) => Promise<void>;
  logout: () => Promise<void>;
  clear: () => Promise<void>;
}

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
          set({ isFetchingToken: true });
          refreshTokenPromise = getAccessAndRefreshTokens(get().refreshToken as string)
            .then(async ({ accessToken, refreshToken }) => {
              const user = accessToken ? decodeToken(accessToken) : null;
              await set({ user, accessToken, refreshToken });
            })
            .finally(() => {
              set({ isFetchingToken: false });
              refreshTokenPromise = null;
            });
        }
        return refreshTokenPromise;
      },
      logout: async (): Promise<void> => {
        await set({ user: null, accessToken: null, refreshToken: null });
      },
      clear: async (): Promise<void> => {
        await set({
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
