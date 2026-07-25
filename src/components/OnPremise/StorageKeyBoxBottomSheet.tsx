import AppIcon from '../AppIcon';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, ForwardRefRenderFunction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOutDown } from 'react-native-reanimated';
import { RandomReveal } from 'react-random-reveal';
import tw from 'twrnc';
import CatInABoxAnimation from '@/components/Animations/CatInABoxAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { handleSilentError } from '@/helpers/error';
import { getStorageKeyBoxCode } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const StorageKeyBoxBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const noticeStore = useNoticeStore();
  const [code, setCode] = useState<number | null>(null);
  const [isFetching, setFetching] = useState(false);

  const onFetchCode = useCallback(() => {
    setFetching(true);
    getStorageKeyBoxCode()
      .then(({ code: fetchedCode }) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCode(fetchedCode);
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('onPremise.keyBoxes.storage.onFetch.fail'),
        }),
      )
      .finally(() => setFetching(false));
  }, [noticeStore]);

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch gap-4 p-6`, style]}
      onClose={onClose}>
      <CatInABoxAnimation autoPlay loop={false} style={tw`h-[144px] w-full`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.keyBoxes.storage.label')}
      </AppText>
      <AppText style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('onPremise.keyBoxes.storage.description')}
      </AppText>

      {code ? (
        <AppText
          entering={FadeIn.delay(100)}
          style={tw`mt-2 h-14 text-center text-5xl font-bold leading-[3.5rem] tracking-widest text-slate-900 dark:text-gray-200`}>
          <RandomReveal
            isPlaying
            characters={`${code}`}
            characterSet={Array.from({ length: 10 }, (_, index) => index.toString())}
            duration={2}
          />
        </AppText>
      ) : (
        <Animated.View exiting={FadeOutDown} style={tw`w-full`}>
          <AppRoundedButton
            disabled={!user?.capabilities?.includes('STORAGE_KEYS_ACCESS')}
            label={t('onPremise.keyBoxes.storage.fetch')}
            loading={isFetching}
            style={tw`mt-2 w-full max-w-sm self-center`}
            onPress={onFetchCode}
          />
        </Animated.View>
      )}
      {!user?.capabilities?.includes('STORAGE_KEYS_ACCESS') && (
        <View style={tw`mt-3 flex flex-row items-start gap-3 overflow-hidden`}>
          <AppIcon
            color={tw.color('yellow-500')}
            icon="alert-octagon"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText
            style={tw`shrink grow basis-0 text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {t('onPremise.keyBoxes.storage.missingCapability')}
          </AppText>
        </View>
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(StorageKeyBoxBottomSheet);
