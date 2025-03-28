import { forwardRef, ForwardRefRenderFunction } from 'react';
import { StyleProp, StyleSheet, TextProps, TextStyle } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import { AnimatedText } from 'react-native-reanimated/lib/typescript/component/Text';
import { getFamilyForWeight } from '@/helpers/text';

const AppText: ForwardRefRenderFunction<AnimatedText, AnimatedProps<TextProps>> = (
  { children, style, ...otherProps },
  ref,
) => {
  const flattenedStyle = StyleSheet.flatten<TextStyle>(style as StyleProp<TextStyle>);
  const { fontWeight } = flattenedStyle || {};

  return (
    <Animated.Text
      ref={ref}
      style={[
        {
          fontFamily: getFamilyForWeight(fontWeight),
        },
        style,
      ]}
      {...otherProps}>
      {children}
    </Animated.Text>
  );
};

export default forwardRef(AppText);
