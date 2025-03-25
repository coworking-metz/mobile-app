import LoginAnimation from '../Animations/LoginAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import { makeRedirectUri } from 'expo-auth-session';
import { WebBrowserRedirectResult, openAuthSessionAsync } from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { HTTP } from '@/services/http';
import useSettingsStore from '@/stores/settings';

const loginLogger = log.extend(`[login]`);

const LoginBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const settingsStore = useSettingsStore();
  const [isLoading, setLoading] = useState<boolean>(false);
  const notifyError = useErrorNotification();

  const onSubmit = useCallback(() => {
    setLoading(true);

    const redirectUriOnSuccess = makeRedirectUri({
      path: '/home',
    });

    const loginUri = HTTP.getUri({
      ...(settingsStore.apiBaseUrl && { baseURL: settingsStore.apiBaseUrl }),
      url: '/api/auth/login',
      params: {
        follow: redirectUriOnSuccess,
      },
    }).toString();
    loginLogger.debug('Opening login uri', loginUri);

    (async () => {
      if (Platform.OS === 'ios') {
        return openAuthSessionAsync(loginUri).then((result) => {
          loginLogger.debug('openAuthSessionAsync result', result);
          if (result.type === 'success') {
            const url = (result as WebBrowserRedirectResult).url || redirectUriOnSuccess;
            return Linking.openURL(url);
          }
        });
      }

      return Linking.openURL(loginUri);
    })()
      .catch((error) => {
        notifyError(t('errors.default.message'), error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [notifyError, t, settingsStore]);

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <LoginAnimation style={tw`h-56 w-full`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('auth.login.title')}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('auth.login.description')}
        </Text>
        <AppRoundedButton
          disabled={isLoading}
          loading={isLoading}
          style={tw`self-stretch mt-6`}
          suffixIcon="open-in-new"
          onPress={onSubmit}>
          <Text style={tw`text-base text-black font-medium`}>{t('actions.login')}</Text>
        </AppRoundedButton>
      </View>
    </AppBottomSheet>
  );
};

export default LoginBottomSheet;
