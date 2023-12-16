import { HTTP } from '../http';

export const unlockSteelGate = (): Promise<{
  triggered: string;
  locked: string;
  timeout: string;
}> => {
  return HTTP.post('/mobile/v1/intercom').then(({ data }) => data);
};

export const openParkingGate = (): Promise<{
  triggered: string;
  open: string;
  timeout: string;
}> => {
  return HTTP.post('/mobile/v1/parking').then(({ data }) => data);
};

export const unlockDeckDoor = (): Promise<{
  triggered: string;
  locked: string;
  timeout: string;
}> => {
  return HTTP.post('/mobile/v1/open-space/door').then(({ data }) => data);
};
