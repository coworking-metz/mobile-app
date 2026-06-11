import React, { useEffect, useRef } from 'react';
import { Animated, Easing, useColorScheme, View, type ColorSchemeName } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast, Toaster } from 'sonner-native';
import tw from 'twrnc';
import AppIcon, { MaterialCommunityIconsName } from '@/components/AppIcon';
import useToastStore, { type ToastType } from '@/stores/toast';

const getToastIcon = (type?: ToastType): MaterialCommunityIconsName => {
  switch (type) {
    case 'success':
      return 'check-circle-outline';
    case 'warning':
      return 'alert-outline';
    case 'error':
      return 'alert-box-outline';
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

type ToastProgressBarProps = {
  duration: number;
  color: string;
};

const ToastBackgroundWithProgress = ({ duration, color }: ToastProgressBarProps) => {
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    progress.setValue(1);
    Animated.timing(progress, {
      toValue: 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [duration, progress]);

  return (
    <View
      style={tw`absolute inset-0 rounded-2xl bg-neutral-900 dark:border dark:border-zinc-700 dark:bg-neutral-950`}>
      <View pointerEvents="none" style={tw`absolute inset-x-0 top-0 h-1`}>
        <Animated.View
          style={[
            tw`h-full rounded-full`,
            {
              backgroundColor: color,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const ToastMessages = () => {
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
      const isTemporary =
        typeof notification.timeout === 'number' && Number.isFinite(notification.timeout);
      const progressColor = getToastIconColor(notification.type, colorScheme);
      toast(notification.message, {
        icon: (
          <AppIcon
            color={getToastIconColor(notification.type, colorScheme)}
            icon={getToastIcon(notification.type)}
            size={20}
          />
        ),
        style: tw`sm:mx-auto sm:w-full sm:max-w-sm`,
        closeButton: true,
        duration: notification.timeout ?? Infinity,
        ...(isTemporary && {
          backgroundComponent: (
            <ToastBackgroundWithProgress
              color={progressColor}
              duration={notification.timeout as number}
            />
          ),
        }),
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

  return (
    <Toaster enableStacking offset={(insets.top || 0) + 8} position="top-center" theme="dark" />
  );
};

export default ToastMessages;
