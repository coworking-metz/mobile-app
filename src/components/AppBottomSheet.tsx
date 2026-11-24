import { TrueSheet, TrueSheetProps } from '@lodev09/react-native-true-sheet';
import { isNil } from 'lodash';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, ScrollView, type ScrollViewInstance } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import tw from 'twrnc';
import useSettingsStore from '@/stores/settings';

export type AppBottomSheetProps = TrueSheetProps & {
  onClose?: () => void;
};

export type AppBottomSheetRef = {
  open: () => void;
  close: () => void;
};

const AppBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { children, style, onClose, onDetentChange, ...props },
  disposable,
) => {
  const withBottomSheetFullHeight = useSettingsStore((s) => s.withBottomSheetFullHeight);
  const trueSheetRef = useRef<TrueSheet>(null);
  const scrollableRef = useRef<ScrollViewInstance>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState<number | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [detent, setDetent] = useState<number | null>(null);

  useImperativeHandle(disposable, () => ({
    open: () => {
      trueSheetRef.current?.present();
    },
    close: () => {
      trueSheetRef.current?.dismiss();
      onClose?.();
    },
  }));

  const isScrollable = useMemo(() => {
    if (withBottomSheetFullHeight) return true;

    const isContentHigherThanScrollView =
      !isNil(contentHeight) && !isNil(scrollViewHeight) && contentHeight > scrollViewHeight;
    const isDetentAlmostOpen = !isNil(detent) && Math.round(detent * 10) / 10 === 1;
    return isDetentAlmostOpen || isContentHigherThanScrollView;
  }, [detent, contentHeight, scrollViewHeight, withBottomSheetFullHeight]);

  return (
    <TrueSheet
      ref={trueSheetRef}
      backgroundColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
      cornerRadius={48}
      detents={[withBottomSheetFullHeight ? 1 : 'auto']}
      maxContentWidth={448}
      scrollableRef={scrollableRef}
      style={tw`flex flex-col`}
      {...(Platform.OS === 'ios' && { insetAdjustment: 'never' })}
      {...props}
      onDetentChange={(event) => {
        setDetent(event.nativeEvent.detent);
        onDetentChange?.(event);
      }}
      onDidDismiss={() => {
        onClose?.();
        setDetent(null);
      }}>
      {/* Android mounts the sheet as its own RootView, outside the app's gesture root */}
      <GestureHandlerRootView style={tw`shrink`}>
        <ScrollView
          ref={scrollableRef}
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
      </GestureHandlerRootView>
    </TrueSheet>
  );
};

export default forwardRef(AppBottomSheet);
