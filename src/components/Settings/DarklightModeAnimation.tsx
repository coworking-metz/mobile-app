import * as Haptics from 'expo-haptics';
import { includes } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';
import { Alignment, Fit, type RiveRef } from 'rive-react-native';
import RiveAnimation from '@/components/RiveAnimation';

const STATE_MACHINE_NAME = 'Button_Animation' as const;

const DarklightModeAnimation = ({
  mode,
  style,
}: {
  mode?: 'light' | 'dark' | null;
  style?: ViewStyle;
}) => {
  const riveRef = useRef<RiveRef>(null);

  const onStateChanged = useCallback(
    (_state: string, event: string) => {
      if (riveRef.current && includes(['Day/Night_Click', 'Night/Day_Click'], event)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [riveRef.current],
  );

  useEffect(() => {
    if (mode === 'light') {
      setTimeout(() => {
        requestAnimationFrame(() => {
          riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isDark', false);
        });
      }, 100);
    } else if (mode === 'dark') {
      setTimeout(() => {
        requestAnimationFrame(() => {
          riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isDark', true);
        });
      }, 100);
    }
  }, [riveRef, mode]);

  return (
    <RiveAnimation
      ref={riveRef}
      alignment={Alignment.Center}
      artboardName="Artboard"
      fit={Fit.Cover}
      source={require('@/assets/rive/dark_light_mode_switch.riv')}
      stateMachineName={STATE_MACHINE_NAME}
      style={style}
      onStateChanged={onStateChanged}
      // url="https://public.rive.app/community/runtime-files/8771-16784-darklight-mode-switch.riv"
    />
  );
};

export default DarklightModeAnimation;
