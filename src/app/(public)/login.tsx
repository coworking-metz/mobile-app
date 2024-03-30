import { makeRedirectUri } from 'expo-auth-session';
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
import tw, { useDeviceContext } from 'twrnc';
import WelcomeAnimation from '@/components/Animations/WelcomeAnimation';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppTextButton from '@/components/AppTextButton';
import AppFooter from '@/components/Settings/AppFooter';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';
import ServiceRow from '@/components/Settings/ServiceRow';
import { parseErrorText } from '@/helpers/error';
import { log } from '@/helpers/logger';
import { HTTP } from '@/services/http';
import { IS_DEV } from '@/services/updates';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const loginLogger = log.extend(`[login.tsx]`);

export default function Login() {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();
  const toastStore = useToastStore();
  const settingsStore = useSettingsStore();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isContacting, setContacting] = useState<boolean>(false);

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
    <>
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
        <View style={tw`flex flex-col justify-end shrink grow basis-0 w-full`}>
          <WelcomeAnimation style={tw`self-center w-full max-w-[256px] h-256px`} />

          <View style={tw`flex flex-col px-6`}>
            <Text style={tw`text-lg font-semibold text-slate-500 dark:text-slate-400`}>
              {t('auth.login.headline')}
            </Text>
            <Text
              style={tw`mb-4 text-3xl tracking-tight text-slate-900 dark:text-gray-200 font-bold`}>
              {t('auth.login.title')}
            </Text>
          </View>
        </View>

        <View style={tw`flex flex-col shrink grow basis-0 w-full`}>
          <AppRoundedButton
            disabled={isLoading}
            loading={isLoading}
            style={tw`mt-4 mx-6`}
            onPress={onSubmit}>
            <Text style={tw`text-base text-black font-medium`}>{t('actions.login')}</Text>
          </AppRoundedButton>
          <Link asChild href="/onboarding">
            <AppTextButton style={tw`mt-4 mx-6`}>
              <Text style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
                {t('auth.login.onboarding')}
              </Text>
            </AppTextButton>
          </Link>

          <View style={tw`flex flex-col mt-auto pt-3`}>
            {IS_DEV ? (
              <Link asChild href="/advanced/">
                <ServiceRow
                  withBottomDivider
                  label={t('advanced.title')}
                  prefixIcon="cog-outline"
                  style={tw`px-3 mx-3`}
                  suffixIcon="chevron-right">
                  <View style={tw`bg-gray-400/25 dark:bg-gray-700/50 py-1 px-2 rounded`}>
                    <Text style={tw`text-xs text-slate-900 dark:text-gray-200 font-medium`}>
                      DEV
                    </Text>
                  </View>
                </ServiceRow>
              </Link>
            ) : (
              <></>
            )}
            <ServiceRow
              withBottomDivider
              label={t('settings.support.contact.title')}
              prefixIcon="help-circle-outline"
              style={tw`px-3 mx-3`}
              suffixIcon="chevron-right"
              onPress={() => setContacting(true)}
            />
          </View>

          <AppFooter style={[tw`mx-auto self-center px-3 pb-4 mt-3`]} />
        </View>
      </ScrollView>

      {isContacting ? <ContactBottomSheet onClose={() => setContacting(false)} /> : null}
    </>
  );
}
