import { useAppPermissions } from './permissions';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
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
  arePushNotificationsEnabled?: boolean;
  enablePushNotifications: () => Promise<void>;
  disablePushNotifications: () => Promise<void>;
  togglePushNotifications: (shouldEnable?: boolean) => Promise<void>;
}>({
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
  const noticeStore = useNoticeStore();
  const notificationStore = useNotificationStore();
  const [notificationStatus, setNotificationStatus] =
    useState<Notifications.PermissionStatus | null>(null);
  const cleanupRef = useRef<() => void | null>(null);
  const renderPermissionsBottomSheet = useAppPermissions();

  const onHandleNotification = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as {
        pathname?: string;
        params?: Record<string, string>;
      };

      if (!data.pathname) {
        return;
      }

      router.push({
        pathname: data.pathname as never,
        params: data.params,
      });
    },
    [router],
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

    (async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
          // vibrationPattern: [0, 250, 250, 250],
          lightColor: theme.miramonYellow,
        });
      }

      if (!Device.isDevice) {
        throw new Error('Physical device required');
      }

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

      // TODO: send token to API
      useNotificationStore.setState({ expoPushToken: token.data });

      subscribeToNotifications();
    })().catch((error) => {
      noticeStore.addError(error, {
        message: t('pushNotifications.onRegistration.fail'),
      });
    });
  }, [noticeStore]);

  const disablePushNotifications = useCallback(async () => {
    // TODO:
    // - unsubscribe from notifications
    // - clear expo push token
    // - remove expo push token from API

    cleanupRef.current?.();
    cleanupRef.current = null;
    notificationStore.clear();
  }, []);

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

  return (
    <PushNotificationsContext.Provider
      value={{
        arePushNotificationsEnabled,
        togglePushNotifications,
        enablePushNotifications,
        disablePushNotifications,
      }}>
      {children}
    </PushNotificationsContext.Provider>
  );
};
