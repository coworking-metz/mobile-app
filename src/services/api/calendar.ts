import { HTTP } from '@/services/http';

export interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  title: string;
  description: string;
  location?: string;
  urls: string[];
  pictures: string[];
  calendar: 'COWORKING' | 'AMOUR_FOOD' | 'BLIIIDA';
}

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  return HTTP.get('/api/calendar/events').then(({ data }) => data);
};
