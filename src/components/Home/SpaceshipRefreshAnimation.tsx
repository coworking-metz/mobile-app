import React, { useCallback, useRef } from 'react';
import { ViewStyle } from 'react-native';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Alignment, Fit, type RiveRef } from 'rive-react-native';
import RiveAnimation from '@/components/RiveAnimation';

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
  style?: ViewStyle;
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
    if (released?.get()) {
      scheduleOnRN(setPullProgress, 101);
    } else if (pullProgress?.get() && pullProgress.get() > 1) {
      scheduleOnRN(setPullProgress, Math.min(pullProgress.get() / 4, 99));
    } else {
      scheduleOnRN(onReset);
    }
  }, [pullProgress, released]);

  useDerivedValue(() => {
    if (completed) {
      scheduleOnRN(onComplete);
    }
  }, [completed]);

  return (
    <RiveAnimation
      ref={riveRef}
      alignment={Alignment.TopCenter}
      artboardName="New Artboard"
      fit={Fit.Cover}
      source={require('@/assets/rive/spaceship_pull_to_refresh.riv')} // eslint-disable-line @typescript-eslint/no-require-imports
      stateMachineName={STATE_MACHINE_NAME}
      style={style}
      // url="https://public.rive.app/community/runtime-files/3146-6725-pull-to-refresh.riv"
      onStateChanged={onStateChanged}
    />
  );
};

export default SpaceshipRefreshAnimation;
