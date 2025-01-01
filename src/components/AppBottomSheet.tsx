import AppBottomSheetBackdrop from './AppBottomSheetBackdrop';
import BottomSheet, { BottomSheetScrollView, type BottomSheetProps } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';

const HANDLE_HEIGHT = 8;
const MIN_PADDING_BOTTOM = 24;
const MIN_BACKDROP_HEIGHT = 64;

export type AppBottomSheetProps = Omit<BottomSheetProps, 'snapPoints'> & {
  children?: ReactNode;
  contentContainerStyle?: StyleProps;
};

const { height: screenHeight } = Dimensions.get('screen');

const AppBottomSheet = ({
  children,
  contentContainerStyle,
  style,
  ...props
}: AppBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const visibleHeight = useMemo(
    () => Math.max(contentHeight + HANDLE_HEIGHT + 4, 256),
    [contentHeight],
  );
  const maxHeight = useMemo(
    () => screenHeight - MIN_BACKDROP_HEIGHT - insets.bottom - insets.top,
    [screenHeight, insets],
  );
  const isBouncing = useMemo(() => {
    return visibleHeight > maxHeight;
  }, [visibleHeight, maxHeight]);

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
      // @see https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts/issues/368#issuecomment-1724527189
      // @see https://github.com/gorhom/react-native-bottom-sheet/issues/770#issuecomment-1072113936
      activeOffsetX={[-999, 999]}
      activeOffsetY={[-5, 5]}
      backdropComponent={(backdropProps) => (
        <AppBottomSheetBackdrop
          {...backdropProps}
          onTouch={() => bottomSheetRef?.current?.close()}
        />
      )}
      backgroundStyle={tw`bg-white dark:bg-zinc-900`}
      bottomInset={4}
      containerStyle={tw`z-10`}
      detached={true}
      handleIndicatorStyle={tw`bg-gray-500 rounded-full`}
      handleStyle={tw`bg-transparent absolute right-0 left-0`}
      topInset={insets.top + MIN_BACKDROP_HEIGHT}
      {...props}
      style={[
        tw`mx-1 overflow-hidden relative`,
        Platform.OS === 'android' ? tw`rounded-[2rem]` : tw`rounded-[3.5rem]`,
        style,
      ]}>
      <View style={tw`absolute top-0 left-0 right-0 z-10`}>
        <Fader
          position={Fader.position.TOP}
          size={16}
          tintColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
        />
      </View>
      {children && (
        <BottomSheetScrollView
          bounces={isBouncing}
          contentContainerStyle={[
            tw`pt-2`,
            { paddingBottom: insets.bottom || MIN_PADDING_BOTTOM },
            contentContainerStyle,
          ]}
          onContentSizeChange={(_width, height) => setContentHeight(height)}>
          {children}
        </BottomSheetScrollView>
      )}
    </BottomSheet>
  );
};

export default AppBottomSheet;
