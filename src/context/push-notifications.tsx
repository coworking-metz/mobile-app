import { useAppPermissions } from './permissions';
import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { isNil } from 'lodash';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { theme } from '@/helpers/colors';
import { log } from '@/helpers/logger';
import { addPushToken, removePushToken } from '@/services/api/push-tokens';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useNotificationStore from '@/stores/notification';

const pushNotificationsLogger = log.extend('[push-notifications]');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const getProjectId = () => {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId ||
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID
  );
};

const PushNotificationsContext = createContext<{
  isChangingStatus: boolean;
  arePushNotificationsEnabled?: boolean;
  enablePushNotifications: () => Promise<void>;
  disablePushNotifications: () => Promise<void>;
  togglePushNotifications: (shouldEnable?: boolean) => Promise<void>;
}>({
  isChangingStatus: false,
  arePushNotificationsEnabled: false,
  enablePushNotifications: () => Promise.resolve(),
  disablePushNotifications: () => Promise.resolve(),
  togglePushNotifications: () => Promise.resolve(),
});

export const useAppPushNotifications = () => {
  return useContext(PushNotificationsContext);
};

export const PushNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const noticeStore = useNoticeStore();
  const authStore = useAuthStore();
  const user = useAuthStore((s) => s.user);
  const notificationStore = useNotificationStore();
  const [notificationStatus, setNotificationStatus] =
    useState<Notifications.PermissionStatus | null>(null);
  const [isChangingStatus, setChangingStatus] = useState(false);
  const cleanupRef = useRef<() => void | null>(null);
  const renderPermissionsBottomSheet = useAppPermissions();

  const onHandleNotification = useCallback(
    async (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as {
        pathname?: string;
        params?: Record<string, string>;
      };

      if (!data.pathname) {
        return;
      }

      if (authStore.user?.impersonatedBy) {
        // notification should be handled by the original user, not the impersonated
        await authStore.refreshAccessToken();
        await Promise.all([
          queryClient.resetQueries(),
          Image.clearDiskCache(),
          Image.clearMemoryCache(),
        ]);
      }

      router.push({
        pathname: data.pathname as never,
        params: data.params,
      });
    },
    [authStore, noticeStore, queryClient, router, t],
  );

  const subscribeToNotifications = useCallback(() => {
    const notificationReceivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        pushNotificationsLogger.debug('Notification received while app is running', {
          identifier: notification.request.identifier,
        });
      },
    );

    const notificationResponseSubscription =
      Notifications.addNotificationResponseReceivedListener(onHandleNotification);

    cleanupRef.current = () => {
      notificationReceivedSubscription.remove();
      notificationResponseSubscription.remove();
    };
  }, [onHandleNotification]);

  const enablePushNotifications = useCallback(async () => {
    // TODO:
    // - ask for permissions
    // - get expo push token
    // - store expo push token
    // - push expo token to the API
    // - subscribe to notifications
    setChangingStatus(true);

    (async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
          // vibrationPattern: [0, 250, 250, 250],
          lightColor: theme.miramonYellow,
        });
      }

      // if (!Device.isDevice) {
      //   throw new Error('Physical device required');
      // }

      const existingPermission = await Notifications.getPermissionsAsync();
      let finalStatus = existingPermission.status;

      if (finalStatus !== 'granted') {
        const requestedPermission = await Notifications.requestPermissionsAsync();
        finalStatus = requestedPermission.status;
      }

      if (finalStatus !== 'granted') {
        renderPermissionsBottomSheet();
        return;
      }

      const projectId = getProjectId();
      if (!projectId) {
        throw new Error('Missing EAS projectId for push token retrieval');
      }

      const token = await Notifications.getExpoPushTokenAsync({ projectId });

      if (!token.data) {
        throw new Error('Failed to retrieve Expo push token');
      }

      useNotificationStore.setState({ expoPushToken: token.data });

      subscribeToNotifications();
    })()
      .catch((error) => {
        noticeStore.addError(error, {
          message: t('pushNotifications.onRegistration.fail'),
        });
      })
      .finally(() => {
        setChangingStatus(false);
      });
  }, [noticeStore, renderPermissionsBottomSheet, subscribeToNotifications, t]);

  const disablePushNotifications = useCallback(async () => {
    // TODO:
    // - unsubscribe from notifications
    // - clear expo push token
    // - remove expo push token from API

    cleanupRef.current?.();
    cleanupRef.current = null;

    if (user?.id && notificationStore.expoPushToken) {
      setChangingStatus(true);
      await removePushToken(user.id, notificationStore.expoPushToken).finally(() => {
        setChangingStatus(false);
      });
    }

    notificationStore.clear();
  }, [user, notificationStore.expoPushToken]);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => setNotificationStatus(status));

    if (notificationStore.expoPushToken && isNil(cleanupRef.current)) {
      subscribeToNotifications();

      const lastNotification = Notifications.getLastNotificationResponse();
      if (lastNotification) {
        onHandleNotification(lastNotification);
      }
    }

    return () => {
      cleanupRef.current?.();
    };
  }, [router]);

  const arePushNotificationsEnabled = useMemo(() => {
    return (
      notificationStatus === Notifications.PermissionStatus.GRANTED &&
      !isNil(notificationStore.expoPushToken)
    );
  }, [notificationStatus, notificationStore.expoPushToken]);

  const togglePushNotifications = useCallback(
    async (shouldEnable?: boolean) => {
      const willEnable = shouldEnable ?? !arePushNotificationsEnabled;
      if (willEnable) {
        await enablePushNotifications();
        setNotificationStatus(Notifications.PermissionStatus.GRANTED);
      } else {
        await disablePushNotifications();
        setNotificationStatus(null);
      }
    },
    [arePushNotificationsEnabled, enablePushNotifications, disablePushNotifications],
  );

  useEffect(() => {
    const isImpersonated = !!user?.impersonatedBy;

    if (isImpersonated) return;

    if (user?.id && notificationStore.expoPushToken) {
      addPushToken(user.id, notificationStore.expoPushToken, Platform.OS);
    }
  }, [user?.id, notificationStore.expoPushToken]);

  return (
    <PushNotificationsContext.Provider
      value={{
        isChangingStatus,
        arePushNotificationsEnabled,
        togglePushNotifications,
        enablePushNotifications,
        disablePushNotifications,
      }}>
      {children}
    </PushNotificationsContext.Provider>
  );
};
