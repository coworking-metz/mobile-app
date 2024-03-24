import { HTTP } from '../http';

export interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  title: string;
  description: string;
  location?: string;
  urls: string[];
  pictures: string[];
  category: 'COWORKING' | 'AMOUR_FOOD' | 'BLIIIDA';
}

export const getCalendarEvents = (): Promise<CalendarEvent[]> => {
  return HTTP.get('/api/calendar/events').then(({ data }) => data);
};
