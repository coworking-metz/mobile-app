import { create } from 'zustand';
import { getCalendarEvents, type CalendarEvent } from '@/services/api/calendar';

interface CalendarState {
  events: CalendarEvent[];
  isFetchingEvents: boolean;
  fetchEvents: () => Promise<CalendarEvent[]>;
  clear: () => Promise<void>;
}

const useCalendarStore = create<CalendarState>()((set, get) => ({
  events: [],
  isFetchingEvents: false,
  fetchEvents: () => {
    set({ isFetchingEvents: true });
    return getCalendarEvents()
      .then(async (events) => {
        const sortedEvents = events.sort((a, b) => {
          return new Date(a.start).getTime() - new Date(b.start).getTime();
        });
        await set({ events: sortedEvents });
        return sortedEvents;
      })
      .finally(() => {
        set({ isFetchingEvents: false });
      });
  },
  clear: async (): Promise<void> => {
    await set({
      events: [],
    });
  },
}));

export default useCalendarStore;
