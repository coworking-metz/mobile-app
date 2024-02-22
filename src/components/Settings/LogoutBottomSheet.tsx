import ExitDoorAnimation from '../Animations/ExitDoorAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import AppTextButton from '../AppTextButton';
import { makeRedirectUri } from 'expo-auth-session';
import { openAuthSessionAsync, type WebBrowserRedirectResult } from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { ToastPresets } from 'react-native-ui-lib';
import tw from 'twrnc';
import { useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';
import useAuthStore from '@/stores/auth';
import useToastStore from '@/stores/toast';

const logoutLogger = log.extend(`[${__filename.split('/').pop()}]`);

const LogoutBottomSheet = ({ style, onClose }: { style?: StyleProps; onClose?: () => void }) => {
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

    const logoutUrl = `https://www.coworking-metz.fr/mon-compte/deconnexion?redirect_to=${redirectUriOnSuccess}`;

    openAuthSessionAsync(logoutUrl)
      .then((result) => {
        logoutLogger.debug('openAuthSessionAsync result', result);
        if (result.type === 'success') {
          const url = (result as WebBrowserRedirectResult).url || redirectUriOnSuccess;
          return Linking.openURL(url).then(onLoggedOut);
        }
      })

      .catch((error) => {
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
          loading={isLoading}
          style={tw`self-stretch mt-6`}
          onPress={onLogout}>
          <Text style={tw`text-base text-black font-medium`}>{t('actions.logout')}</Text>
        </AppRoundedButton>
        <AppTextButton style={tw`mt-4`} onPress={onLoggedOut}>
          <Text style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
            {t('auth.logout.forceLogout')}
          </Text>
        </AppTextButton>
      </View>
    </AppBottomSheet>
  );
};

export default LogoutBottomSheet;
