import HorizontalLoadingAnimation from './Animations/HorizontalLoadingAnimation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import type AppTouchableScale from './AppTouchableScale';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import { theme } from '@/helpers/colors';

type AppTextButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProps;
  prefixIcon?: keyof typeof mdiGlyphMap | null;
  suffixIcon?: keyof typeof mdiGlyphMap | null;
  children?: ReactNode;
  onPress?: () => void;
};

const AppTextButton: ForwardRefRenderFunction<typeof AppTouchableScale, AppTextButtonProps> = (
  { prefixIcon, suffixIcon, style, children, disabled = false, loading = false, onPress },
  ref,
) => {
  return (
    <Button
      ref={ref}
      activeBackgroundColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
      activeOpacity={1}
      backgroundColor="transparent"
      disabled={disabled}
      style={[tw`min-h-14 px-6`, style]}
      onPress={onPress}>
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
          <View style={tw`flex flex-row items-center justify-center h-full grow`}>{children}</View>
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
    </Button>
  );
};

export default forwardRef(AppTextButton);
