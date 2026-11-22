import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Platform, type ColorValue, type ImageSourcePropType } from 'react-native';
import type { MaterialCommunityIconsName } from '@/components/AppIcon';

type ToolbarIcon = ComponentProps<typeof Stack.Toolbar.Button>['icon'];
type SFSymbol = Extract<ToolbarIcon, string>;

const ICON_SIZE = 24;

// native toolbar icons: SF Symbols on iOS, rasterized MaterialCommunityIcons on Android
export const useToolbarIcon = (
  sf: SFSymbol,
  mdi: MaterialCommunityIconsName,
  color: ColorValue,
): ToolbarIcon => {
  const [source, setSource] = useState<ImageSourcePropType>();

  useEffect(() => {
    if (Platform.OS === 'ios') return;
    let cancelled = false;
    MaterialCommunityIcons.getImageSource(mdi, ICON_SIZE, color).then((image) => {
      if (!cancelled && image) setSource(image);
    });
    return () => {
      cancelled = true;
    };
  }, [mdi, color]);

  return Platform.OS === 'ios' ? sf : source;
};
