import { HTTP } from '../http';
import dayjs from 'dayjs';

export interface ApiMemberProfileSubscription {
  aboEnd: string;
  aboStart: string;
  current: boolean;
  purchaseDate: string;
}

export interface ApiMemberProfile {
  _id: string;
  wpUserId: number;
  picture?: string;
  thumbnail?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdate?: string;
  created: string;
  lastSeen?: string;
  totalActivity: number;
  activity: number; // in the last 6 months
  activeUser: boolean; // whether member has earned at least 20 days of activity in the last 6 months
  trustedUser: boolean; // whether member has earned at least 10 days of activity
  balance: number;
  membershipOk?: boolean;
  lastMembership?: number;
  abos: ApiMemberProfileSubscription[] /* deprecated */;
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
  orderReference?: string;
  current: boolean;
}

export const getMemberSubscriptions = (memberId: string): Promise<ApiMemberSubscription[]> => {
  return HTTP.get(`/api/members/${memberId}/subscriptions`).then(
    ({ data }: { data: Omit<ApiMemberSubscription, 'current'>[] }) => {
      const sortedSubscriptions = data.sort((a, b) => dayjs(b.started).diff(a.started));
      return sortedSubscriptions.map((s) => ({
        ...s,
        current: dayjs().isBetween(s.started, s.ended),
      }));
    },
  );
};

export interface ApiMemberTicket {
  _id: string;
  purchased: string;
  amount: number;
  count: number;
  orderReference?: string;
}

export const getMemberTickets = (memberId: string): Promise<ApiMemberTicket[]> => {
  return HTTP.get(`/api/members/${memberId}/tickets`).then(({ data }) => data);
};

// https://vincent-van-git.netlify.app/
/* eslint-disable prettier/prettier */
const HELLO_ACTIVITY_MATRIX = [
  1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, // h
  0, 0, 0, 0, 0, 0, 0, // blank line
  0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, // e
  0, 0, 0, 0, 0, 0, 0, // blank line
  1, 1, 1, 1, 1, 1, 1, // l
  0, 0, 0, 0, 0, 0, 0, // blank line
  1, 1, 1, 1, 1, 1, 1, // l
  0, 0, 0, 0, 0, 0, 0, // blank line
  0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, // o
];
/* eslint-enable prettier/prettier */
const helloStartDate = dayjs()
  .subtract(1, 'week')
  .endOf('week')
  .subtract(HELLO_ACTIVITY_MATRIX.length, 'day');

export const getHelloActivity = () =>
  HELLO_ACTIVITY_MATRIX.map(
    (value, index) =>
      ({
        date: helloStartDate.add(index, 'days').format('YYYY-MM-DD'),
        value: value ? (Math.random() > 0.5 ? 1 : 0.5) : 0,
        type: Math.random() > 0.5 ? 'subscription' : 'ticket',
      }) as ApiMemberActivity,
  );
