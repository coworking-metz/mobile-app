import { HTTP } from '../http';
import { Buffer } from 'buffer';

interface ApiTokens {
  accessToken: string;
  refreshToken: string;
}

export type ApiUserRole = 'admin' | 'coworker' | 'guest' | 'external';
export type ApiUserCapability = 'UNLOCK_GATE' | 'PARKING_ACCESS';

export type ApiUser = {
  id?: string;
  wpUserId: number;
  name: string;
  email: string;
  roles: ApiUserRole[];
  picture?: string;
  capabilities: ApiUserCapability[];
};

export const getAccessAndRefreshTokens = (refreshToken: string): Promise<ApiTokens> => {
  return HTTP.post('/api/auth/tokens', { refreshToken }).then(({ data }) => data);
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
