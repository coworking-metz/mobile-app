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

export type ApiPeriodStats<PeriodType extends 'year' | 'month' | 'week' | 'day'> = {
  date: string;
  type: PeriodType;
  data: {
    coworkersCount: number;
    coworkedDaysCount: number;
    newCoworkersCount: number;
    coworkedDaysAmount: number;
  };
};

export const getStatsPerDay = (from?: string, to?: string): Promise<ApiPeriodStats<'day'>[]> => {
  return HTTP.get('/stats/day', {
    params: {
      ...(from && { from }),
      ...(to && { to }),
    },
  }).then(({ data }) => data);
};

export const getPresenceByWeek = (): Promise<ApiPresencePeriod> => {
  const currentMonday = dayjs().day(1).startOf('day'); // monday from current week
  const previousMonday = currentMonday.subtract(1, 'week');
  return getStatsPerDay(previousMonday.format('YYYY-MM-DD')).then((dayStats) => {
    const previousTimeline = dayStats
      .filter(({ date }) => dayjs(date).isBefore(currentMonday))
      .map(({ date, data }) => ({
        date,
        value: data.coworkersCount,
      }));

    const [previousFirstDay] = previousTimeline;
    const previousLastDay = previousTimeline[previousTimeline.length - 1];

    const currentTimeline = dayStats
      .filter(({ date }) => dayjs(date).isAfter(previousLastDay.date))
      .map(({ date, data }) => ({
        date,
        value: data.coworkersCount,
      }));

    const currentWeekWithForecast = [
      ...currentTimeline,
      ...previousTimeline
        .slice(currentTimeline.length)
        .map((item: ApiPresenceTimelineItem, index: number) => ({
          ...item,
          date: dayjs(currentTimeline[currentTimeline.length]?.date)
            .add(index, 'day')
            .format('YYYY-MM-DD'),
        })),
    ];

    const [currentFirstDay] = currentWeekWithForecast;
    const currentLastDay = currentWeekWithForecast[currentWeekWithForecast.length - 1];

    return {
      previous: {
        from: dayjs(previousFirstDay.date).format('YYYY-MM-DD'),
        to: dayjs(previousLastDay.date).format('YYYY-MM-DD'),
        timeline: previousTimeline,
      },
      current: {
        from: dayjs(currentFirstDay.date).format('YYYY-MM-DD'),
        to: dayjs(currentLastDay.date).format('YYYY-MM-DD'),
        timeline: currentWeekWithForecast,
      },
    };
  });
};

export const getPresenceByDay = (): Promise<ApiPresencePeriod> => {
  return HTTP.get('https://mock.matthieupetit.dev/api/mobile/v1/presence/day').then(({ data }) => {
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
