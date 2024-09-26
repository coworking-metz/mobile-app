import LoginAnimation from '../Animations/LoginAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import { makeRedirectUri } from 'expo-auth-session';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { parseErrorText } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { HTTP } from '@/services/http';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const loginLogger = log.extend(`[login]`);

const LoginBottomSheet = ({ style, onClose }: { style?: StyleProps; onClose?: () => void }) => {
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();
  const toastStore = useToastStore();
  const settingsStore = useSettingsStore();
  const [isLoading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    setLoading(true);
    toastStore.dismissAll();

    const redirectUriOnSuccess = makeRedirectUri({
      path: '/home',
    });

    const loginUri = HTTP.getUri({
      ...(settingsStore.apiBaseUrl && { baseURL: settingsStore.apiBaseUrl }),
      url: '/api/auth/login',
      params: {
        follow: redirectUriOnSuccess,
      },
    });
    loginLogger.debug('Opening login uri', loginUri);

    Linking.openURL(loginUri.toString())
      .catch(async (error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('errors.default.message'),
          description,
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [settingsStore]);

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
