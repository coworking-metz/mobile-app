import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, ForwardRefRenderFunction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOutDown } from 'react-native-reanimated';
import { RandomReveal } from 'react-random-reveal';
import tw from 'twrnc';
import KeysPairAnimation from '@/components/Animations/KeysPairAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { handleSilentError } from '@/helpers/error';
import { getPoulaillerKeyBoxCode } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const PoulaillerKeyBoxBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps
> = ({ style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const noticeStore = useNoticeStore();
  const [code, setCode] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);

  const onFetchCode = useCallback(() => {
    setLoading(true);
    getPoulaillerKeyBoxCode()
      .then(({ code: fetchedCode }) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCode(fetchedCode);
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('onPremise.keyBoxes.poulailler.onFetch.fail'),
        }),
      )
      .finally(() => setLoading(false));
  }, [noticeStore]);

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch p-6`, style]}
      onClose={onClose}>
      <KeysPairAnimation loop={false} style={tw`w-full h-[144px]`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
        {t('onPremise.keyBoxes.poulailler.label')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 mt-4`}>
        {t('onPremise.keyBoxes.poulailler.description')}
      </AppText>

      {code ? (
        <AppText
          entering={FadeIn.delay(100)}
          style={tw`h-14 mt-5 text-center text-slate-900 dark:text-gray-200 text-5xl font-bold tracking-widest leading-[3.5rem]`}>
          <RandomReveal
            isPlaying
            characters={`${code}`}
            characterSet={Array.from({ length: 10 }, (_, index) => index.toString())}
            duration={2}
          />
        </AppText>
      ) : (
        <Animated.View exiting={FadeOutDown} style={tw`w-full mt-2`}>
          <AppRoundedButton
            disabled={!user?.capabilities?.includes('KEYS_ACCESS')}
            loading={isLoading}
            style={tw`mt-2 w-full max-w-sm self-center`}
            onPress={onFetchCode}>
            <AppText style={tw`text-base font-medium`}>
              {t('onPremise.keyBoxes.poulailler.fetch')}
            </AppText>
          </AppRoundedButton>
        </Animated.View>
      )}

      {!user?.capabilities?.includes('KEYS_ACCESS') && (
        <View style={tw`flex flex-row items-start flex-gap-2 mt-3 overflow-hidden`}>
          <MaterialCommunityIcons
            color={tw.color('yellow-500')}
            iconStyle={tw`h-6 w-6 mr-0`}
            name="alert"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText
            style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 shrink grow basis-0`}>
            {t('onPremise.keyBoxes.missingCapability')}
          </AppText>
        </View>
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(PoulaillerKeyBoxBottomSheet);
