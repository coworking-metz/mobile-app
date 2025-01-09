import React, { useEffect, useRef } from 'react';
import { type StyleProps } from 'react-native-reanimated';
import Rive, { Alignment, Fit, type RiveRef } from 'rive-react-native';

const STATE_MACHINE_NAME = 'Button_Animation';

const DarklightModeAnimation = ({
  mode,
  style,
}: {
  mode?: 'light' | 'dark' | null;
  style?: StyleProps;
}) => {
  const riveRef = useRef<RiveRef>(null);

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
    // url="https://public.rive.app/community/runtime-files/8771-16784-darklight-mode-switch.riv"
    />
  );
};

export default DarklightModeAnimation;
