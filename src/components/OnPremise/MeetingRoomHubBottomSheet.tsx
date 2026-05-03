import MeetingRoomAnimation from '../Animations/MeetingRoomAnimation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, ForwardRefRenderFunction, useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOutDown } from 'react-native-reanimated';
import { RandomReveal } from 'react-random-reveal';
import tw from 'twrnc';
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
      <MeetingRoomAnimation autoPlay loop={false} style={tw`w-full h-[256px] -my-6`} />
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
          style={tw`h-14 mt-2 text-center text-slate-900 dark:text-gray-200 text-5xl font-bold tracking-widest leading-[3.5rem]`}>
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
            loading={isLoading}
            style={tw`mt-2 w-full max-w-sm self-center`}
            onPress={onFetchCode}>
            <AppText style={tw`text-base font-medium`}>
              {t('onPremise.meetingRooms.hub.fetch')}
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

export default forwardRef(MeetingRoomHubBottomSheet);
