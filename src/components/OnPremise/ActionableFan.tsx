import ActionableIcon, { ActionableIconProps } from './ActionableIcon';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { HapticFeedbackType, vibrate } from '@/helpers/haptics';
import { turnOffFan, turnOnFan } from '@/services/api/services';
import useToastStore from '@/stores/toast';

const ActionableFan = ({
  active = false,
  ...props
}: {
  active?: boolean;
} & Omit<ActionableIconProps, 'icon' | 'activeIcon' | 'iconStyle'>) => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }),
    [rotation],
  );

  useEffect(() => {
    if (active) {
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
  }, [active]);

  return <ActionableIcon active={active} icon="fan" iconStyle={animatedStyle} {...props} />;
};

export default ActionableFan;
