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

export const getOnPremiseState = (): Promise<{
  phoneBooths: {
    blue: {
      occupied: boolean;
    };
    orange: {
      occupied: boolean;
    };
  };
}> => {
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
  return HTTP.post('https://mock.matthieupetit.dev/api/mobile/v1/doors/deck/unlock').then(
    ({ data }) => data,
  );
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
