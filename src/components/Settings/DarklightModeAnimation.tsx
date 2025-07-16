import * as Haptics from 'expo-haptics';
import { includes } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';
import Rive, { Alignment, Fit, type RiveRef } from 'rive-react-native';

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
    (state: string, event: string) => {
      if (riveRef.current && includes(['Day/Night_Click', 'Night/Day_Click'], event)) {
        console.log('State changed', state, event);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [riveRef.current],
  );

  useEffect(() => {
    if (mode === 'light') {
      riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isDark', false);
    } else if (mode === 'dark') {
      riveRef.current?.setInputState(STATE_MACHINE_NAME, 'isDark', true);
    }
  }, [riveRef.current, mode]);

  return (
    <Rive
      ref={riveRef}
      alignment={Alignment.Center}
      artboardName="Artboard"
      fit={Fit.Cover}
      resourceName="dark_light_mode_switch"
      stateMachineName={STATE_MACHINE_NAME}
      style={style}
      onStateChanged={onStateChanged}
      // url="https://public.rive.app/community/runtime-files/8771-16784-darklight-mode-switch.riv"
    />
  );
};

export default DarklightModeAnimation;
