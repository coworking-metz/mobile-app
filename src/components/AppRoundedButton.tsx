import AppTouchableScale from './AppTouchableScale';
import { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

type AppRoundedButtonProps = {
  disabled?: boolean;
  style?: StyleProps;
  children?: ReactNode;
  onPress?: () => void;
};

const AppRoundedButton: ForwardRefRenderFunction<
  typeof AppTouchableScale,
  AppRoundedButtonProps
> = ({ style, children, disabled = false, onPress }, ref) => {
  return (
    <AppTouchableScale ref={ref} {...(!disabled && { onPress })}>
      <View
        style={[
          tw`flex flex-row justify-center items-center min-h-14 rounded-[4rem]`,
          disabled
            ? tw`bg-neutral-200 dark:bg-neutral-400 opacity-50`
            : { backgroundColor: theme.darkVanilla },
          style,
        ]}>
        {children}
      </View>
    </AppTouchableScale>
  );
};

export default forwardRef(AppRoundedButton);
