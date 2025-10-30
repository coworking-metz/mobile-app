import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, useMemo, type ForwardRefRenderFunction } from 'react';
import { PlatformColor, StyleProp, ViewStyle } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import AppGlassView from '@/components/AppGlassView';
import AppPressable, { AppPressableRef } from '@/components/AppPressable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { theme } from '@/helpers/colors';

const LIGHT_COLOR = tw.color('gray-200');
const DARK_COLOR = theme.charlestonGreen;

export type AppIconButtonProps = {
  icon: keyof typeof mdiGlyphMap;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  colorScheme?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const AppIconButton: ForwardRefRenderFunction<AppPressableRef, AppIconButtonProps> = (
  { colorScheme, icon, style, active = false, disabled = false, loading = false, onPress },
  ref,
) => {
  const iconColor = useMemo(() => {
    if (active) {
      return DARK_COLOR;
    }
    if (colorScheme === 'light') {
      return DARK_COLOR;
    }
    if (colorScheme === 'dark') {
      return LIGHT_COLOR;
    }
    return isLiquidGlassSupported
      ? PlatformColor('label')
      : tw.prefixMatch('dark')
        ? LIGHT_COLOR
        : DARK_COLOR;
  }, [active, colorScheme]);

  return (
    <AppPressable
      ref={ref}
      activeOpacity={isLiquidGlassSupported ? 1 : 0.5}
      disabled={disabled}
      style={style}
      {...(!disabled && { onPress })}>
      <AppGlassView
        interactive
        colorScheme={colorScheme}
        style={[
          tw`flex items-center justify-center h-10 w-10 rounded-full relative`,
          !isLiquidGlassSupported &&
            tw`border-[0.5px] border-gray-300 dark:border-gray-700 overflow-hidden`,
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
          backgroundColor={active ? theme.meatBrown : 'transparent'}
          color={iconColor}
          iconStyle={{ marginRight: 0 }}
          name={icon}
          size={32}
          style={tw`p-1 shrink-0 overflow-hidden rounded-full`}
        />
      </AppGlassView>
    </AppPressable>
  );
};

export default forwardRef(AppIconButton);
