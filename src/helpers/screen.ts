import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const WIDE_SCREEN_WIDTH = 640;

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
