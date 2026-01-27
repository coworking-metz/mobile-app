import axios from 'axios';
import { PROBE_BASE_URL } from '@/services/environment';

export interface ProbeDevice {
  ip: string;
  macAddress: string;
  vendor?: string | 'Unknown';
  name?: string;
}

export const isDeviceInfoAvailable = (): Promise<void> => {
  return axios.options(`/info`, {
    baseURL: PROBE_BASE_URL,
    timeout: 1_000,
  });
};

export const getDeviceInfo = async (): Promise<{ device?: ProbeDevice }> => {
  return axios
    .get(`/info`, {
      baseURL: PROBE_BASE_URL,
      timeout: 10_000,
    })
    .then(({ data }) => data);
};
