import { HTTP } from '../http';

export const unlockSteelGate = (): Promise<{
  triggered: string;
  locked: string;
  timeout: string;
}> => {
  return HTTP.post('/api/interphone').then(({ data }) => data);
};

export const openParkingGate = (): Promise<{
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

export const getOnPremiseState = (): Promise<OnPremiseState> => {
  return HTTP.get('/api/on-premise').then(({ data }) => data);
};

export type PhoneBoothDailyOccupation = {
  weekDayIndex: number;
  averageMinutesByUTCHour: {
    [key: string]: number;
  };
};

export const getPhoneBoothsOccupation = (): Promise<{
  blue: {
    occupation: PhoneBoothDailyOccupation[];
  };
  orange: {
    occupation: PhoneBoothDailyOccupation[];
  };
}> => {
  return HTTP.get('/api/on-premise/phone-booths/occupation').then(({ data }) => data);
};

export const unlockDeckDoor = (): Promise<{
  triggered: string;
  locked: string;
  timeout: string;
}> => {
  return HTTP.post('/api/on-premise/deck-door/unlock').then(({ data }) => data);
};

export const getPoulaillerKeyBoxCode = (): Promise<{ code: number }> => {
  return HTTP.get('/api/on-premise/key-box/code/poulailler').then(({ data }) => data);
};

export const getPtiPoulaillerKeyBoxCode = (): Promise<{ code: number }> => {
  return HTTP.get('/api/on-premise/key-box/code/pti-poulailler').then(({ data }) => data);
};

export const getDeckKeyBoxCode = (): Promise<{ code: number }> => {
  return HTTP.get('/api/on-premise/key-box/code/deck').then(({ data }) => data);
};

export const turnOnLight = (
  lightId: string | number,
): Promise<{
  state: 'on';
  updated: string;
}> => {
  return HTTP.post(`https://mock.matthieupetit.dev/api/mobile/v1/lights/${lightId}/on`).then(
    ({ data }) => data,
  );
};

export const turnOffLight = (
  lightId: string | number,
): Promise<{
  state: 'off';
  updated: string;
}> => {
  return HTTP.post(`https://mock.matthieupetit.dev/api/mobile/v1/lights/${lightId}/off`).then(
    ({ data }) => data,
  );
};

export const turnOnFan = (
  fanId: string | number,
): Promise<{
  state: 'on';
  updated: string;
}> => {
  return HTTP.post(`https://mock.matthieupetit.dev/api/mobile/v1/fans/${fanId}/on`).then(
    ({ data }) => data,
  );
};

export const turnOffFan = (
  fanId: string | number,
): Promise<{
  state: 'off';
  updated: string;
}> => {
  return HTTP.post(`https://mock.matthieupetit.dev/api/mobile/v1/fans/${fanId}/off`).then(
    ({ data }) => data,
  );
};
