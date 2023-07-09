import { type ToastPresets } from 'react-native-ui-lib';
import uuid from 'react-native-uuid';
import { create } from 'zustand';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

/**
 * Small message to show through an unblocking view at the top of the screen.
 */
export interface Toast {
  message: string;
  type?: ToastPresets;
  timeout?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface StoreToast extends Toast {
  id: string | number[];
  created: string;
  dismissed: string | null;
}

interface ToastState {
  history: StoreToast[];
  add: (toast: Toast) => StoreToast;
  remove: (id: string | number[]) => void;
  dismiss: (id: string | number[]) => void;
  dismissAll: () => void;
}

const useToastStore = create<ToastState>((set, get) => ({
  history: [],
  add: (toast: Toast) => {
    const newToast = {
      ...toast,
      id: uuid.v4(),
      created: new Date().toISOString(),
      dismissed: null,
    };
    set((state) => ({
      history: [...state.history, newToast],
    }));
    return newToast;
  },
  remove: (id: string | number[]) => {
    set((state) => ({ history: state.history.filter((toast) => toast.id !== id) }));
  },
  dismiss: (id: string | number[]) => {
    set((state) => ({
      history: state.history.map((toast) => {
        if (toast.id === id) {
          return { ...toast, dismissed: new Date().toISOString() };
        }
        return toast;
      }),
    }));
  },
  dismissAll: () => {
    set((state) => ({
      history: state.history.map((toast) => ({ ...toast, dismissed: new Date().toISOString() })),
    }));
  },
}));

export default useToastStore;
