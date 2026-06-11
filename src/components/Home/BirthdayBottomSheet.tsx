import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import { isNil } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Confetti } from 'react-native-fast-confetti';
import tw from 'twrnc';
import BirthdayCakeAnimation from '@/components/Animations/BirthdayCakeAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';

const BirthdayBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
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
    <AppBottomSheet ref={forwardedRef} style={style} onClose={onClose}>
      <Confetti autoplay isInfinite={false} onAnimationStart={onConfettiStart} />
      <View style={tw`mt-6 flex h-40 items-center justify-center overflow-visible`}>
        <BirthdayCakeAnimation style={tw`-mb-6 h-72 w-full`} />
      </View>
      <View style={[tw`flex flex-col px-6`]}>
        <AppText
          style={tw`mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('home.profile.birthday.title')}
        </AppText>
        <AppText
          style={tw`mt-4 w-full text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {t('home.profile.birthday.description')}
        </AppText>
        <AppRoundedButton
          disabled={isClaiming}
          label={t('home.profile.birthday.claim')}
          loading={isClaiming}
          style={tw`mt-6 w-full max-w-sm self-center`}
          suffixIcon="gift-open-outline"
          onPress={onClaimGift}
        />
      </View>
    </AppBottomSheet>
  );
};

export default forwardRef(BirthdayBottomSheet);
