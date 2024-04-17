import React, { useCallback, useRef } from 'react';
import {
  runOnJS,
  useDerivedValue,
  type SharedValue,
  type StyleProps,
} from 'react-native-reanimated';
import Rive, { Alignment, Fit, type RiveRef } from 'rive-react-native';

const STATE_MACHINE_NAME = 'Motion';

const SpaceshipRefreshAnimation = ({
  pullProgress,
  released,
  completed,
  onEnd,
  style,
}: {
  pullProgress?: SharedValue<number>;
  released?: SharedValue<boolean>;
  completed?: SharedValue<boolean>;
  onEnd?: () => void;
  style?: StyleProps;
}) => {
  const riveRef = useRef<RiveRef>(null);

  const onReset = useCallback(() => {
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numLoad', 0);
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numDrag', 0);
    riveRef.current?.stop();
  }, [riveRef.current]);

  const onComplete = useCallback(() => {
    riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numLoad', 100);
  }, [riveRef.current]);

  const onStateChanged = useCallback(
    (stateMachineName: string, stateName: string) => {
      if (stateMachineName === STATE_MACHINE_NAME && stateName === 'End') {
        setTimeout(() => onEnd?.(), 1000);
      }
    },
    [onEnd],
  );

  const setPullProgress = useCallback(
    (progress: number) => {
      riveRef.current?.setInputState(STATE_MACHINE_NAME, 'numDrag', progress);
    },
    [riveRef.current],
  );

  useDerivedValue(() => {
    if (released?.value) {
      runOnJS(setPullProgress)(101);
    } else if (pullProgress?.value) {
      runOnJS(setPullProgress)(Math.min(pullProgress.value / 4, 99));
    } else {
      runOnJS(onReset)();
    }
  }, [pullProgress, released]);

  useDerivedValue(() => {
    if (completed) {
      runOnJS(onComplete)();
    }
  }, [completed]);

  return (
    <Rive
      ref={riveRef}
      alignment={Alignment.TopCenter}
      artboardName="New Artboard"
      fit={Fit.Cover}
      resourceName="spaceship_pull_to_refresh"
      stateMachineName={STATE_MACHINE_NAME}
      style={style}
      // url="https://public.rive.app/community/runtime-files/3146-6725-pull-to-refresh.riv"
      onStateChanged={onStateChanged}
    />
  );
};

export default SpaceshipRefreshAnimation;
