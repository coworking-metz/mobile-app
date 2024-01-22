import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { Link } from 'expo-router';
import {
  coolDownAsync,
  openAuthSessionAsync,
  warmUpAsync,
  type WebBrowserRedirectResult,
} from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import WelcomeAnimation from '@/components/Animations/WelcomeAnimation';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppFooter from '@/components/Settings/AppFooter';
import ServiceRow from '@/components/Settings/ServiceRow';
import { parseErrorText } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { HTTP } from '@/services/http';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const loginLogger = log.extend(`[${__filename.split('/').pop()}]`);

const IS_PROD = Constants.releaseChannel === 'production';

export default function Login() {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();
  const toastStore = useToastStore();
  const settingsStore = useSettingsStore();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    warmUpAsync();

    return () => {
      coolDownAsync();
    };
  }, []);

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
    loginLogger.debug('openAuthSessionAsync', loginUri);

    openAuthSessionAsync(loginUri.toString())
      .then((result) => {
        loginLogger.debug('openAuthSessionAsync result', result);
        if (result.type === 'success') {
          const url = (result as WebBrowserRedirectResult).url || redirectUriOnSuccess;
          return Linking.openURL(url);
        }
      })
      .then(() => {
        // should clear all previous notifications
        toastStore.dismissAll();
      })
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
    <ScrollView
      bounces={false}
      contentContainerStyle={[
        tw`grow`,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingBottom: insets.bottom,
          paddingRight: insets.right,
        },
      ]}
      style={tw`flex flex-col grow shrink bg-gray-100 dark:bg-black`}>
      <View style={tw`flex flex-col justify-end self-center shrink grow basis-0`}>
        <WelcomeAnimation style={tw`w-full max-w-[256px] max-h-[256px]`} />
      </View>
      <View style={tw`flex flex-col px-6 shrink grow basis-0`}>
        <Text style={tw`text-lg font-semibold text-slate-500 dark:text-slate-400`}>
          {t('auth.login.headline')}
        </Text>
        <Text style={tw`mb-4 text-3xl tracking-tight text-slate-900 dark:text-gray-200 font-bold`}>
          {t('auth.login.title')}
        </Text>

        <AppRoundedButton disabled={isLoading} style={tw`mt-4 mx-2 h-14`} onPress={onSubmit}>
          {isLoading ? (
            <HorizontalLoadingAnimation />
          ) : (
            <Text style={tw`text-base text-black font-medium`}>{t('actions.login')}</Text>
          )}
        </AppRoundedButton>
        <Link asChild href="/onboarding">
          <Button
            activeBackgroundColor={
              tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')
            }
            activeOpacity={1}
            backgroundColor="transparent"
            style={tw`mt-4 mx-2 h-14`}>
            <Text style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
              {t('auth.login.onboarding')}
            </Text>
          </Button>
        </Link>
      </View>

      <View style={tw`flex flex-col gap-3 mt-auto`}>
        {!IS_PROD ? (
          <Link asChild href="/advanced/">
            <ServiceRow
              withBottomDivider
              label={t('advanced.title')}
              prefixIcon="cog-outline"
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right">
              <View style={tw`bg-gray-300 dark:bg-gray-700 py-1 px-2 rounded`}>
                <Text style={tw`text-xs text-slate-900 dark:text-gray-200 font-medium`}>DEV</Text>
              </View>
            </ServiceRow>
          </Link>
        ) : (
          <></>
        )}
        <AppFooter style={[tw`mx-auto self-center px-3 pb-4`]} />
      </View>
    </ScrollView>
  );
}
