import React, { useCallback, useRef } from 'react';
import {
  runOnJS,
  useDerivedValue,
  type SharedValue,
  type StyleProps,
} from 'react-native-reanimated';
import Rive, { Alignment, Fit, type RiveRef } from 'rive-react-native';

const STATE_MACHINE_NAME = 'Pull Release Ani';

const SunnyRefreshAnimation = ({
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
    riveRef.current?.reset();
  }, [riveRef.current]);

  const setPullProgress = useCallback(
    (progress: number) => {
      riveRef.current?.setInputState(STATE_MACHINE_NAME, 'Pull_Progress', progress);
    },
    [riveRef.current],
  );

  const onRelease = useCallback(() => {
    riveRef.current?.fireState(STATE_MACHINE_NAME, 'Release_Pull');
  }, [riveRef.current]);

  const onComplete = useCallback(() => {
    onEnd?.();
  }, [onEnd]);

  useDerivedValue(() => {
    if (pullProgress?.value) {
      runOnJS(setPullProgress)(pullProgress.value);
    } else {
      runOnJS(onReset)();
    }
  }, [pullProgress]);

  useDerivedValue(() => {
    if (released?.value) {
      runOnJS(onRelease)();
    }
  }, [released]);

  useDerivedValue(() => {
    if (completed?.value) {
      runOnJS(onComplete)();
    }
  }, [completed]);

  return (
    <Rive
      ref={riveRef}
      alignment={Alignment.TopCenter}
      artboardName="Scene File"
      fit={Fit.Cover}
      resourceName="sunny_pull_release"
      stateMachineName={STATE_MACHINE_NAME}
      style={style}
      // url="https://public.rive.app/community/runtime-files/3838-8030-pull-release-animation.riv"
    />
  );
};

export default SunnyRefreshAnimation;
