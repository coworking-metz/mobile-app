import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Fader, FaderProps } from 'react-native-ui-lib';

const AppFader = ({
  style,
  ...faderProps
}: FaderProps & {
  style?: StyleProp<ViewStyle>;
}) => {
  const [reduceTransparencyEnabled, setReduceTransparencyEnabled] = useState(false);

  useEffect(() => {
    const reduceTransparencyChangedSubscription = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      (isReduceTransparencyEnabled) => {
        setReduceTransparencyEnabled(isReduceTransparencyEnabled);
      },
    );

    AccessibilityInfo.isReduceTransparencyEnabled().then((isReduceTransparencyEnabled) => {
      setReduceTransparencyEnabled(isReduceTransparencyEnabled);
    });

    return () => {
      reduceTransparencyChangedSubscription.remove();
    };
  }, []);

  return !reduceTransparencyEnabled ? (
    <Animated.View style={style}>
      <Fader {...faderProps} />
    </Animated.View>
  ) : null;
};

export default AppFader;
