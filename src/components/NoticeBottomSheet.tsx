import ErrorAnimation from './Animations/ErrorAnimation';
import HorizontalLoadingAnimation from './Animations/HorizontalLoadingAnimation';
import InfoAnimation from './Animations/InfoAnimation';
import SuccessAnimation from './Animations/SuccessAnimation';
import UnlockAnimation from './Animations/UnlockAnimation';
import WarningAnimation from './Animations/WarningAnimation';
import AppBottomSheet from './AppBottomSheet';
import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, Text, View } from 'react-native';
import tw from 'twrnc';
import type BottomSheet from '@gorhom/bottom-sheet';
import useNoticeStore, { type NoticeType } from '@/stores/notice';

const NoticeBottomSheet = () => {
  const noticeStore = useNoticeStore();
  const mostRecentUndismissedNotice = useNoticeStore((state) =>
    state.history.find((n) => !n.dismissed),
  );
  const bottomSheetRef = useRef<BottomSheet>(null);

  const getAnimation = (type?: NoticeType) => {
    switch (type) {
      case 'loading':
        return <HorizontalLoadingAnimation style={tw`h-full w-full`} />;
      case 'error':
        return <ErrorAnimation style={tw`h-full w-full`} />;
      case 'warning':
        return <WarningAnimation style={tw`h-full w-full`} />;
      case 'success':
        return <SuccessAnimation style={tw`h-full w-full`} />;
      case 'info':
        return <InfoAnimation style={tw`h-full w-full`} />;
      case 'unlock':
        return <UnlockAnimation style={tw`h-full w-full`} />;
      default:
        return <></>;
    }
  };

  const onClose = useCallback(() => {
    if (mostRecentUndismissedNotice?.id) {
      noticeStore.dismiss(mostRecentUndismissedNotice.id);
    }
  }, [noticeStore]);

  useEffect(() => {
    if (mostRecentUndismissedNotice) {
      bottomSheetRef.current?.expand();
    }
  }, [noticeStore.history]);

  if (!mostRecentUndismissedNotice) return null;

  return (
    <AppBottomSheet
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col items-center justify-between gap-4 p-6`}>
        <View style={tw`flex flex-col h-32 w-32 items-center justify-center`}>
          {getAnimation(mostRecentUndismissedNotice.type)}
        </View>
        <View style={tw`flex flex-col items-center grow gap-2 self-stretch pb-4`}>
          <Text
            style={tw`text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {mostRecentUndismissedNotice.message}
          </Text>
          {mostRecentUndismissedNotice.description && (
            <Text style={tw`text-center text-xl font-normal text-slate-500 dark:text-slate-400`}>
              {mostRecentUndismissedNotice.description}
            </Text>
          )}
        </View>
      </View>
    </AppBottomSheet>
  );
};

export default NoticeBottomSheet;
