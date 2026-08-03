import AppText from './AppText';
import { Link, LinkProps } from 'expo-router';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { TextProps } from 'react-native';
import { AnimatedProps } from 'react-native-reanimated';
import { AnimatedText } from 'react-native-reanimated/lib/typescript/component/Text';
import AppIcon from '@/components/AppIcon';

export type AppTextProps = Omit<AnimatedProps<TextProps>, 'onPress'> &
  Pick<LinkProps, 'href' | 'target' | 'onPress'>;

const AppTextLink: ForwardRefRenderFunction<AnimatedText, AppTextProps> = (
  { children, href, target, onPress, ...otherProps },
  ref,
) => {
  return (
    <Link href={href} target={target} onPress={onPress}>
      <AppText ref={ref} {...otherProps}>
        {children}
        {!`${href}`.startsWith('/') && (
          <>
            {' '}
            <AppIcon icon="open-in-new" size={20} />
          </>
        )}
      </AppText>
    </Link>
  );
};

export default forwardRef(AppTextLink);
