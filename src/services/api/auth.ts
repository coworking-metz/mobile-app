import { HTTP } from '../http';
import { Buffer } from 'buffer';

interface ApiTokens {
  accessToken: string;
  refreshToken: string;
}

export type ApiUser = {
  name: string;
  email: string;
  roles: string[];
};

export const getAccessAndRefreshTokens = (refreshToken: string): Promise<ApiTokens> => {
  return HTTP.post('/auth/tokens', { refreshToken }).then(({ data }) => data);
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
