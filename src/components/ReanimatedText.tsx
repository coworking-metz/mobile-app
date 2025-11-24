import React from 'react';
import { Platform } from 'react-native';
import AnimateableText from 'react-native-animateable-text';
import { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import type { StyleProp, TextProps, TextStyle } from 'react-native';
import { withAppFontFamily } from '@/helpers/text';

const ReanimatedText = ({
  text,
  style,
  ...props
}: TextProps & {
  text: SharedValue<string>;
}) => {
  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value,
    };
  });
  return (
    <AnimateableText
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      animatedProps={animatedProps}
      style={
        // numbers are much nicer on Apple SF Pro font
        Platform.OS !== 'ios' ? withAppFontFamily(style as StyleProp<TextStyle>) : style
      }
      {...props}
    />
  );
};

export default ReanimatedText;
