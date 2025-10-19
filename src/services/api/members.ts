import { HTTP } from '../http';
import dayjs from 'dayjs';

export type ApiLocation = 'poulailler' | 'pti-poulailler' | 'racine' | 'cantina';

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
  polaroid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  created: string;
  lastSeen?: string;
  location?: ApiLocation;
  totalActivity: number;
  activity: number; // in the last 6 months
  activeUser: boolean; // whether member has earned at least 20 days of activity in the last 6 months
  trustedUser: boolean; // whether member has earned at least 10 days of activity
  balance: number;
  membershipOk?: boolean;
  lastMembership?: number;
  abos: ApiMemberProfileSubscription[] /* deprecated */;
  attending: boolean;
  hasActiveSubscription: boolean;
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
  activityCount: number; // days attended
  attendanceCount: number; // number of attendances
  savingsOverTickets: number; // amount saved over buying tickets
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
const helloStartDate = dayjs().day(0).subtract(HELLO_ACTIVITY_MATRIX.length, 'day');

export const getHelloActivity = () =>
  HELLO_ACTIVITY_MATRIX.map(
    (value, index) =>
      ({
        date: helloStartDate.add(index - 1, 'days').format('YYYY-MM-DD'),
        value: value ? (Math.random() > 0.5 ? 1 : 0.5) : 0,
        type: Math.random() > 0.5 ? 'subscription' : 'ticket',
      }) as ApiMemberActivity,
  );

export const isMembershipNonCompliant = (member: ApiMemberProfile) => {
  return Boolean(
    member.membershipOk === false &&
      member.lastSeen &&
      dayjs(member.lastSeen).isSame(dayjs(), 'year') &&
      (!member.lastMembership ||
        dayjs(member.lastSeen).isAfter(dayjs().year(member.lastMembership).endOf('year'), 'year')),
  );
};

export const isMemberBalanceInsufficient = (member: ApiMemberProfile) => {
  const isAttendingWithoutSufficientBalance =
    member.attending && member.balance === 0 && member.hasActiveSubscription === false;
  return member.balance < 0 || isAttendingWithoutSufficientBalance;
};

export enum DeviceType {
  COMPUTER = 'COMPUTER',
  MOBILE = 'MOBILE',
  WEARABLE = 'WEARABLE',
  UNKNOWN = 'UNKNOWN',
}

export interface ApiMemberDevice {
  _id: string;
  name?: string;
  macAddress: string;
  location?: ApiLocation;
  heartbeat?: string;
  attending?: boolean;
  type?: DeviceType;
}

export const getMemberDevices = (memberId: string): Promise<ApiMemberDevice[]> => {
  return HTTP.get(`/api/members/${memberId}/devices`).then(({ data }) => data);
};

export const getMemberDevice = (memberId: string, deviceId: string): Promise<ApiMemberDevice> => {
  return HTTP.get(`/api/members/${memberId}/devices/${deviceId}`).then(({ data }) => data);
};

export const updateMemberDevicesMacAddresses = (
  memberId: string,
  macAddresses: string[],
): Promise<string[]> => {
  return HTTP.put(`/api/members/${memberId}/mac-addresses`, macAddresses).then(({ data }) => data);
};

export const addMemberDevice = (
  memberId: string,
  device: Omit<ApiMemberDevice, '_id'>,
): Promise<ApiMemberDevice> => {
  return HTTP.post(`/api/members/${memberId}/devices`, device).then(({ data }) => data);
};

export const updateMemberDevice = (
  memberId: string,
  deviceId: string,
  device: ApiMemberDevice,
): Promise<ApiMemberDevice> => {
  return HTTP.put(`/api/members/${memberId}/devices/${deviceId}`, device).then(({ data }) => data);
};

export const deleteMemberDevice = (memberId: string, deviceId: string): Promise<void> => {
  return HTTP.delete(`/api/members/${memberId}/devices/${deviceId}`).then(({ data }) => data);
};

export const getMemberStats = (
  memberId: string,
): Promise<{ totalVisits: number; totalBookings: number; totalSpent: number }> => {
  return HTTP.get(`/member/stats`, { params: { userId: memberId } }).then(({ data }) => data);
};

export const getMemberStatsDetailed = (
  memberId: string | number,
): Promise<{
  activity: ApiMemberActivity[];
  subscriptions: ApiMemberSubscription[];
}> => {
  return Promise.all([
    getMemberActivity(String(memberId)),
    getMemberSubscriptions(String(memberId)),
  ]).then(([activity, subscriptions]) => ({ activity, subscriptions }));
};

export const getMemberPresenceStats = (
  memberId: string,
): Promise<{
  averagePresence: { daily: number; weekly: number; monthly: number };
  presenceByMonth: { [month: string]: number };
  presenceByYear: { [year: string]: number };
  newMembersMet: number;
  newMembersByMonth: { [month: string]: number };
  eventsAttended: number;
  eventsByMonth: { [month: string]: number };
  favoriteDay: string;
  averageArrivalTime: string;
  communityContribution: number;
  contributionByType: { [type: string]: number };
  recommendations: string[];
}> => {
  return getMemberActivity(memberId).then((activity) => {
    const presenceByDate = activity.reduce(
      (acc, curr) => {
        const date = dayjs(curr.date);
        const year = date.format('YYYY');
        const month = date.format('YYYY-MM');
        const day = date.format('dddd');

        acc.daily += curr.value;
        acc.weekly += curr.value / 7;
        acc.monthly += curr.value / 30;

        acc.presenceByMonth[month] = (acc.presenceByMonth[month] || 0) + curr.value;
        acc.presenceByYear[year] = (acc.presenceByYear[year] || 0) + curr.value;
        acc.days[day] = (acc.days[day] || 0) + curr.value;

        return acc;
      },
      {
        daily: 0,
        weekly: 0,
        monthly: 0,
        presenceByMonth: {} as { [month: string]: number },
        presenceByYear: {} as { [year: string]: number },
        days: {} as { [day: string]: number },
      },
    );

    const favoriteDay = Object.entries(presenceByDate.days).reduce((a, b) =>
      a[1] > b[1] ? a : b,
    )[0];

    return {
      averagePresence: {
        daily: presenceByDate.daily,
        weekly: presenceByDate.weekly,
        monthly: presenceByDate.monthly,
      },
      presenceByMonth: presenceByDate.presenceByMonth,
      presenceByYear: presenceByDate.presenceByYear,
      newMembersMet: 5, // Mocked value
      newMembersByMonth: { '2023-01': 2, '2023-02': 3 }, // Mocked value
      eventsAttended: 10, // Mocked value
      eventsByMonth: { '2023-01': 4, '2023-02': 6 }, // Mocked value
      favoriteDay,
      averageArrivalTime: '09:30 AM', // Mocked value
      communityContribution: 50, // Mocked value
      contributionByType: { mentoring: 20, organizing: 30 }, // Mocked value
      recommendations: ['Try coworking on Fridays!', 'Join the next hackathon!'], // Mocked value
    };
  });
};

export const getMemberTrends = (
  memberId: string,
): Promise<{
  weeklyTrend: number;
  monthlyTrend: number;
}> => {
  return getMemberActivity(memberId).then((activity) => {
    const now = dayjs();
    const lastWeek = now.subtract(1, 'week');
    const lastMonth = now.subtract(1, 'month');

    const weeklyTrend = activity
      .filter((a) => dayjs(a.date).isAfter(lastWeek))
      .reduce((sum, a) => sum + a.value, 0);

    const monthlyTrend = activity
      .filter((a) => dayjs(a.date).isAfter(lastMonth))
      .reduce((sum, a) => sum + a.value, 0);

    return { weeklyTrend, monthlyTrend };
  });
};

export const getMemberFinancialStats = (
  memberId: string,
): Promise<{
  averageCostPerDay: number;
}> => {
  return getMemberSubscriptions(memberId).then((subscriptions) => {
    const totalSpent = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const totalDays = subscriptions.reduce((sum, sub) => sum + sub.activityCount, 0);

    return { averageCostPerDay: totalDays > 0 ? totalSpent / totalDays : 0 };
  });
};
