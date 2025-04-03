import { matchFont } from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { TextProps as RNTextProps, TextInputProps } from 'react-native';

/**
 * Taken from https://wcandillon.gitbook.io/redash/strings#less-than-retext-greater-than
 * TODO: should move over to https://docs.expo.dev/versions/latest/sdk/skia/
 * to animate text instead once this PR is merged https://github.com/Shopify/react-native-skia/pull/1717
 */

const styles = StyleSheet.create({
  baseStyle: {
    color: 'black',
  },
});

Animated.addWhitelistedNativeProps({ text: true });

interface TextProps extends Omit<TextInputProps, 'value' | 'style'> {
  text: Animated.SharedValue<string>;
  style?: Animated.AnimateProps<RNTextProps>['style'];
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
      style={[styles.baseStyle, style || undefined]}
      underlineColorAndroid="transparent"
      value={text.value}
      {...rest}
      {...{ animatedProps }}
    />
  );
};

export default ReanimatedText;
