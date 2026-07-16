import ActionableIcon, { ActionableIconProps } from './ActionableIcon';
import React, { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

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
