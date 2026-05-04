import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { PlatformColor, StyleProp, useColorScheme, ViewStyle, type View } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import AppGlassView from '@/components/AppGlassView';
import AppIcon, { MaterialCommunityIconsName } from '@/components/AppIcon';
import AppPressable, { AppPressableRef } from '@/components/AppPressable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { theme as colorTheme } from '@/helpers/colors';

const LIGHT_COLOR = tw.color('gray-200');
const DARK_COLOR = colorTheme.charlestonGreen;

export type AppIconButtonProps = {
  icon: MaterialCommunityIconsName;
  iconSize?: number;
  iconStyle?: StyleProp<ViewStyle>;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  theme?: 'light' | 'dark';
  radius?: number;
  blurTarget?: React.RefObject<View | null>;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const AppIconButton: ForwardRefRenderFunction<AppPressableRef, AppIconButtonProps> = (
  {
    theme,
    icon,
    iconSize = 32,
    iconStyle,
    style,
    active = false,
    disabled = false,
    loading = false,
    radius = 3,
    blurTarget,
    onPress,
  },
  ref,
) => {
  const colorScheme = useColorScheme();
  const appliedTheme = useMemo(() => {
    return theme ?? colorScheme;
  }, [theme, colorScheme]);
  const iconColor = useMemo(() => {
    if (active) {
      return DARK_COLOR;
    }
    if (theme === 'light') {
      return DARK_COLOR;
    }
    if (theme === 'dark') {
      return LIGHT_COLOR;
    }
    return isLiquidGlassSupported
      ? PlatformColor('label')
      : colorScheme === 'dark'
        ? LIGHT_COLOR
        : DARK_COLOR;
  }, [active, colorScheme, theme]);

  return (
    <AppPressable
      ref={ref}
      activeOpacity={isLiquidGlassSupported ? 1 : 0.5}
      disabled={disabled}
      style={style}
      {...(!disabled && { onPress })}>
      <AppGlassView
        interactive
        blurTarget={blurTarget}
        colorScheme={theme}
        radius={radius}
        style={[
          tw`flex items-center justify-center h-10 w-10 rounded-full relative`,
          !isLiquidGlassSupported && tw`border-[0.5px] overflow-hidden`,
          appliedTheme === 'light' ? tw`border-gray-300` : tw`border-gray-700`,
          disabled && tw`opacity-50`,
        ]}>
        {loading && (
          <LoadingSpinner
            beamSize={2}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={tw`absolute h-full w-full`}
          />
        )}
        <AppIcon
          color={iconColor}
          icon={icon}
          size={iconSize}
          style={[
            tw`p-1 shrink-0 overflow-hidden rounded-full`,
            active && { backgroundColor: colorTheme.meatBrown },
            iconStyle,
          ]}
        />
      </AppGlassView>
    </AppPressable>
  );
};

export default forwardRef(AppIconButton);
