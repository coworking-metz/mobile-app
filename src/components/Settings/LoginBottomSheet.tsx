import { makeRedirectUri } from 'expo-auth-session';
import { WebBrowserRedirectResult, openAuthSessionAsync } from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import LoginAnimation from '@/components/Animations/LoginAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
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
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col w-full px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <LoginAnimation style={tw`h-56 w-full`} />
        </View>
        <AppText
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('auth.login.title')}
        </AppText>
        <AppText style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('auth.login.description')}
        </AppText>
        <AppRoundedButton
          disabled={isLoading}
          loading={isLoading}
          style={tw`mt-6 w-full max-w-md self-center`}
          suffixIcon="open-in-new"
          onPress={onSubmit}>
          <AppText style={tw`text-base text-black font-medium`}>{t('actions.login')}</AppText>
        </AppRoundedButton>
      </View>
    </AppBottomSheet>
  );
};

export default LoginBottomSheet;
