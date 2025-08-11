import ActionableIcon from './ActionableIcon';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { turnOffLight, turnOnLight } from '@/services/api/services';
import useToastStore from '@/stores/toast';

const ActionableLight = ({
  id,
  loading = false,
  active = false,
  style,
}: {
  id: string;
  loading?: boolean;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
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
      .finally(() => setUpdating(false));
  }, [id, active, isActive]);

  return (
    <ActionableIcon
      active={isActive}
      activeIcon="ceiling-light"
      iconStyle={animatedStyle}
      inactiveIcon="ceiling-light-outline"
      loading={loading}
      pending={isUpdating}
      style={style}
      onPress={toggle}
    />
  );
};

export default ActionableLight;
