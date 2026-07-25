import * as Haptics from 'expo-haptics';
import React, { forwardRef, ForwardRefRenderFunction, useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOutDown } from 'react-native-reanimated';
import { RandomReveal } from 'react-random-reveal';
import tw from 'twrnc';
import MeetingRoomAnimation from '@/components/Animations/MeetingRoomAnimation';
import AppAlert from '@/components/AppAlert';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { handleSilentError } from '@/helpers/error';
import { getHubKeyBoxCode } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const MeetingRoomHubBottomSheet: ForwardRefRenderFunction<
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
    getHubKeyBoxCode()
      .then(({ code: fetchedCode }) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCode(fetchedCode);
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('onPremise.meetingRooms.hub.onFetch.fail'),
        }),
      )
      .finally(() => setLoading(false));
  }, [noticeStore]);

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col items-stretch gap-4 p-6`, style]}
      onClose={onClose}>
      <MeetingRoomAnimation autoPlay loop={false} style={tw`-my-6 h-[256px] w-full`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.meetingRooms.hub.label')}
      </AppText>
      <Trans
        components={[
          <AppText key="emphasis" style={tw`font-medium text-slate-900 dark:text-gray-200`} />,
        ]}
        defaults={t('onPremise.meetingRooms.hub.description')}
        parent={AppText}
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
      />

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
            disabled={!user?.capabilities?.includes('KEYS_ACCESS')}
            label={t('onPremise.meetingRooms.hub.fetch')}
            loading={isLoading}
            style={tw`mt-2 w-full max-w-sm self-center`}
            onPress={onFetchCode}
          />
        </Animated.View>
      )}
      {!user?.capabilities?.includes('KEYS_ACCESS') && (
        <AppAlert
          description={t('onPremise.keyBoxes.missingCapability')}
          style={tw`mt-3`}
          type="warning"
        />
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(MeetingRoomHubBottomSheet);
