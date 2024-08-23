import ActionableIcon from './ActionableIcon';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type StyleProps,
} from 'react-native-reanimated';
import { ToastPresets } from 'react-native-ui-lib';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { turnOffFan, turnOnFan } from '@/services/api/services';
import useToastStore from '@/stores/toast';

const ActionableFan = ({
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

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }),
    [rotation],
  );

  useEffect(() => {
    if (isActive) {
      cancelAnimation(rotation);
      rotation.value = 0;
      rotation.value = withSequence(
        withTiming(180, {
          easing: Easing.in(Easing.ease),
          duration: 1200,
        }),
        withRepeat(
          withTiming(360, {
            easing: Easing.linear,
            duration: 600,
          }),
          Infinity,
        ),
      );
    } else if (rotation.value > 0) {
      cancelAnimation(rotation);
      rotation.value = 0;
      rotation.value = withTiming(360, {
        easing: Easing.out(Easing.ease),
        duration: 2000,
      });
    }
  }, [isActive]);

  const toggle = useCallback(() => {
    setLoading(true);
    toastStore.dismissAll();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    (isActive ? turnOffFan(id) : turnOnFan(id))
      .then(({ state }) => setActive(state === 'on'))
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
  }, [id, active, isActive]);

  return (
    <ActionableIcon
      active={isActive}
      activeIcon="fan"
      iconStyle={animatedStyle}
      inactiveIcon="fan"
      loading={isLoading}
      style={style}
      onPress={toggle}
    />
  );
};

export default ActionableFan;
