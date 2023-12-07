import { HTTP } from '../http';

export const unlockSteelGate = (): Promise<{
  triggered: string;
  locked: string;
  timeout: string;
}> => {
  return HTTP.post('/intercom').then(({ data }) => data);
};

export const openParkingGate = (): Promise<{
  triggered: string;
  open: string;
  timeout: string;
}> => {
  return HTTP.post('/parking').then(({ data }) => data);
};

export const unlockOpenSpaceDoor = (): Promise<{
  triggered: string;
  locked: string;
  timeout: string;
}> => {
  return HTTP.post('/open-space/door').then(({ data }) => data);
};
