import { Platform, StyleSheet, TextInput } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { TextProps as RNTextProps, StyleProp, TextInputProps, TextStyle } from 'react-native';
import { getFamilyForWeight } from '@/helpers/text';

/**
 * Taken from https://wcandillon.gitbook.io/redash/strings#less-than-retext-greater-than
 * TODO: should move over to https://docs.expo.dev/versions/latest/sdk/skia/
 * to animate text instead once this PR is merged https://github.com/Shopify/react-native-skia/pull/1717
 */

Animated.addWhitelistedNativeProps({ text: true });

interface TextProps extends Omit<TextInputProps, 'value' | 'style'> {
  text: Animated.SharedValue<string>;
  style?: Animated.AnimateProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ReanimatedText = (props: TextProps) => {
  const { style, text, ...rest } = props;
  const flattenedStyle = StyleSheet.flatten<TextStyle>(style as StyleProp<TextStyle>);
  const { fontWeight } = flattenedStyle || {};

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
      style={[
        // numbers are much nicer on Apple SF Pro font
        Platform.OS !== 'ios' && {
          fontFamily: getFamilyForWeight(fontWeight),
        },
        style || undefined,
      ]}
      underlineColorAndroid="transparent"
      value={text.value}
      {...rest}
      {...{ animatedProps }}
    />
  );
};

export default ReanimatedText;
