import HorizontalLoadingAnimation from './Animations/HorizontalLoadingAnimation';
import AppTouchableScale from './AppTouchableScale';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import { theme } from '@/helpers/colors';

type AppRoundedButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProps;
  prefixIcon?: keyof typeof mdiGlyphMap | null;
  suffixIcon?: keyof typeof mdiGlyphMap | null;
  children?: ReactNode;
  onPress?: () => void;
};

const AppRoundedButton: ForwardRefRenderFunction<
  typeof AppTouchableScale,
  AppRoundedButtonProps
> = (
  { prefixIcon, suffixIcon, style, children, disabled = false, loading = false, onPress },
  ref,
) => {
  return (
    <AppTouchableScale ref={ref} {...(!disabled && { onPress })}>
      <View
        style={[
          tw`flex flex-row justify-center items-center min-h-14 px-6 rounded-[4rem]`,
          disabled
            ? tw`bg-neutral-200 dark:bg-neutral-400 opacity-50`
            : { backgroundColor: theme.darkVanilla },
          style,
        ]}>
        {loading ? (
          <HorizontalLoadingAnimation />
        ) : (
          <>
            <View style={tw`flex flex-row items-center justify-start h-full grow shrink basis-0`}>
              {prefixIcon ? (
                <MaterialCommunityIcons
                  color={theme.charlestonGreen}
                  iconStyle={tw`h-6 w-6`}
                  name={prefixIcon}
                  size={24}
                />
              ) : null}
            </View>
            <View style={tw`flex flex-row items-center justify-center h-full grow`}>
              {children}
            </View>
            <View style={tw`flex flex-row items-center justify-end h-full grow shrink basis-0`}>
              {suffixIcon ? (
                <MaterialCommunityIcons
                  color={theme.charlestonGreen}
                  iconStyle={tw`h-6 w-6`}
                  name={suffixIcon}
                  size={24}
                />
              ) : null}
            </View>
          </>
        )}
      </View>
    </AppTouchableScale>
  );
};

export default forwardRef(AppRoundedButton);
