import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, LinkProps } from 'expo-router';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { StyleProp, TextProps, TextStyle } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import { AnimatedText } from 'react-native-reanimated/lib/typescript/component/Text';
import { withAppFontFamily } from '@/helpers/text';

export type AppTextProps = Omit<AnimatedProps<TextProps>, 'onPress'> &
  Pick<LinkProps, 'href' | 'target' | 'onPress'>;

const AppTextLink: ForwardRefRenderFunction<AnimatedText, AppTextProps> = (
  { children, style, href, target, onPress, ...otherProps },
  ref,
) => {
  return (
    <Link href={href} target={target} onPress={onPress}>
      <Animated.Text
        ref={ref}
        style={withAppFontFamily(style as StyleProp<TextStyle>)}
        {...otherProps}>
        {children}
        {!`${href}`.startsWith('/') && (
          <>
            {' '}
            <MaterialCommunityIcons name="open-in-new" size={20} />
          </>
        )}
      </Animated.Text>
    </Link>
  );
};

export default forwardRef(AppTextLink);
