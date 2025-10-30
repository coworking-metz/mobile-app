import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader, FaderProps } from 'react-native-ui-lib';
import tw from 'twrnc';

type AppFaderProps = FaderProps & {
  style?: StyleProp<ViewStyle>;
};

const AppFader = ({ style, ...faderProps }: AppFaderProps) => {
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

export const AppTopFader = (props: AppFaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <AppFader
      position={Fader.position.TOP}
      size={(insets.top || (Platform.OS === 'android' ? 16 : 0)) + 32}
      tintColor={tw.prefixMatch('dark') ? tw.color('black/25') : tw.color('white/40')}
      {...props}
    />
  );
};
