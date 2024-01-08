import { HTTP } from '../http';

export interface CalendarEvent {
  id: number;
  start: string;
  end: string;
  label: string;
  description: string;
  location?: string;
  url: string;
  picture: string;
  category: 'COWORKING' | 'AMOUR_FOOD' | 'BLIIIDA';
}

export const getCalendarEvents = (): Promise<CalendarEvent[]> => {
  return HTTP.get('https://mock.matthieupetit.dev/api/mobile/v1/calendar/events').then(
    ({ data }) => data,
  );
};
