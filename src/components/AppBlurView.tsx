import { BlurView, type BlurViewProps } from 'expo-blur';
import React from 'react';
import { Platform, View } from 'react-native';

const AppBlurView = ({ children, style, tint, intensity, ...props }: BlurViewProps) => {
  if (Platform.OS === 'android') {
    return (
      <View
        // eslint-disable-next-line tailwindcss/classnames-order, tailwindcss/no-custom-classname
        style={[
          {
            backgroundColor:
              tint === 'dark'
                ? `rgba(0, 0, 0, ${0.1 + (intensity || 0) / 100})`
                : `rgba(255, 255, 255, ${0.65 + (intensity || 0) / 300})`,
          },
          style,
        ]}
        {...props}>
        {children}
      </View>
    );
  }
  return (
    <BlurView intensity={intensity} style={style} tint={tint} {...props}>
      {children}
    </BlurView>
  );
};

export default AppBlurView;
