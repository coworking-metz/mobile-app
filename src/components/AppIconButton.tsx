import AppBlurView from './AppBlurView';
import AppTouchable, { AppTouchableRef } from './AppTouchable';
import LoadingSpinner from './LoadingSpinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, type ForwardRefRenderFunction } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import { theme } from '@/helpers/colors';

export type AppIconButtonProps = {
  icon: keyof typeof mdiGlyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const AppIconButton: ForwardRefRenderFunction<AppTouchableRef, AppIconButtonProps> = (
  { icon, style, disabled = false, loading = false, onPress },
  ref,
) => {
  return (
    <AppTouchable ref={ref} disabled={disabled} style={style} {...(!disabled && { onPress })}>
      <AppBlurView
        intensity={64}
        style={tw`h-full w-full rounded-full overflow-hidden`}
        tint={tw.prefixMatch('dark') ? 'dark' : 'default'}>
        {loading && (
          <LoadingSpinner
            beamSize={2}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={tw`absolute h-full w-full`}
          />
        )}
        <MaterialCommunityIcons
          backgroundColor="transparent"
          borderRadius={24}
          color={tw.prefixMatch('dark') ? tw.color('gray-400') : theme.charlestonGreen}
          iconStyle={{ marginRight: 0 }}
          name={icon}
          size={32}
          style={tw`p-1 shrink-0`}
          underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
        />
      </AppBlurView>
    </AppTouchable>
  );
};

export default forwardRef(AppIconButton);
