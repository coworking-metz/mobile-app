import uuid from 'react-native-uuid';
import { create } from 'zustand';
import { AppRoundedButtonProps } from '@/components/AppRoundedButton';
import { AnyError } from '@/helpers/error';

export type NoticeType = 'info' | 'success' | 'warning' | 'error';

export type NoticeAction = Pick<AppRoundedButtonProps, 'onPress' | 'suffixIcon'> & {
  label: string;
};

/**
 * Notification shown through a blocking bottom sheet.
 */
export interface Notice {
  title: string;
  description?: string;
  type?: NoticeType;
  timeout?: number;
  onClose?: () => void;
  action?: NoticeAction;
}

export interface NoticeError {
  title?: string;
  error?: AnyError | null;
  date?: string;
}

/**
 * Error notice listing one or more errors, its message is derived from them.
 */
export interface ErrorsNotice extends Omit<Notice, 'title' | 'description' | 'type'> {
  type: 'error';
  errors: NoticeError[];
}

// error notices only go through `addErrors`
type InfoNotice = Omit<Notice, 'type'> & { type?: Exclude<NoticeType, 'error'> };

export type StoreNotice = (InfoNotice | ErrorsNotice) & {
  id: string | number[];
  created: string;
  dismissed: string | null;
};

interface NoticeState {
  history: StoreNotice[];
  add: (notice: InfoNotice | ErrorsNotice) => void;
  addErrors: (errors: NoticeError[], options?: Omit<ErrorsNotice, 'type' | 'errors'>) => void;
  addError: (error: AnyError, options: Omit<Notice, 'type' | 'description'>) => Promise<AnyError>;
  remove: (id: string | number[]) => void;
  dismiss: (id: string | number[]) => void;
  dismissAll: () => void;
}

const useNoticeStore = create<NoticeState>((set, get) => ({
  history: [],
  add: (notice: InfoNotice | ErrorsNotice): void => {
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
  addErrors: (errors, options = {}): void => {
    get().add({ ...options, type: 'error', errors });
  },
  addError: async (error, { title, ...options }): Promise<AnyError> => {
    get().addErrors([{ title, error }], options);
    return Promise.reject(error);
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
