import { HTTP } from '../http';
import dayjs from 'dayjs';

export interface ApiMemberSubscription {
  aboEnd: string;
  aboStart: string;
  current: boolean;
  purchaseDate: string;
}

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
  membershipOk?: boolean;
  lastMembership?: number;
  abos: ApiMemberSubscription[];
  attending: boolean;
}

export const getCurrentMembers = (): Promise<ApiMemberProfile[]> => {
  return HTTP.get('/api/current-members').then(({ data }) =>
    data.sort((a: ApiMemberProfile, b: ApiMemberProfile) => dayjs(a.lastSeen).diff(b.lastSeen)),
  );
};

export const getMemberProfile = (memberId: string | number): Promise<ApiMemberProfile> => {
  return HTTP.get(`/api/members/${memberId}`).then(({ data }) => data);
};

export type AttendanceType = 'subscription' | 'ticket';

export type ApiMemberActivity = {
  date: string;
  value: number;
  type: AttendanceType;
};

export const getMemberActivity = (memberId: string | number): Promise<ApiMemberActivity[]> => {
  return HTTP.get(`/api/members/${memberId}/activity`).then(
    ({ data }) => [...data].sort((a, b) => dayjs(a.date).diff(b.date)), // sort by date
  );
};

export interface ApiMemberSubscription {
  _id: string;
  started: string;
  ended: string;
  purchased: string;
  amount: number;
}

export const getMemberSubscriptions = (memberId: string): Promise<ApiMemberSubscription[]> => {
  return HTTP.get(`/api/members/${memberId}/subscriptions`).then(({ data }) => data);
};

export interface ApiMemberTicket {
  _id: string;
  purchased: string;
  amount: number;
  currency: 'EUR';
  count: number;
}

export const getMemberTickets = (memberId: string): Promise<ApiMemberTicket[]> => {
  return HTTP.get(`/api/members/${memberId}/tickets`).then(({ data }) => data);
};

const WORDPRESS_BASE_URL =
  process.env.EXPO_PUBLIC_WORDPRESS_BASE_URL || 'https://coworking-metz.fr/';

export const buildMemberPictureUrl = (wordpressUserId: number) => {
  return `${WORDPRESS_BASE_URL}/polaroid/${wordpressUserId}-raw-small.jpg`;
};
