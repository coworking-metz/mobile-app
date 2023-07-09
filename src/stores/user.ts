import { create } from 'zustand';
import {
  type ApiUserProfile,
  getUserProfile,
  type ApiUserPresenceTimelineItem,
  getUserPresence,
} from '@/services/api/profile';

interface UserState {
  profile: ApiUserProfile | null;
  isFetchingProfile: boolean;
  fetchProfile: () => Promise<ApiUserProfile>;
  presenceTimeline: ApiUserPresenceTimelineItem[];
  isFetchingPresenceTimeline: boolean;
  fetchPresenceTimeline: () => Promise<ApiUserPresenceTimelineItem[]>;
  clear: () => Promise<void>;
}

const useUserStore = create<UserState>()((set, get) => ({
  profile: null,
  isFetchingProfile: false,
  fetchProfile: async (): Promise<ApiUserProfile> => {
    set({ isFetchingProfile: true });
    return getUserProfile()
      .then(async (userProfile) => {
        await set({ profile: userProfile });
        return userProfile;
      })
      .finally(() => {
        set({ isFetchingProfile: false });
      });
  },
  presenceTimeline: [],
  isFetchingPresenceTimeline: false,
  fetchPresenceTimeline: async (): Promise<ApiUserPresenceTimelineItem[]> => {
    set({ isFetchingPresenceTimeline: true });
    return getUserPresence()
      .then(async ({ timeline }) => {
        await set({ presenceTimeline: timeline });
        return timeline;
      })
      .finally(() => {
        set({ isFetchingPresenceTimeline: false });
      });
  },
  clear: async (): Promise<void> => {
    await set({ profile: null, presenceTimeline: [] });
  },
}));

export default useUserStore;
