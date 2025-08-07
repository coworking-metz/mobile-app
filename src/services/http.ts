import axios from 'axios';
import { API_BASE_URL, APP_NAME, APP_VERSION } from '@/services/environment';

export const HTTP = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number.parseInt(process.env.EXPO_PUBLIC_TIMEOUT_IN_MS || '0', 10) || 10_000,
  headers: {
    'X-APP-NAME': APP_NAME,
    'X-APP-VERSION': APP_VERSION,
  },
});
