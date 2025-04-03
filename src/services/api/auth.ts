import { version as appVersion } from '../../../package.json';
import { API_BASE_URL } from '../environment';
import axios from 'axios';
import { Buffer } from 'buffer';
import { log } from '@/helpers/logger';
import useSettingsStore from '@/stores/settings';

interface ApiTokens {
  accessToken: string;
  refreshToken: string;
}

export type ApiUserRole = 'admin' | 'coworker' | 'guest' | 'external';
export type ApiUserCapability =
  | 'UNLOCK_GATE'
  | 'PARKING_ACCESS'
  | 'UNLOCK_DECK_DOOR'
  | 'KEYS_ACCESS';

export type ApiUser = {
  id?: string;
  wpUserId: number;
  name: string;
  email: string;
  roles: ApiUserRole[];
  picture?: string;
  capabilities: ApiUserCapability[];
  onboarding?: {
    date: string;
  };
  iat: number;
  exp: number;
};

const authLogger = log.extend(`[auth]`);

export const getAccessAndRefreshTokens = (refreshToken: string): Promise<ApiTokens> => {
  const apiBaseUrl = useSettingsStore.getState().apiBaseUrl || API_BASE_URL;
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
export const decodeToken = (token: string): ApiUser | null => {
  const parts = token
    .split('.')
    .map((part) => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
  const [_, jsonPayload] = parts;
  try {
    const payload = JSON.parse(jsonPayload);
    return payload;
  } catch (error) {
    authLogger.warn('Failed to decode JWT token', error);
    return null;
  }
};
