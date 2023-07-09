import dayjs from 'dayjs';
import { create } from 'zustand';
import {
  getPresenceByDay,
  getPresenceByWeek,
  type ApiPresencePeriod,
} from '@/services/api/presence';

export type PresencePeriod = ApiPresencePeriod & {
  at: string;
};

interface PresenceState {
  weekPresence: PresencePeriod | null;
  isFetchingWeekPresence: boolean;
  fetchWeekPresence: () => Promise<PresencePeriod>;
  dayPresence: PresencePeriod | null;
  isFetchingDayPresence: boolean;
  fetchDayPresence: () => Promise<PresencePeriod>;
  clear: () => Promise<void>;
}

const usePresenceStore = create<PresenceState>()((set, get) => ({
  weekPresence: null,
  isFetchingWeekPresence: false,
  fetchWeekPresence: () => {
    set({ isFetchingWeekPresence: true });
    return getPresenceByWeek()
      .then(async (weekPresence) => {
        const weekPresenceAt = {
          ...weekPresence,
          at: dayjs().toISOString(),
        };
        await set({ weekPresence: weekPresenceAt });
        return weekPresenceAt;
      })
      .finally(() => {
        set({ isFetchingWeekPresence: false });
      });
  },
  dayPresence: null,
  isFetchingDayPresence: false,
  fetchDayPresence: () => {
    set({ isFetchingDayPresence: true });
    return getPresenceByDay()
      .then(async (dayPresence) => {
        const dayPresenceAt = {
          ...dayPresence,
          at: dayjs().toISOString(),
        };
        await set({ dayPresence: dayPresenceAt });
        return dayPresenceAt;
      })
      .finally(() => {
        set({ isFetchingDayPresence: false });
      });
  },
  clear: async (): Promise<void> => {
    await set({
      weekPresence: null,
      dayPresence: null,
    });
  },
}));

export default usePresenceStore;
