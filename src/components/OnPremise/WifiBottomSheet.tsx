import AppRoundedButton from '../AppRoundedButton';
import AppTextLink from '../AppTextLink';
import SectionTitle from '../Layout/SectionTitle';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOutDown } from 'react-native-reanimated';
import { RandomReveal } from 'react-random-reveal';
import tw from 'twrnc';
import WifiNetworkAnimation from '@/components/Animations/WifiNetworkAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import { handleSilentError } from '@/helpers/error';
import { getWifiCredentials } from '@/services/api/services';
import { IS_DEV, WORDPRESS_BASE_URL } from '@/services/environment';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const WifiBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const noticeStore = useNoticeStore();
  const [ssid, setSSID] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const onFetchPassword = useCallback(() => {
    setLoading(true);
    getWifiCredentials()
      .then(({ password: fetchedPassword, ssid: fetchedSSID }) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPassword(fetchedPassword);
        setSSID(fetchedSSID);
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, { message: t('onPremise.wifi.credentials.onFetch.fail') }),
      )
      .finally(() => setLoading(false));
  }, [noticeStore]);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch pt-6 px-6`}
      style={style}
      onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible mb-2`}>
        <WifiNetworkAnimation autoPlay loop={false} style={tw`w-full h-64`} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.wifi.label')}
      </AppText>

      <Trans
        components={[
          <AppTextLink href={`/devices`} key="add-device-link" style={tw`text-amber-500`} />,
          <AppTextLink
            href={`${WORDPRESS_BASE_URL}/mon-compte/appareils`}
            key="add-device-through-website-link"
            style={tw`text-amber-500`}
            target="_blank"
          />,
        ]}
        defaults={t('onPremise.wifi.description')}
        parent={AppText}
        style={tw`text-left text-base font-normal text-slate-500 mt-6`}
      />

      {IS_DEV && (
        <>
          {ssid || password ? (
            <Animated.View entering={FadeIn.delay(100)} style={tw`my-6 flex flex-col`}>
              <SectionTitle title={t('onPremise.wifi.credentials.ssid.label')} />
              <AppText style={tw`text-left text-slate-900 dark:text-gray-200 text-2xl font-bold`}>
                {ssid && <RandomReveal isPlaying characters={ssid} duration={2} />}
              </AppText>

              <SectionTitle
                style={tw`mt-3`}
                title={t('onPremise.wifi.credentials.password.label')}
              />
              <AppText style={tw`text-left text-slate-900 dark:text-gray-200 text-2xl font-bold`}>
                {password && <RandomReveal isPlaying characters={password} duration={2} />}
              </AppText>
            </Animated.View>
          ) : (
            <Animated.View exiting={FadeOutDown} style={tw`w-full`}>
              <AppRoundedButton
                disabled={!user?.capabilities?.includes('WIFI_CREDENTIALS_ACCESS')}
                loading={isLoading}
                style={tw`mt-3 w-full max-w-md self-center`}
                onPress={onFetchPassword}>
                <AppText style={tw`text-base font-medium`}>
                  {t('onPremise.wifi.credentials.fetch')}
                </AppText>
              </AppRoundedButton>
            </Animated.View>
          )}

          {!user?.capabilities?.includes('WIFI_CREDENTIALS_ACCESS') && (
            <View style={tw`flex flex-row items-start flex-gap-2 mt-3 overflow-hidden`}>
              <MaterialCommunityIcons
                color={tw.color('yellow-500')}
                iconStyle={tw`h-6 w-6 mr-0`}
                name="alert"
                size={24}
                style={tw`shrink-0 grow-0`}
              />
              <AppText style={tw`text-base font-normal text-slate-500 shrink grow basis-0`}>
                {t('onPremise.wifi.credentials.missingCapability')}
              </AppText>
            </View>
          )}
        </>
      )}
    </AppBottomSheet>
  );
};

export default WifiBottomSheet;
