import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { type ColorSchemeName, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toaster, toast } from 'sonner-native';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import useToastStore, { type ToastType } from '@/stores/toast';

const getToastIcon = (type?: ToastType): keyof typeof mdiGlyphMap => {
  switch (type) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'alert';
    case 'error':
      return 'alert-box';
    case 'info':
    default:
      return 'information-outline';
  }
};

const getToastIconColor = (type?: ToastType, currentTheme?: ColorSchemeName) => {
  switch (type) {
    case 'success':
      return currentTheme === 'dark' ? `${tw.color('emerald-500')}` : `${tw.color('emerald-600')}`;
    case 'warning':
      return currentTheme === 'dark' ? `${tw.color('yellow-500')}` : `${tw.color('yellow-600')}`;
    case 'error':
      return currentTheme === 'dark' ? `${tw.color('red-500')}` : `${tw.color('red-600')}`;
    case 'info':
    default:
      return currentTheme === 'dark' ? `${tw.color('indigo-500')}` : `${tw.color('indigo-600')}`;
  }
};

const ToastMessage = () => {
  const insets = useSafeAreaInsets();
  const toastStore = useToastStore();
  const colorScheme = useColorScheme();
  const notificationsCount = useToastStore((state) => state.history.length);

  useEffect(() => {
    const history = toastStore.history;
    const allNotificationsNotDismissed = history.filter(({ dismissed }) => !dismissed);
    const allNotificationsNotDismissedSorted = allNotificationsNotDismissed.sort(
      (first, second) => new Date(second.created).getTime() - new Date(first.created).getTime(),
    );
    const [notification] = allNotificationsNotDismissedSorted;
    if (notification) {
      toast(notification.message, {
        icon: (
          <MaterialCommunityIcons
            color={getToastIconColor(notification.type, colorScheme)}
            name={getToastIcon(notification.type)}
            size={20}
          />
        ),
        style: tw`w-full max-w-md mx-auto`,
        closeButton: true,
        duration: notification.timeout ?? Infinity,
        onAutoClose: () => toastStore.dismiss(notification.id),
        onDismiss: () => toastStore.dismiss(notification.id),
        ...(notification.action && {
          action: {
            label: notification.action.label,
            onClick: notification.action.onPress,
          },
        }),
      });
    }
  }, [notificationsCount]);

  return <Toaster invert offset={(insets.top || 0) + 8} position="top-center" />;
};

export default ToastMessage;
