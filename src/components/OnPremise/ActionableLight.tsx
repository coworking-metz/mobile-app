import ActionableIcon from './ActionableIcon';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type StyleProps,
} from 'react-native-reanimated';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { turnOffLight, turnOnLight } from '@/services/api/services';
import useToastStore from '@/stores/toast';

const ActionableLight = ({
  id,
  active = false,
  style,
}: {
  id: string;
  active?: boolean;
  style?: StyleProps;
}) => {
  const toastStore = useToastStore();
  const [isActive, setActive] = useState(active);
  const [isLoading, setLoading] = useState(false);

  const xTranslation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xTranslation.value }],
  }));

  const toggle = useCallback(() => {
    setLoading(true);
    toastStore.dismissAll();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      .finally(() => setLoading(false));
  }, [id, active, isActive]);

  return (
    <ActionableIcon
      active={isActive}
      activeIcon="ceiling-light"
      iconStyle={animatedStyle}
      inactiveIcon="ceiling-light-outline"
      loading={isLoading}
      style={style}
      onPress={toggle}
    />
  );
};

export default ActionableLight;
