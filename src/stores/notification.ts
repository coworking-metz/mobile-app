import { createAsyncStorage } from './async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NotificationState {
  expoPushToken: string | null;
  clear: () => Promise<void>;
}

const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      expoPushToken: null,
      clear: async () => {
        set({ expoPushToken: null });
      },
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(createAsyncStorage),
      partialize: (state) => ({
        expoPushToken: state.expoPushToken,
      }),
    },
  ),
);

export default useNotificationStore;
