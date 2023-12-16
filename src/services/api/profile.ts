import { HTTP } from '../http';

export type ApiUserProfile = {
  id: number;
  picture: string;
  email: string;
  firstname: string;
  lastname: string;
  balance: number;
  subscription: {
    startDate: string;
    endDate: string;
    purchased: string;
  } | null;
};

export const getUserProfile = (): Promise<ApiUserProfile> => {
  return HTTP.get('/mobile/v1/profile').then(({ data }) => data);
};

export type ApiUserPresenceTimelineItem = {
  date: string;
  amount: number;
  type: 'SUBSCRIPTION' | 'BALANCE';
};

export const getUserPresence = (): Promise<{
  timeline: ApiUserPresenceTimelineItem[];
}> => {
  return HTTP.get('/mobile/v1/profile/presence').then(({ data }) => data);
};
