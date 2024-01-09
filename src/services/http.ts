import { version as appVersion } from '../../package.json';
import axios from 'axios';

const httpInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: Number.parseInt(process.env.EXPO_PUBLIC_TIMEOUT_IN_MS || '0', 10) || 10000,
  headers: {
    'X-App-Version': appVersion,
  },
  withCredentials: true,
});

export const HTTP = httpInstance;
