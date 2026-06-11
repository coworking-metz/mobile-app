import { makeRedirectUri } from 'expo-auth-session';
import { WebBrowserRedirectResult, openAuthSessionAsync } from 'expo-web-browser';
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
import LoginAnimation from '@/components/Animations/LoginAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { log } from '@/helpers/logger';
import { HTTP } from '@/services/http';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';

const loginLogger = log.extend(`[login]`);

const LoginBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const settingsStore = useSettingsStore();
  const noticeStore = useNoticeStore();
  const [isLoading, setLoading] = useState<boolean>(false);
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  useImperativeHandle(forwardedRef, () => bottomSheetRef.current as AppBottomSheetRef);

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
            bottomSheetRef.current?.close();
            return Linking.openURL(url);
          }
        });
      }

      return Linking.openURL(loginUri);
    })()
      .catch((error) => noticeStore.addError(error, { message: t('errors.default.message') }))
      .finally(() => {
        setLoading(false);
      });
  }, [t, settingsStore, noticeStore]);

  return (
    <AppBottomSheet ref={bottomSheetRef} style={[tw`flex flex-col p-6`, style]} onClose={onClose}>
      <View style={tw`flex h-40 items-center justify-center overflow-visible`}>
        <LoginAnimation style={tw`h-56 w-full`} />
      </View>
      <AppText
        style={tw`mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('auth.login.title')}
      </AppText>
      <AppText
        style={tw`mt-4 w-full text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('auth.login.description')}
      </AppText>
      <AppRoundedButton
        disabled={isLoading}
        label={t('actions.login')}
        loading={isLoading}
        style={tw`mt-6 w-full max-w-sm self-center`}
        suffixIcon="open-in-new"
        onPress={onSubmit}
      />
    </AppBottomSheet>
  );
};

export default forwardRef(LoginBottomSheet);
