import { makeRedirectUri } from 'expo-auth-session';
import { Link } from 'expo-router';
import { openAuthSessionAsync, WebBrowserRedirectResult } from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import ExitDoorAnimation from '@/components/Animations/ExitDoorAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import { useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';

const logoutLogger = log.extend(`[logout]`);

const LogoutBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const notifyError = useErrorNotification();

  const onLogout = useCallback(() => {
    setLoading(true);

    const redirectUriOnSuccess = makeRedirectUri({
      path: '/home?loggedOut=true',
    });

    const logoutUrl = `https://www.coworking-metz.fr/mon-compte/?logout=true&redirect_to=${redirectUriOnSuccess}`;
    logoutLogger.debug('Opening logout uri', logoutUrl);

    (async () => {
      if (Platform.OS === 'ios') {
        return openAuthSessionAsync(logoutUrl).then((result) => {
          logoutLogger.debug('openAuthSessionAsync result', result);
          if (result.type === 'success') {
            const url = (result as WebBrowserRedirectResult).url || redirectUriOnSuccess;
            return Linking.openURL(url);
          }
        });
      }

      return Linking.openURL(logoutUrl);
    })()
      .catch((error) => {
        notifyError(t('errors.default.message'), error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [notifyError, t]);

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col w-full px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <ExitDoorAnimation style={tw`h-56 w-full`} />
        </View>
        <AppText
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('auth.logout.title')}
        </AppText>
        <AppText style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('auth.logout.description')}
        </AppText>
        <AppRoundedButton
          disabled={isLoading}
          loading={isLoading}
          style={tw`mt-6 w-full max-w-md self-center`}
          suffixIcon="open-in-new"
          onPress={onLogout}>
          <AppText style={tw`text-base text-black font-medium`}>{t('actions.logout')}</AppText>
        </AppRoundedButton>
        <Link asChild href={`/settings?loggedOut=true}`}>
          <AppTextButton style={tw`mt-4`}>
            <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
              {t('auth.logout.forceLogout')}
            </AppText>
          </AppTextButton>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default LogoutBottomSheet;
