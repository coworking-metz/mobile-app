import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import UnlockAnimation from '@/components/Animations/UnlockAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import SwipeableButton from '@/components/SwipeableButton';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { unlockDeckDoor } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const UnlockDeckDoorBottomSheet = ({
  style,
  unlocked = false,
  onClose,
}: {
  unlocked?: boolean;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const noticeStore = useNoticeStore();
  const animation = useRef<LottieView>(null);
  const [isUnlocked, setUnlocked] = useState(unlocked);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (animation.current) {
      if (isUnlocked) {
        animation.current.play(30, 120);
      } else {
        animation.current.play(0, 33);
      }
    }
  }, [animation, isUnlocked]);

  const onUnlock = useCallback(() => {
    setLoading(true);
    unlockDeckDoor()
      .then(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setUnlocked(true);
      })
      .catch(handleSilentError)
      .catch(async (error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('onPremise.deckDoor.onUnlock.fail'),
          description,
          type: 'error',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      })
      .finally(() => setLoading(false));
  }, [noticeStore]);

  const onReset = useCallback(() => {
    setUnlocked(false);
  }, []);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-center gap-4 px-6 pt-6`}
      style={style}
      onClose={onClose}>
      <UnlockAnimation ref={animation} autoPlay={false} loop={false} style={tw`w-full h-[144px]`} />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.deckDoor.label')}
      </AppText>
      <AppText style={tw`text-left text-base font-normal text-slate-500 w-full`}>
        {t('onPremise.deckDoor.description')}
      </AppText>
      <SwipeableButton
        disabled={isLoading || !user?.capabilities.includes('UNLOCK_DECK_DOOR')}
        loading={isLoading}
        placeholder={t('onPremise.deckDoor.slideToUnlock')}
        style={tw`w-full mt-3 max-w-80`}
        swiped={isUnlocked}
        onReset={onReset}
        onSwiped={onUnlock}>
        <>
          {isLoading ? (
            <AppText
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              style={tw`absolute left-8 text-base text-left font-medium text-black`}>
              {t('onPremise.deckDoor.loading')}
            </AppText>
          ) : null}
          {isUnlocked ? (
            <AppText
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              style={tw`absolute left-8 text-base text-left font-medium text-black`}>
              {t('onPremise.deckDoor.onUnlock.success')}
            </AppText>
          ) : null}
        </>
      </SwipeableButton>
      {!user?.capabilities?.includes('UNLOCK_DECK_DOOR') && (
        <View style={tw`flex flex-row items-start flex-gap-2 mt-3 w-full overflow-hidden`}>
          <MaterialCommunityIcons
            color={tw.color('yellow-500')}
            iconStyle={tw`h-6 w-6 mr-0`}
            name="alert"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText style={tw`text-base font-normal text-slate-500 shrink grow basis-0`}>
            {t('onPremise.deckDoor.missingCapability')}
          </AppText>
        </View>
      )}
    </AppBottomSheet>
  );
};

export default UnlockDeckDoorBottomSheet;
