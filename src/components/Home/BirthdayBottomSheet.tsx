import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import { isNil } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { Confetti } from 'react-native-fast-confetti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import BirthdayCakeAnimation from '@/components/Animations/BirthdayCakeAnimation';
import AppBottomSheet, { MIN_PADDING_BOTTOM } from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';

const BirthdayBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const settingsStore = useSettingsStore();
  const noticeStore = useNoticeStore();
  const [isClaiming, setClaiming] = useState(false);

  const onConfettiStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    if (isNil(settingsStore.hasSeenBirthdayPresentAt)) {
      useSettingsStore.setState({ hasSeenBirthdayPresentAt: dayjs().toISOString() });
    }
  }, [settingsStore]);

  const onClaimGift = useCallback(() => {
    setClaiming(true);
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Not implemented yet'));
      }, 1000);
    })
      .catch(async (error) => {
        const description = await parseErrorText(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        noticeStore.add({
          message: t('home.profile.birthday.onClaim.fail'),
          description,
          type: 'error',
        });
      })
      .finally(() => {
        setClaiming(false);
      });
  }, [noticeStore, t]);

  return (
    <AppBottomSheet contentContainerStyle={tw`pb-0`} style={style} onClose={onClose}>
      <Confetti autoplay isInfinite={false} onAnimationStart={onConfettiStart} />
      <View style={tw`mt-6 flex items-center justify-center h-40 overflow-visible`}>
        <BirthdayCakeAnimation style={tw`h-72 -mb-6 w-full`} />
      </View>
      <View
        style={[
          tw`flex flex-col px-6`,
          { paddingBottom: Math.max(insets.bottom, MIN_PADDING_BOTTOM) },
        ]}>
        <AppText
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('home.profile.birthday.label')}
        </AppText>
        <AppText style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('home.profile.birthday.description')}
        </AppText>
        <AppRoundedButton
          disabled={isClaiming}
          loading={isClaiming}
          style={tw`mt-6 h-14 w-full max-w-md self-center`}
          suffixIcon="gift-open-outline"
          onPress={onClaimGift}>
          <AppText style={tw`text-base text-black font-medium`}>
            {t('home.profile.birthday.claim')}
          </AppText>
        </AppRoundedButton>
      </View>
    </AppBottomSheet>
  );
};

export default BirthdayBottomSheet;
