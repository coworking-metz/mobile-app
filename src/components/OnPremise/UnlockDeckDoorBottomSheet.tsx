import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { FadeInLeft, FadeOutLeft, useReducedMotion } from 'react-native-reanimated';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import UnlockAnimation from '@/components/Animations/UnlockAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import SwipeableButton from '@/components/SwipeableButton';
import { handleSilentError } from '@/helpers/error';
import { unlockDeckDoor } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const UnlockDeckDoorBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    unlocked?: boolean;
  }
> = ({ style, unlocked = false, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const noticeStore = useNoticeStore();
  const animation = useRef<LottieView>(null);
  const reduceMotion = useReducedMotion();
  const [isUnlocked, setUnlocked] = useState(unlocked);
  const [isLoading, setLoading] = useState(false);
  const [hasSwiped, setSwiped] = useState(false);

  useEffect(() => {
    setUnlocked(unlocked);
  }, [unlocked]);

  const animateLock = useCallback(() => {
    if (animation.current && !reduceMotion) {
      animation.current.play(0, 33);
    }
  }, [animation.current, reduceMotion]);

  const animateUnlock = useCallback(() => {
    if (animation.current && !reduceMotion) {
      animation.current.play(30, 120);
    }
  }, [animation.current, reduceMotion]);

  const onUnlock = useCallback(() => {
    setLoading(true);
    setSwiped(true);
    unlockDeckDoor()
      .then(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setUnlocked(true);
        animateUnlock();
      })
      .catch(handleSilentError)
      .catch((error) =>
        noticeStore.addError(error, {
          message: t('onPremise.deckDoor.onUnlock.fail'),
        }),
      )
      .finally(() => setLoading(false));
  }, [noticeStore]);

  const onReset = useCallback(() => {
    setSwiped(false);
    setUnlocked(false);
    animateLock();
  }, [animateLock]);

  const onWillPresent = useCallback(() => {
    if (isUnlocked) {
      animateUnlock();
    } else {
      animateLock();
    }
  }, [isUnlocked, animateLock, animateUnlock]);

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex flex-col gap-4 p-6`, style]}
      onClose={onClose}
      onWillPresent={onWillPresent}>
      <UnlockAnimation
        ref={animation}
        autoPlay={false}
        loop={false}
        progress={reduceMotion ? 0.25 : 0}
        style={tw`w-full h-[144px]`}
      />
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.deckDoor.label')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 w-full`}>
        {t('onPremise.deckDoor.description')}
      </AppText>
      <SwipeableButton
        disabled={!user?.capabilities.includes('UNLOCK_DECK_DOOR')}
        loading={isLoading}
        placeholder={t('onPremise.deckDoor.slideToUnlock')}
        style={tw`w-full mt-3 max-w-80 self-center`}
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
          ) : hasSwiped && isUnlocked ? (
            <AppText
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              style={tw`absolute left-8 text-base text-left font-medium text-black`}>
              {t('onPremise.deckDoor.onUnlock.success')}
            </AppText>
          ) : hasSwiped ? (
            <AppText
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              style={tw`absolute left-8 text-base text-left font-medium text-black`}>
              {t('onPremise.deckDoor.retry')}
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

export default forwardRef(UnlockDeckDoorBottomSheet);
