import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppGlassView from '@/components/AppGlassView';
import AppIcon, { MaterialCommunityIconsName } from '@/components/AppIcon';
import AppPressable, { AppPressableRef } from '@/components/AppPressable';
import AppText from '@/components/AppText';

export type AppRoundedButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
  renderPrefix?: () => ReactNode;
  prefixIcon?: MaterialCommunityIconsName | null;
  renderSuffix?: () => ReactNode;
  suffixIcon?: MaterialCommunityIconsName | null;
  children?: ReactNode;
  blurTarget?: React.RefObject<View | null>;
  onPress?: () => void;
};

const AppRoundedButton: ForwardRefRenderFunction<AppPressableRef, AppRoundedButtonProps> = (
  {
    label,
    renderPrefix,
    prefixIcon,
    renderSuffix,
    suffixIcon,
    style,
    children,
    blurTarget,
    disabled = false,
    loading = false,
    onPress,
  },
  ref,
) => {
  return (
    <AppPressable
      ref={ref}
      activeOpacity={disabled || isLiquidGlassSupported ? 1 : 0.5}
      disabled={disabled}
      {...(!disabled && { onPress })}>
      <AppGlassView
        blurTarget={blurTarget}
        interactive={!disabled}
        style={[
          tw.style(
            `flex min-h-14 flex-row items-center justify-center overflow-hidden rounded-full px-6`,
            !isLiquidGlassSupported &&
              `border-[0.5px] border-gray-300 bg-gray-300/85 dark:border-zinc-700 dark:bg-zinc-700/85`,
            disabled && `opacity-50`,
          ),
          style,
        ]}
        tintColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-300/60')}>
        {loading ? (
          <HorizontalLoadingAnimation style={tw`size-full`} />
        ) : (
          <>
            <View style={tw`flex h-full shrink grow basis-0 flex-row items-center justify-start`}>
              {renderPrefix ? (
                renderPrefix()
              ) : prefixIcon ? (
                <AppIcon
                  icon={prefixIcon}
                  size={24}
                  style={tw`text-gray-700 dark:text-stone-400`}
                />
              ) : null}
            </View>
            <View style={tw`flex h-full grow flex-row items-center justify-center`}>
              {label ? (
                <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
                  {label}
                </AppText>
              ) : (
                children
              )}
            </View>
            <View style={tw`flex h-full shrink grow basis-0 flex-row items-center justify-end`}>
              {renderSuffix ? (
                renderSuffix()
              ) : suffixIcon ? (
                <AppIcon
                  icon={suffixIcon}
                  size={24}
                  style={tw`text-gray-700 dark:text-stone-400`}
                />
              ) : null}
            </View>
          </>
        )}
      </AppGlassView>
    </AppPressable>
  );
};

export default forwardRef(AppRoundedButton);
