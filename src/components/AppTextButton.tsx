import { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { StyleProp, TouchableHighlight, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppIcon, { MaterialCommunityIconsName } from '@/components/AppIcon';

type AppTextButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  prefixIcon?: MaterialCommunityIconsName | null;
  suffixIcon?: MaterialCommunityIconsName | null;
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
      style={[tw.style(`overflow-hidden rounded-full`), style]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('neutral-800') : tw.color('neutral-200')}
      onPress={onPress}>
      <View
        style={tw`relative flex min-h-14 flex-row items-center justify-center overflow-hidden px-6`}>
        {loading ? (
          <HorizontalLoadingAnimation style={tw`size-full`} />
        ) : (
          <>
            <View style={tw`flex h-full shrink grow basis-0 flex-row items-center justify-start`}>
              {prefixIcon ? (
                <AppIcon
                  color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                  icon={prefixIcon}
                  size={24}
                />
              ) : null}
            </View>
            <View style={tw`flex h-full grow flex-row items-center justify-center`}>
              {children}
            </View>
            <View style={tw`flex h-full shrink grow basis-0 flex-row items-center justify-end`}>
              {suffixIcon ? (
                <AppIcon
                  color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                  icon={suffixIcon}
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
