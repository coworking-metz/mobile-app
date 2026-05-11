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
import { Platform, ScrollView } from 'react-native';
import tw from 'twrnc';

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
  const trueSheetRef = useRef<TrueSheet>(null);
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
    const isContentHigherThanScrollView =
      !isNil(contentHeight) && !isNil(scrollViewHeight) && contentHeight > scrollViewHeight;
    const isDetentAlmostOpen = !isNil(detent) && Math.round(detent * 10) / 10 === 1;
    return isDetentAlmostOpen || isContentHigherThanScrollView;
  }, [detent, contentHeight, scrollViewHeight]);

  return (
    <TrueSheet
      ref={trueSheetRef}
      backgroundColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
      cornerRadius={48}
      detents={['auto']}
      maxContentWidth={448} // TODO: remove maxWidth once position is full height https://sheet.lodev09.com/guides/reanimated
      scrollable={isScrollable}
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
};

export default forwardRef(AppBottomSheet);
