import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTrueSheet } from '@lodev09/react-native-true-sheet';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, ForwardRefRenderFunction, useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOutDown } from 'react-native-reanimated';
import { RandomReveal } from 'react-random-reveal';
import tw from 'twrnc';
import WifiNetworkAnimation from '@/components/Animations/WifiNetworkAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextLink from '@/components/AppTextLink';
import SectionTitle from '@/components/Layout/SectionTitle';
import { handleSilentError } from '@/helpers/error';
import { getWifiCredentials } from '@/services/api/services';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const WifiBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const trueSheet = useTrueSheet();
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
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
      onClose={onClose}>
      <View style={tw`mb-2 flex h-40 items-center justify-center overflow-visible`}>
        <WifiNetworkAnimation autoPlay loop={false} style={tw`size-full`} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.wifi.label')}
      </AppText>

      <Trans
        components={[
          <AppTextLink
            href={`/devices`}
            key="add-device-link"
            style={tw`text-amber-500`}
            onPress={() => trueSheet.dismissAll()}
          />,
          <AppTextLink
            href={`${WORDPRESS_BASE_URL}/mon-compte/appareils`}
            key="add-device-through-website-link"
            style={tw`text-amber-500`}
            target="_blank"
          />,
        ]}
        defaults={t('onPremise.wifi.description')}
        parent={AppText}
        style={tw`mt-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
      />

      {ssid || password ? (
        <Animated.View entering={FadeIn.delay(100)} style={tw`my-3 flex flex-col`}>
          <SectionTitle title={t('onPremise.wifi.credentials.ssid.label')} />
          <AppText style={tw`text-left text-2xl font-bold text-slate-900 dark:text-gray-200`}>
            {ssid && <RandomReveal isPlaying characters={ssid} duration={2} />}
          </AppText>

          <SectionTitle style={tw`mt-3`} title={t('onPremise.wifi.credentials.password.label')} />
          <AppText style={tw`text-left text-2xl font-bold text-slate-900 dark:text-gray-200`}>
            {password && <RandomReveal isPlaying characters={password} duration={2} />}
          </AppText>
        </Animated.View>
      ) : (
        <Animated.View exiting={FadeOutDown} style={tw`mt-2 w-full`}>
          <AppRoundedButton
            disabled={!user?.capabilities?.includes('WIFI_CREDENTIALS_ACCESS')}
            label={t('onPremise.wifi.credentials.fetch')}
            loading={isLoading}
            style={tw`mt-3 w-full max-w-sm self-center`}
            onPress={onFetchPassword}
          />
        </Animated.View>
      )}

      {!user?.capabilities?.includes('WIFI_CREDENTIALS_ACCESS') && (
        <View style={tw`mt-3 flex flex-row items-start gap-2 overflow-hidden`}>
          <MaterialCommunityIcons
            color={tw.color('yellow-500')}
            iconStyle={tw`mr-0 size-6`}
            name="alert"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText
            style={tw`shrink grow basis-0 text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {t('onPremise.wifi.credentials.missingCapability')}
          </AppText>
        </View>
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(WifiBottomSheet);
