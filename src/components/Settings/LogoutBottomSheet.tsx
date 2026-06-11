import { makeRedirectUri } from 'expo-auth-session';
import { Link } from 'expo-router';
import { openAuthSessionAsync, WebBrowserRedirectResult } from 'expo-web-browser';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, View } from 'react-native';
import tw from 'twrnc';
import ExitDoorAnimation from '@/components/Animations/ExitDoorAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import { log } from '@/helpers/logger';
import { HTTP } from '@/services/http';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';

const logoutLogger = log.extend(`[logout]`);

const LogoutBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const settingsStore = useSettingsStore();
  const noticeStore = useNoticeStore();
  const [isLoading, setLoading] = useState<boolean>(false);
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  useImperativeHandle(forwardedRef, () => bottomSheetRef.current as AppBottomSheetRef);

  const onLogout = useCallback(() => {
    setLoading(true);

    const redirectUriOnSuccess = makeRedirectUri({
      path: '/home',
    });

    const logoutUrl = HTTP.getUri({
      ...(settingsStore.apiBaseUrl && { baseURL: settingsStore.apiBaseUrl }),
      url: '/api/auth/logout',
      params: {
        follow: redirectUriOnSuccess,
        loggedOut: 'true',
      },
    }).toString();
    logoutLogger.debug('Opening logout uri', logoutUrl);

    (async () => {
      if (Platform.OS === 'ios') {
        return openAuthSessionAsync(logoutUrl).then((result) => {
          logoutLogger.debug('openAuthSessionAsync result', result);
          if (result.type === 'success') {
            const url = (result as WebBrowserRedirectResult).url || redirectUriOnSuccess;
            bottomSheetRef.current?.close();
            return Linking.openURL(url);
          }
        });
      }

      return Linking.openURL(logoutUrl);
    })()
      .catch((error) => noticeStore.addError(error, { message: t('errors.default.message') }))
      .finally(() => {
        setLoading(false);
      });
  }, [t, bottomSheetRef, settingsStore, noticeStore]);

  return (
    <AppBottomSheet ref={bottomSheetRef} style={[tw`flex flex-col p-6`, style]} onClose={onClose}>
      <View style={tw`flex h-40 items-center justify-center overflow-visible`}>
        <ExitDoorAnimation style={tw`h-56 w-full`} />
      </View>
      <AppText
        style={tw`mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('auth.logout.title')}
      </AppText>
      <AppText
        style={tw`mt-4 w-full text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('auth.logout.description')}
      </AppText>
      <AppRoundedButton
        disabled={isLoading}
        label={t('actions.logout')}
        loading={isLoading}
        style={tw`mt-6 w-full max-w-sm self-center`}
        suffixIcon="open-in-new"
        onPress={onLogout}
      />
      <Link asChild replace href={`/home?loggedOut=true`}>
        <AppTextButton
          style={tw`mx-auto mt-4 w-full max-w-sm`}
          onPress={bottomSheetRef.current?.close}>
          <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
            {t('auth.logout.forceLogout')}
          </AppText>
        </AppTextButton>
      </Link>
    </AppBottomSheet>
  );
};

export default forwardRef(LogoutBottomSheet);
