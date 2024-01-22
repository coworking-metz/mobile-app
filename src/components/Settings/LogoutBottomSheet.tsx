import CouponsAnimation from '../Animations/CouponsAnimation';
import ExitDoorAnimation from '../Animations/ExitDoorAnimation';
import HorizontalLoadingAnimation from '../Animations/HorizontalLoadingAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import ServiceRow from '../Settings/ServiceRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { makeRedirectUri } from 'expo-auth-session';
import { Link } from 'expo-router';
import { type WebBrowserRedirectResult, openAuthSessionAsync } from 'expo-web-browser';
import { Skeleton } from 'moti/skeleton';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { Button, ToastPresets } from 'react-native-ui-lib';
import tw from 'twrnc';
import { useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';
import useToastStore from '@/stores/toast';

const logoutLogger = log.extend(`[${__filename.split('/').pop()}]`);

const LogoutBottomSheet = ({
  loading = false,
  style,
  onClose,
}: {
  loading?: boolean;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const toastStore = useToastStore();
  const authStore = useAuthStore();
  const notifyError = useErrorNotification();

  const onLoggedOut = useCallback(() => {
    return authStore.logout().then(() => {
      toastStore.add({
        message: t('auth.logout.onSuccess.message'),
        type: ToastPresets.SUCCESS,
        timeout: 3000,
      });
    });
  }, [authStore, toastStore, t]);

  const onLogout = useCallback(() => {
    setLoading(true);

    const redirectUriOnSuccess = makeRedirectUri({
      path: '/login',
    });

    const logoutUrl = `https://www.coworking-metz.fr/mon-compte/deconnexion/?redirect=${redirectUriOnSuccess}`;

    openAuthSessionAsync(logoutUrl)
      .then((result) => {
        logoutLogger.debug('openAuthSessionAsync result', result);
        if (result.type === 'success') {
          const url = (result as WebBrowserRedirectResult).url || redirectUriOnSuccess;
          return Linking.openURL(url).then(onLoggedOut);
        }
      })

      .catch(async (error) => {
        notifyError(t('errors.default.message'), error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [onLoggedOut, notifyError, t]);

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full justify-between p-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <ExitDoorAnimation style={tw`h-56`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('auth.logout.title')}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('auth.logout.description')}
        </Text>
        <AppRoundedButton
          disabled={isLoading}
          style={tw`h-14 self-stretch mt-6`}
          onPress={onLogout}>
          {isLoading ? (
            <HorizontalLoadingAnimation />
          ) : (
            <Text style={tw`text-base text-black font-medium`}>{t('actions.logout')}</Text>
          )}
        </AppRoundedButton>
        <Button
          activeBackgroundColor={
            tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')
          }
          activeOpacity={1}
          backgroundColor="transparent"
          style={tw`mt-4 h-14`}
          onPress={onLoggedOut}>
          <Text style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
            {t('auth.logout.forceLogout')}
          </Text>
        </Button>
      </View>
    </AppBottomSheet>
  );
};

export default LogoutBottomSheet;
