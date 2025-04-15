import uuid from 'react-native-uuid';
import { create } from 'zustand';

export type NoticeType = 'info' | 'success' | 'warning' | 'error' | 'loading' | 'unlock';

/**
 * Notification shown through a blocking bottom sheet.
 */
export interface Notice {
  message: string;
  description?: string;
  type?: NoticeType;
  timeout?: number;
  onClose?: () => void;
}

export interface StoreNotice extends Notice {
  id: string | number[];
  created: string;
  dismissed: string | null;
}

interface NoticeState {
  history: StoreNotice[];
  add: (notice: Notice) => void;
  remove: (id: string | number[]) => void;
  dismiss: (id: string | number[]) => void;
  dismissAll: () => void;
}

const useNoticeStore = create<NoticeState>((set, _get) => ({
  history: [],
  add: (notice: Notice): void => {
    set((state) => ({
      history: [
        ...state.history,
        {
          ...notice,
          id: uuid.v4(),
          created: new Date().toISOString(),
          dismissed: null,
        },
      ],
    }));
  },
  remove: (id: string | number[]): void => {
    set((state) => ({ history: state.history.filter((notice) => notice.id !== id) }));
  },
  dismiss: (id: string | number[]): void => {
    set((state) => ({
      history: state.history.map((notice) => {
        if (notice.id === id) {
          return { ...notice, dismissed: new Date().toISOString() };
        }
        return notice;
      }),
    }));
  },
  dismissAll: (): void => {
    set((state) => ({
      history: state.history.map((notice) => ({ ...notice, dismissed: new Date().toISOString() })),
    }));
  },
}));

export default useNoticeStore;
