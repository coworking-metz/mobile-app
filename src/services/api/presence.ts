import { HTTP } from '../http';
import dayjs from 'dayjs';

export type ApiPresenceTimelineItem = {
  date: string;
  value: number;
};

export type ApiPresence = {
  from: string;
  to: string;
  timeline: ApiPresenceTimelineItem[];
};

export type ApiPresencePeriod = {
  previous: ApiPresence;
  current: ApiPresence;
};

export const getPresenceByWeek = (): Promise<ApiPresencePeriod> => {
  return HTTP.get('/presence/week').then(({ data }) => {
    return {
      ...data,
      current: {
        ...data.current,
        timeline: [
          ...data.current.timeline,
          ...data.previous.timeline
            .slice(data.current.timeline.length)
            .map((item: ApiPresenceTimelineItem, index: number) => ({
              ...item,
              date: dayjs(data.current.to)
                .add(index + 1, 'day')
                .format('YYYY-MM-DD'),
            })),
        ],
      },
    };
  });
};

export const getPresenceByDay = (): Promise<ApiPresencePeriod> => {
  return HTTP.get('/presence/day').then(({ data }) => {
    return {
      ...data,
      current: {
        ...data.current,
        timeline: [
          ...data.current.timeline,
          ...data.previous.timeline
            .slice(data.current.timeline.length)
            .map((item: ApiPresenceTimelineItem, index: number) => ({
              ...item,
              date: dayjs(data.current.to).add(index, 'hour').toISOString(),
            })),
        ],
      },
    };
  });
};

export type ApiCurrentPresence = {
  fetchedAt: string;
  count: number;
  total: number;
};

export const getPresenceNow = (): Promise<ApiCurrentPresence> => {
  return HTTP.get('/presence/now').then(({ data }) => data);
};
