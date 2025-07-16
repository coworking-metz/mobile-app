import React from 'react';
import { Platform, TextInput } from 'react-native';
import Animated, { AnimatedProps, SharedValue, useAnimatedProps } from 'react-native-reanimated';
import type { TextProps as RNTextProps, StyleProp, TextInputProps, TextStyle } from 'react-native';
import { withAppFontFamily } from '@/helpers/text';

/**
 * Taken from https://wcandillon.gitbook.io/redash/strings#less-than-retext-greater-than
 * TODO: should move over to https://docs.expo.dev/versions/latest/sdk/skia/
 * to animate text instead once this PR is merged https://github.com/Shopify/react-native-skia/pull/1717
 */

Animated.addWhitelistedNativeProps({ text: true });

interface TextProps extends Omit<TextInputProps, 'value' | 'style'> {
  text: SharedValue<string>;
  style?: AnimatedProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ReanimatedText = (props: TextProps) => {
  const { style, text, ...rest } = props;

  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value,
      // Here we use any because the text prop is not available in the type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });
  return (
    <AnimatedTextInput
      editable={false}
      style={
        // numbers are much nicer on Apple SF Pro font
        Platform.OS !== 'ios' ? withAppFontFamily(style as StyleProp<TextStyle>) : style
      }
      underlineColorAndroid="transparent"
      value={text.value}
      {...rest}
      {...{ animatedProps }}
    />
  );
};

export default ReanimatedText;
