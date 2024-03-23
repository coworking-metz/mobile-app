import { version as appVersion } from '../../package.json';
import axios from 'axios';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://tickets.coworking-metz.fr/';

export const HTTP = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number.parseInt(process.env.EXPO_PUBLIC_TIMEOUT_IN_MS || '0', 10) || 10_000,
  headers: {
    'X-APP-NAME': 'COWORKING_MOBILE',
    'X-APP-VERSION': appVersion,
  },
});
