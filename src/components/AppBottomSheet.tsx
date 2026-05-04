import {
  DetentChangeEvent,
  PositionChangeEvent,
  PositionChangeEventPayload,
  TrueSheet,
  TrueSheetProps,
} from '@lodev09/react-native-true-sheet';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Platform, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import tw from 'twrnc';

export type AppBottomSheetProps = TrueSheetProps & {
  onClose?: () => void;
};

export type AppBottomSheetRef = {
  open: () => void;
  close: () => void;
};

const AppBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { children, style, onClose, ...props },
  disposable,
) => {
  const trueSheetRef = useRef<TrueSheet>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  useImperativeHandle(disposable, () => ({
    open: () => {
      trueSheetRef.current?.present();
    },
    close: () => {
      trueSheetRef.current?.dismiss();
      onClose?.();
    },
  }));

  // TODO: find a better way to handle scrollable state
  // useEffect(() => {
  //   setIsScrollable(contentHeight >= scrollViewHeight);
  //   console.log({ contentHeight, scrollViewHeight, isScrollable });
  // }, [contentHeight, scrollViewHeight]);

  const onDetentChange = useCallback(({ nativeEvent }: DetentChangeEvent) => {
    setIsScrollable(nativeEvent.detent === 1);
  }, []);

  return (
    <TrueSheet
      ref={trueSheetRef}
      backgroundColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
      cornerRadius={48}
      detents={['auto']}
      maxContentWidth={448} // TODO: remove maxWidth once position is full height https://sheet.lodev09.com/guides/reanimated
      scrollable={isScrollable}
      style={tw`flex flex-col`}
      onDetentChange={onDetentChange}
      onDidDismiss={onClose}
      onWillPresent={onDetentChange}
      {...(Platform.OS === 'ios' && { insetAdjustment: 'never' })}
      {...props}>
      <ScrollView
        contentContainerStyle={[tw`flex flex-col`, style]}
        horizontal={false}
        scrollEnabled={isScrollable}
        onContentSizeChange={(_, contentSizeHeight) => {
          setContentHeight(contentSizeHeight);
        }}
        onLayout={({ nativeEvent }) => {
          setScrollViewHeight(nativeEvent.layout.height);
        }}>
        {children}
      </ScrollView>
    </TrueSheet>
  );

  // return (
  //   <BottomSheet
  //     ref={bottomSheetRef}
  //     enableContentPanningGesture
  //     enablePanDownToClose
  //     activeOffsetX={[-999, 999]}
  //     // @see https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts/issues/368#issuecomment-1724527189
  //     // @see https://github.com/gorhom/react-native-bottom-sheet/issues/770#issuecomment-1072113936
  //     activeOffsetY={[-5, 5]}
  //     backdropComponent={(backdropProps) => (
  //       <AppBottomSheetBackdrop
  //         {...backdropProps}
  //         onLayout={({ nativeEvent }: LayoutChangeEvent) => {
  //           setParentWidth(nativeEvent.layout.width);
  //         }}
  //         onTouch={() => bottomSheetRef?.current?.close()}
  //       />
  //     )}
  //     backgroundStyle={tw`bg-transparent`}
  //     bottomInset={4}
  //     containerStyle={tw`z-10`}
  //     detached={true}
  //     handleIndicatorStyle={tw`w-full max-w-16 mx-auto bg-gray-400 dark:bg-neutral-700 rounded-full`}
  //     handleStyle={tw`bg-transparent absolute right-0 left-0`}
  //     topInset={insets.top + MIN_BACKDROP_HEIGHT}
  //     onAnimate={(_, toIndex) => setClosing(toIndex === -1)}
  //     {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}
  //     {...props}
  //     style={[
  //       tw.style(
  //         `mx-1 overflow-hidden`,
  //         parentWidth > MAX_WIDTH && `w-[${MAX_WIDTH}px] ml-[${parentWidth / 2 - MAX_WIDTH / 2}px]`,
  //       ),
  //       style,
  //     ]}>
  //     <AppSquircleView
  //       style={tw`relative overflow-hidden rounded-[3.5rem] bg-white dark:bg-zinc-900`}>
  //       <AppFader
  //         position={Fader.position.TOP}
  //         size={16}
  //         style={tw`absolute inset-x-0 top-0 z-10`}
  //         tintColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
  //       />
  //       {children && (
  //         <BottomSheetScrollView
  //           bounces={isBouncing}
  //           contentContainerStyle={[tw.style(`pt-2`, { paddingBottom }), contentContainerStyle]}
  //           onContentSizeChange={(_width: number, height: number) => setContentHeight(height)}>
  //           {children}
  //         </BottomSheetScrollView>
  //       )}
  //     </AppSquircleView>
  //   </BottomSheet>
  // );
};

export default forwardRef(AppBottomSheet);
