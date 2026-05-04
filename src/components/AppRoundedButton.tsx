import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppIcon, { MaterialCommunityIconsName } from '@/components/AppIcon';
import AppPressable, { AppPressableRef } from '@/components/AppPressable';
import { theme } from '@/helpers/colors';

export type AppRoundedButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  prefixIcon?: MaterialCommunityIconsName | null;
  suffixIcon?: MaterialCommunityIconsName | null;
  children?: ReactNode;
  onPress?: () => void;
};

const AppRoundedButton: ForwardRefRenderFunction<AppPressableRef, AppRoundedButtonProps> = (
  { prefixIcon, suffixIcon, style, children, disabled = false, loading = false, onPress },
  ref,
) => {
  return (
    <AppPressable ref={ref} disabled={disabled} {...(!disabled && { onPress })}>
      <View
        style={[
          tw.style(
            `flex flex-row justify-center items-center min-h-14 px-6 rounded-full relative overflow-hidden`,
            disabled && `bg-neutral-200 dark:bg-stone-400 opacity-50`,
          ),
          style,
        ]}>
        {!disabled && (
          <LinearGradient
            colors={[theme.miramonYellow, theme.maizeCrayola]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0.5, y: 2 }}
            style={tw`absolute top-0 left-0 right-0 bottom-0`}
          />
        )}
        {loading ? (
          <HorizontalLoadingAnimation style={tw`h-full w-full`} />
        ) : (
          <>
            <View style={tw`flex flex-row items-center justify-start h-full grow shrink basis-0`}>
              {prefixIcon ? (
                <AppIcon color={theme.charlestonGreen} icon={prefixIcon} size={24} />
              ) : null}
            </View>
            <View style={tw`flex flex-row items-center justify-center h-full grow`}>
              {children}
            </View>
            <View style={tw`flex flex-row items-center justify-end h-full grow shrink basis-0`}>
              {suffixIcon ? (
                <AppIcon color={theme.charlestonGreen} icon={suffixIcon} size={24} />
              ) : null}
            </View>
          </>
        )}
      </View>
    </AppPressable>
  );
};

export default forwardRef(AppRoundedButton);
