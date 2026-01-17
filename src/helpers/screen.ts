import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const WIDE_SCREEN_WIDTH = 672;
export const MIN_PADDING_BOTTOM = 24;

export default function useAppScreen() {
  const { width } = useWindowDimensions();

  const isWide = useMemo(() => {
    return width > WIDE_SCREEN_WIDTH;
  }, [width]);

  return {
    isWide,
    width,
  };
}

export const useAppPaddingBottom = () => {
  const insets = useSafeAreaInsets();
  return Math.max(
    (Platform.OS === 'android' ? insets.bottom : 0) + MIN_PADDING_BOTTOM / 2,
    MIN_PADDING_BOTTOM,
  );
};
