import UnlockAnimation from '../Animations/UnlockAnimation';
import AppBottomSheet from '../AppBottomSheet';
import SwipeableButton from '../SwipeableButton';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text } from 'react-native';
import Animated, { FadeInLeft, FadeOutLeft, type StyleProps } from 'react-native-reanimated';
import { ToastPresets } from 'react-native-ui-lib';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { unlockDeckDoor } from '@/services/api/services';
import useToastStore from '@/stores/toast';

const UnlockDeckDoorBottomSheet = ({
  style,
  unlocked = false,
  onClose,
}: {
  unlocked?: boolean;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const toastStore = useToastStore();
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
        const errorMessage = await parseErrorText(error);
        toastStore.add({
          message: errorMessage,
          type: ToastPresets.FAILURE,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      })
      .finally(() => setLoading(false));
  }, [toastStore]);

  const onReset = useCallback(() => {
    toastStore.dismissAll();
    setUnlocked(false);
  }, []);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-center gap-4 px-6 py-4`}
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <UnlockAnimation
        ref={animation}
        autoPlay={false}
        loop={false}
        style={tw`w-full max-h-[144px]`}
      />
      <Text
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.door.label')}
      </Text>
      <Text style={tw`text-center text-base font-normal text-slate-500 w-full`}>
        {t('onPremise.door.description')}
      </Text>
      <SwipeableButton
        disabled={isLoading}
        loading={isLoading}
        placeholder={t('onPremise.door.slideToUnlock')}
        style={tw`w-full mt-4`}
        swiped={isUnlocked}
        onReset={onReset}
        onSwiped={onUnlock}>
        <>
          {isLoading ? (
            <Animated.Text
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              style={[tw`absolute left-8 text-base text-left font-medium text-black`]}>
              {t('onPremise.door.loading')}
            </Animated.Text>
          ) : null}
          {isUnlocked ? (
            <Animated.Text
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutLeft.duration(300)}
              style={[tw`absolute left-8 text-base text-left font-medium text-black`]}>
              {t('onPremise.door.unlocked')}
            </Animated.Text>
          ) : null}
        </>
      </SwipeableButton>
    </AppBottomSheet>
  );
};

export default UnlockDeckDoorBottomSheet;
