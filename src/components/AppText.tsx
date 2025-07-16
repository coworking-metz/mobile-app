import { forwardRef, ForwardRefRenderFunction } from 'react';
import { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import { AnimatedText } from 'react-native-reanimated/lib/typescript/component/Text';
import { withAppFontFamily } from '@/helpers/text';

export type AppTextProps = AnimatedProps<TextProps>;

const AppText: ForwardRefRenderFunction<AnimatedText, AppTextProps> = (
  { children, style, ...otherProps },
  ref,
) => {
  return (
    <Animated.Text
      ref={ref}
      style={withAppFontFamily(style as StyleProp<TextStyle>)}
      {...otherProps}>
      {children}
    </Animated.Text>
  );
};

export default forwardRef(AppText);
