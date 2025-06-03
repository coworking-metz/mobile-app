import AppBottomSheetBackdrop from './AppBottomSheetBackdrop';
import BottomSheet, { BottomSheetScrollView, type BottomSheetProps } from '@gorhom/bottom-sheet';
import { SquircleView } from 'expo-squircle-view';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Dimensions, LayoutChangeEvent, Platform, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import { useAppPaddingBottom } from '@/helpers/screen';

const HANDLE_HEIGHT = 8;
const MIN_BACKDROP_HEIGHT = 64;
const MAX_WIDTH = 448;

export type AppBottomSheetProps = Omit<BottomSheetProps, 'snapPoints'> & {
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const { height: screenHeight } = Dimensions.get('screen');

export type AppBottomSheetRef = {
  close: () => void;
};

const AppBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { children, contentContainerStyle, style, ...props },
  disposable,
) => {
  const insets = useSafeAreaInsets();
  const paddingBottom = useAppPaddingBottom();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [parentWidth, setParentWidth] = useState(0);
  const [isClosing, setClosing] = useState(false);

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
    if (contentHeight && !isClosing) {
      bottomSheetRef.current?.expand();
    }
  }, [contentHeight, bottomSheetRef, isClosing]);

  useImperativeHandle(disposable, () => ({
    close: () => {
      bottomSheetRef.current?.forceClose();
    },
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enableContentPanningGesture
      enablePanDownToClose
      activeOffsetX={[-999, 999]}
      // @see https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts/issues/368#issuecomment-1724527189
      // @see https://github.com/gorhom/react-native-bottom-sheet/issues/770#issuecomment-1072113936
      activeOffsetY={[-5, 5]}
      backdropComponent={(backdropProps) => (
        <AppBottomSheetBackdrop
          {...backdropProps}
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            setParentWidth(nativeEvent.layout.width);
          }}
          onTouch={() => bottomSheetRef?.current?.close()}
        />
      )}
      backgroundStyle={tw`bg-transparent`}
      bottomInset={4}
      containerStyle={tw`z-10`}
      detached={true}
      handleIndicatorStyle={tw`bg-gray-500 rounded-full`}
      handleStyle={tw`bg-transparent absolute right-0 left-0`}
      topInset={insets.top + MIN_BACKDROP_HEIGHT}
      onAnimate={(_, toIndex) => setClosing(toIndex === -1)}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}
      {...props}
      style={[
        tw.style(
          `mx-1 overflow-hidden`,
          parentWidth > MAX_WIDTH && `w-[${MAX_WIDTH}px] ml-[${parentWidth / 2 - MAX_WIDTH / 2}px]`,
        ),
        style,
      ]}>
      <SquircleView
        cornerSmoothing={100} // 0-100
        preserveSmoothing={true} // false matches figma, true has more rounding
        style={tw`relative overflow-hidden rounded-[3.5rem] bg-white dark:bg-zinc-900`}>
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
            contentContainerStyle={[tw.style(`pt-2`, { paddingBottom }), contentContainerStyle]}
            onContentSizeChange={(_width, height) => setContentHeight(height)}>
            {children}
          </BottomSheetScrollView>
        )}
      </SquircleView>
    </BottomSheet>
  );
};

export default forwardRef(AppBottomSheet);
