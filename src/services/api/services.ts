import { HTTP } from '@/services/http';

export const unlockSteelGate = async (): Promise<{
  triggered: string;
  locked: string;
  timeout: string;
}> => {
  return HTTP.post('/api/interphone').then(({ data }) => data);
};

export const openParkingGate = async (): Promise<{
  triggered: string;
  closed: string;
  timeout: string;
}> => {
  return HTTP.post('/api/parking').then(({ data }) => data);
};

export const CARBON_DIOXIDE_RANGES = [400, 800, 1200, 1600];

export type OnPremiseFlexDesk = {
  occupied?: boolean;
};

export type OnPremiseAirConditioner = {
  active: boolean;
};

export type OnPremiseState = {
  deckDoor: {
    unlocked: boolean;
  };
  phoneBooths: {
    blue: {
      occupied: boolean;
    };
    orange: {
      occupied: boolean;
    };
  };
  airConditioners: {
    north: OnPremiseAirConditioner;
    south: OnPremiseAirConditioner;
  };
  flexDesks: {
    a: OnPremiseFlexDesk;
    b: OnPremiseFlexDesk;
  };
  sensors: {
    carbonDioxide: {
      level: number;
    };
    humidity: {
      level: number;
      ptiPoulaillerLevel: number;
    };
    noise: {
      level: number;
    };
    pressure: {
      level: number;
    };
    temperature: {
      level: number;
      ptiPoulaillerLevel: number;
    };
  };
};

export const getOnPremiseState = async (): Promise<OnPremiseState> => {
  return HTTP.get('/api/on-premise').then(({ data }) => data);
};

export type PhoneBoothDailyOccupation = {
  weekDayIndex: number;
  averageMinutesByUTCHour: {
    [key: string]: number;
  };
};

export const getPhoneBoothsOccupation = async (): Promise<{
  blue: {
    occupation: PhoneBoothDailyOccupation[];
  };
  orange: {
    occupation: PhoneBoothDailyOccupation[];
  };
}> => {
  return HTTP.get('/api/on-premise/phone-booths/occupation').then(({ data }) => data);
};

export const unlockDeckDoor = async (): Promise<{
  triggered: string;
  locked: string;
  timeout: string;
}> => {
  return HTTP.post('/api/on-premise/deck-door/unlock').then(({ data }) => data);
};

export const getPoulaillerKeyBoxCode = async (): Promise<{ code: number }> => {
  return HTTP.get('/api/on-premise/key-box/poulailler/code').then(({ data }) => data);
};

export const getPtiPoulaillerKeyBoxCode = async (): Promise<{ code: number }> => {
  return HTTP.get('/api/on-premise/key-box/pti-poulailler/code').then(({ data }) => data);
};

export const getDeckKeyBoxCode = async (): Promise<{ code: number }> => {
  return HTTP.get('/api/on-premise/key-box/deck/code').then(({ data }) => data);
};

export const getStorageKeyBoxCode = async (): Promise<{ code: number }> => {
  return HTTP.get('/api/on-premise/key-box/storage/code').then(({ data }) => data);
};

export const getHubKeyBoxCode = async (): Promise<{ code: number }> => {
  return HTTP.get('/api/on-premise/key-box/hub/code').then(({ data }) => data);
};

export const getWifiCredentials = async (): Promise<{ password: string; ssid: string }> => {
  return HTTP.get('/api/on-premise/wifi/credentials').then(({ data }) => data);
};

export const turnOnLight = async (
  lightId: string | number,
): Promise<{
  state: 'on';
  updated: string;
}> => {
  return HTTP.post(`https://mock.matthieupetit.dev/api/mobile/v1/lights/${lightId}/on`).then(
    ({ data }) => data,
  );
};

export const turnOffLight = async (
  lightId: string | number,
): Promise<{
  state: 'off';
  updated: string;
}> => {
  return HTTP.post(`https://mock.matthieupetit.dev/api/mobile/v1/lights/${lightId}/off`).then(
    ({ data }) => data,
  );
};

export const turnOnFan = async (
  fanId: string | number,
): Promise<{
  state: 'on';
  updated: string;
}> => {
  return HTTP.post(`https://mock.matthieupetit.dev/api/mobile/v1/fans/${fanId}/on`).then(
    ({ data }) => data,
  );
};

export const turnOffFan = async (
  fanId: string | number,
): Promise<{
  state: 'off';
  updated: string;
}> => {
  return HTTP.post(`https://mock.matthieupetit.dev/api/mobile/v1/fans/${fanId}/off`).then(
    ({ data }) => data,
  );
};
