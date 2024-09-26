import ExitDoorAnimation from '../Animations/ExitDoorAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import AppTextButton from '../AppTextButton';
import { makeRedirectUri } from 'expo-auth-session';
import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { useErrorNotification } from '@/helpers/error';
import { log } from '@/helpers/logger';

const logoutLogger = log.extend(`[logout]`);

const LogoutBottomSheet = ({ style, onClose }: { style?: StyleProps; onClose?: () => void }) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const notifyError = useErrorNotification();

  const onLogout = useCallback(() => {
    setLoading(true);

    const redirectUriOnSuccess = makeRedirectUri({
      path: '/settings?loggedOut=true',
    });

    const logoutUrl = `https://www.coworking-metz.fr/mon-compte/deconnexion?redirect_to=${redirectUriOnSuccess}`;
    logoutLogger.debug('Opening logout uri', logoutUrl);

    Linking.openURL(logoutUrl.toString())
      .catch((error) => {
        notifyError(t('errors.default.message'), error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [notifyError, t]);

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <ExitDoorAnimation style={tw`h-56 w-full`} />
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
        <Link asChild href={`/settings?loggedOut=true}`}>
          <AppTextButton style={tw`mt-4`}>
            <Text style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
              {t('auth.logout.forceLogout')}
            </Text>
          </AppTextButton>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default LogoutBottomSheet;
