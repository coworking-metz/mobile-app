import { version as appVersion } from '../../../package.json';
import axios from 'axios';
import { Buffer } from 'buffer';
import useSettingsStore from '@/stores/settings';

interface ApiTokens {
  accessToken: string;
  refreshToken: string;
}

export type ApiUserRole = 'admin' | 'coworker' | 'guest' | 'external';
export type ApiUserCapability = 'UNLOCK_GATE' | 'PARKING_ACCESS' | 'UNLOCK_DECK_DOOR';

export type ApiUser = {
  id?: string;
  wpUserId: number;
  name: string;
  email: string;
  roles: ApiUserRole[];
  picture?: string;
  capabilities: ApiUserCapability[];
  iat: number;
  exp: number;
};

export const getAccessAndRefreshTokens = (refreshToken: string): Promise<ApiTokens> => {
  const apiBaseUrl = useSettingsStore.getState().apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;
  // refreshing tokens should have its own axios config
  // and should not be cancelled
  return axios
    .post(
      '/api/auth/tokens',
      { refreshToken },
      {
        baseURL: apiBaseUrl,
        timeout: 30_000,
        headers: {
          'X-APP-NAME': 'COWORKING_MOBILE',
          'X-APP-VERSION': appVersion,
        },
      },
    )
    .then(({ data }) => data);
};

/**
 * Retrieve payload from a JWT token.
 */
export const decodeToken = (token: string): ApiUser => {
  const parts = token
    .split('.')
    .map((part) => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
  const [_, jsonPayload] = parts;
  const payload = JSON.parse(jsonPayload);
  return payload;
};
