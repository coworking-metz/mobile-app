import ActionableIcon, { ActionableIconProps } from './ActionableIcon';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { HapticFeedbackType, vibrate } from '@/helpers/haptics';
import { turnOffLight, turnOnLight } from '@/services/api/services';
import useToastStore from '@/stores/toast';

const ActionableLight = ({
  id,
  active = false,
  ...props
}: {
  id: string;
  active?: boolean;
} & Omit<ActionableIconProps, 'icon' | 'activeIcon' | 'iconStyle' | 'onPress'>) => {
  const toastStore = useToastStore();
  const [isActive, setActive] = useState(active);
  const [isUpdating, setUpdating] = useState(false);

  const xTranslation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xTranslation.value }],
  }));

  const toggle = useCallback(() => {
    setUpdating(true);
    toastStore.dismissAll();
    vibrate(HapticFeedbackType.Medium);
    (isActive ? turnOffLight(id) : turnOnLight(id))
      .then(({ state }) => setActive(state === 'on'))
      .catch(handleSilentError)
      .catch(async (error) => {
        const errorMessage = await parseErrorText(error);
        toastStore.add({
          message: errorMessage,
          type: 'error',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        xTranslation.value = withSequence(
          withTiming(-1, { duration: 100 / 2 }),
          withRepeat(withTiming(1, { duration: 100 }), 5, true),
          withTiming(0, { duration: 100 / 2 }),
        );
      })
      .finally(() => setUpdating(false));
  }, [id, active, isActive]);

  return (
    <ActionableIcon
      {...props}
      active={isActive}
      activeIcon="ceiling-light"
      icon="ceiling-light-outline"
      iconStyle={animatedStyle}
      pending={isUpdating}
      onPress={toggle}
    />
  );
};

export default ActionableLight;
