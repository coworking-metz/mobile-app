import HorizontalLoadingAnimation from './Animations/HorizontalLoadingAnimation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { StyleProp, TouchableHighlight, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

type AppTextButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  prefixIcon?: keyof typeof mdiGlyphMap | null;
  suffixIcon?: keyof typeof mdiGlyphMap | null;
  children?: ReactNode;
  onPress?: () => void;
};

const AppTextButton: ForwardRefRenderFunction<typeof TouchableHighlight, AppTextButtonProps> = (
  { prefixIcon, suffixIcon, style, children, disabled = false, loading = false, onPress },
  ref,
) => {
  return (
    <TouchableHighlight
      ref={ref as never}
      disabled={disabled}
      style={[tw.style(`rounded-full overflow-hidden`), style]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('neutral-800') : tw.color('neutral-200')}
      onPress={onPress}>
      <View
        style={tw`flex flex-row justify-center items-center min-h-14 px-6 relative overflow-hidden`}>
        {loading ? (
          <HorizontalLoadingAnimation style={tw`h-full w-full`} />
        ) : (
          <>
            <View style={tw`flex flex-row items-center justify-start h-full grow shrink basis-0`}>
              {prefixIcon ? (
                <MaterialCommunityIcons
                  color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
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
                  color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                  iconStyle={tw`h-6 w-6`}
                  name={suffixIcon}
                  size={24}
                />
              ) : null}
            </View>
          </>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default forwardRef(AppTextButton);
