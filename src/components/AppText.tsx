import { forwardRef, ForwardRefRenderFunction, useMemo } from 'react';
import { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import { AnimatedText } from 'react-native-reanimated/lib/typescript/component/Text';
import { withAppFontFamily } from '@/helpers/text';

export type AppTextProps = AnimatedProps<TextProps>;

// matches the whitespace right before a trailing emoji (including ZWJ sequences,
// skin tone modifiers, variation selectors and flag emoji made of two regional indicators)
const TRAILING_EMOJI_REGEX =
  /[ \t]+(\p{Regional_Indicator}{2}|\p{Extended_Pictographic}(?:\u200d\p{Extended_Pictographic}|\ufe0f|[\u{1f3fb}-\u{1f3ff}])*)$/u;

const AppText: ForwardRefRenderFunction<AnimatedText, AppTextProps> = (
  { children, style, ...otherProps },
  ref,
) => {
  const modifiedChildren = useMemo(() => {
    // replace the space before a trailing emoji with a non-breaking space
    // so the text and emoji are never split across lines
    if (typeof children === 'string') {
      return children.replace(TRAILING_EMOJI_REGEX, '\u00A0$1');
    }

    if (Array.isArray(children) && typeof children[children.length - 1] === 'string') {
      const lastChild = children[children.length - 1] as string;
      return [...children.slice(0, -1), lastChild.replace(TRAILING_EMOJI_REGEX, '\u00A0$1')];
    }

    return children;
  }, [children]);

  return (
    <Animated.Text
      ref={ref}
      style={withAppFontFamily(style as StyleProp<TextStyle>)}
      {...otherProps}>
      {modifiedChildren}
    </Animated.Text>
  );
};

export default forwardRef(AppText);
