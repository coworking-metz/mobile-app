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
  return HTTP.post('/mobile/v1/doors/deck/unlock').then(({ data }) => data);
};

export const turnOnLight = (
  lightId: string | number,
): Promise<{
  state: 'on';
  updated: string;
}> => {
  return HTTP.post(`/mobile/v1/lights/${lightId}/on`).then(({ data }) => data);
};

export const turnOffLight = (
  lightId: string | number,
): Promise<{
  state: 'off';
  updated: string;
}> => {
  return HTTP.post(`/mobile/v1/lights/${lightId}/off`).then(({ data }) => data);
};

export const turnOnFan = (
  fanId: string | number,
): Promise<{
  state: 'on';
  updated: string;
}> => {
  return HTTP.post(`/mobile/v1/fans/${fanId}/on`).then(({ data }) => data);
};

export const turnOffFan = (
  fanId: string | number,
): Promise<{
  state: 'off';
  updated: string;
}> => {
  return HTTP.post(`/mobile/v1/fans/${fanId}/off`).then(({ data }) => data);
};
