import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { PlatformColor, StyleProp, useColorScheme, ViewStyle } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import AppGlassView from '@/components/AppGlassView';
import AppPressable, { AppPressableRef } from '@/components/AppPressable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { theme as colorTheme } from '@/helpers/colors';

const LIGHT_COLOR = tw.color('gray-200');
const DARK_COLOR = colorTheme.charlestonGreen;

export type AppIconButtonProps = {
  icon: keyof typeof mdiGlyphMap;
  iconSize?: number;
  iconStyle?: StyleProp<ViewStyle>;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  theme?: 'light' | 'dark';
  radius?: number;
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
        <MaterialCommunityIcons
          backgroundColor={active ? colorTheme.meatBrown : 'transparent'}
          color={iconColor}
          iconStyle={{ marginRight: 0 }}
          name={icon}
          size={iconSize}
          style={[tw`p-1 shrink-0 overflow-hidden rounded-full`, iconStyle]}
        />
      </AppGlassView>
    </AppPressable>
  );
};

export default forwardRef(AppIconButton);
