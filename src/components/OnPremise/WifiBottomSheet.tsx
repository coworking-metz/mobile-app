import AppRoundedButton from '../AppRoundedButton';
import AppTextLink from '../AppTextLink';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import Animated, { FadeIn, FadeOutDown } from 'react-native-reanimated';
import { RandomReveal } from 'react-random-reveal';
import tw from 'twrnc';
import WifiNetworkAnimation from '@/components/Animations/WifiNetworkAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import { handleSilentError } from '@/helpers/error';
import { getWifiCredentials } from '@/services/api/services';
import { WORDPRESS_BASE_URL } from '@/services/environment';
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
  const [password, setPassword] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const onFetchPassword = useCallback(() => {
    setLoading(true);
    getWifiCredentials()
      .then(({ password: fetchedPassword }) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPassword(fetchedPassword);
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
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mb-6`}>
        {t('onPremise.wifi.label')}
      </AppText>

      <ReadMore
        numberOfLines={3}
        renderRevealedFooter={(handlePress) => (
          <AppText style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
            {t('actions.hide')}
          </AppText>
        )}
        renderTruncatedFooter={(handlePress) => (
          <AppText style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
            {t('actions.readMore')}
          </AppText>
        )}>
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
      </ReadMore>

      {password ? (
        <AppText
          entering={FadeIn.delay(100)}
          style={tw`h-14 mt-3 text-center text-slate-900 dark:text-gray-200 text-5xl font-bold leading-[3.5rem]`}>
          <RandomReveal isPlaying characters={password} duration={2} />
        </AppText>
      ) : (
        <Animated.View exiting={FadeOutDown} style={tw`w-full`}>
          <AppRoundedButton
            disabled={!user?.capabilities?.includes('WIFI_CREDENTIALS')}
            loading={isLoading}
            style={tw`mt-3 w-full max-w-md self-center`}
            onPress={onFetchPassword}>
            <AppText style={tw`text-base font-medium`}>
              {t('onPremise.wifi.credentials.fetch')}
            </AppText>
          </AppRoundedButton>
        </Animated.View>
      )}

      {!user?.capabilities?.includes('WIFI_CREDENTIALS') && (
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
    </AppBottomSheet>
  );
};

export default WifiBottomSheet;
