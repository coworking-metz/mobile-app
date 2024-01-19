import AppBottomSheetBackdrop from './AppBottomSheetBackdrop';
import BottomSheet, { BottomSheetScrollView, type BottomSheetProps } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

const HANDLE_HEIGHT = 8;
const MIN_MARGIN_BOTTOM = 16;

export type AppBottomSheetProps = Omit<BottomSheetProps, 'snapPoints'> & {
  children?: ReactNode;
};

const { height: windowHeight } = Dimensions.get('window');

const AppBottomSheet = ({ children, style, ...props }: AppBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const snapPoints = useMemo(
    () => [
      Math.min(
        Math.max(contentHeight + HANDLE_HEIGHT + MIN_MARGIN_BOTTOM, 320),
        windowHeight - MIN_MARGIN_BOTTOM * 2 - insets.bottom - insets.top,
      ),
    ],
    [contentHeight, insets],
  );

  useEffect(() => {
    if (contentHeight) {
      bottomSheetRef?.current?.expand();
    }
  }, [contentHeight]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enableContentPanningGesture
      enablePanDownToClose
      backdropComponent={(backdropProps) => (
        <AppBottomSheetBackdrop
          {...backdropProps}
          onTouch={() => bottomSheetRef?.current?.close()}
        />
      )}
      backgroundStyle={tw`bg-white dark:bg-zinc-900`}
      bottomInset={insets.bottom || MIN_MARGIN_BOTTOM}
      containerStyle={tw`z-10`}
      detached={true}
      handleIndicatorStyle={tw`bg-gray-500 rounded-full`}
      {...props}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}
      snapPoints={snapPoints}
      style={[tw`mx-4 rounded-[2rem] overflow-hidden relative`, style]}>
      {children && (
        <BottomSheetScrollView
          bounces={
            contentHeight > windowHeight - MIN_MARGIN_BOTTOM * 2 - insets.bottom - insets.top
          }
          style={tw``}
          onContentSizeChange={(_width, height) => setContentHeight(height)}>
          {children}
        </BottomSheetScrollView>
      )}
    </BottomSheet>
  );
};

export default AppBottomSheet;
