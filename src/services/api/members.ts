import { HTTP } from '../http';

export interface ApiMemberProfile {
  _id: string;
  wpUserId: number;
  picture?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdate?: string;
  created: string;
  lastSeen?: string;
  activity: number;
  activeUser: boolean;
  balance: number;
  membershipOk: boolean;
  lastMembership: number;
  abos: {
    aboEnd: string;
    aboStart: string;
    current: boolean;
    purchaseDate: string;
  }[];
}

export const getCurrentMembers = (): Promise<ApiMemberProfile[]> => {
  return HTTP.get('/current-members').then(({ data }) => data);
};

export const getMemberProfile = (memberId: string | number): Promise<ApiMemberProfile> => {
  return HTTP.get(`/members/${memberId}`).then(({ data }) => data);
};

export type AttendanceType = 'subscription' | 'ticket';

export type ApiMemberActivity = {
  date: string;
  value: number;
  type: AttendanceType;
};

export const getMemberActivity = (memberId: string | number): Promise<ApiMemberActivity[]> => {
  return HTTP.get(`/members/${memberId}/activity`).then(({ data }) => data);
};

export interface ApiMemberSubscription {
  _id: string;
  started: string;
  ended: string;
  purchased: string;
  amount: number;
}

export const getMemberSubscriptions = (memberId: string): Promise<ApiMemberSubscription[]> => {
  return HTTP.get(`/members/${memberId}/subscriptions`).then(({ data }) => data);
};

export interface ApiMemberTicket {
  _id: string;
  purchased: string;
  amount: number;
  currency: 'EUR';
  count: number;
}

export const getMemberTickets = (memberId: string): Promise<ApiMemberTicket[]> => {
  return HTTP.get(`/members/${memberId}/tickets`).then(({ data }) => data);
};
