import ErrorAnimation from './Animations/ErrorAnimation';
import InfoAnimation from './Animations/InfoAnimation';
import SuccessAnimation from './Animations/SuccessAnimation';
import WarningAnimation from './Animations/WarningAnimation';
import AppBottomSheet, { AppBottomSheetRef } from './AppBottomSheet';
import AppRoundedButton from './AppRoundedButton';
import AppText from './AppText';
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import useNoticeStore, { type NoticeType } from '@/stores/notice';

const NoticeBottomSheet = () => {
  const noticeStore = useNoticeStore();
  const mostRecentUndismissedNotice = useNoticeStore((state) =>
    state.history.find((n) => !n.dismissed),
  );
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  const getAnimation = (type?: NoticeType) => {
    switch (type) {
      case 'error':
        return <ErrorAnimation style={tw`h-full w-full`} />;
      case 'warning':
        return <WarningAnimation style={tw`h-full w-full`} />;
      case 'success':
        return <SuccessAnimation style={tw`h-full w-full`} />;
      case 'info':
        return <InfoAnimation style={tw`h-full w-full`} />;
      default:
        return <></>;
    }
  };

  const onClose = useCallback(() => {
    if (mostRecentUndismissedNotice?.id) {
      mostRecentUndismissedNotice.onClose?.();
      noticeStore.dismissAll();
    }
  }, [mostRecentUndismissedNotice, noticeStore]);

  if (!mostRecentUndismissedNotice) return null;

  return (
    <AppBottomSheet ref={bottomSheetRef} contentContainerStyle={tw`px-6 pt-6`} onClose={onClose}>
      <View style={tw`flex flex-col h-32 w-32 items-center justify-center mx-auto`}>
        {getAnimation(mostRecentUndismissedNotice.type)}
      </View>
      <View style={tw`flex flex-col items-center grow self-stretch mt-4`}>
        <AppText
          style={tw`text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {mostRecentUndismissedNotice.message}
        </AppText>
        {mostRecentUndismissedNotice.description ? (
          <AppText
            style={tw`mt-2 text-center text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {mostRecentUndismissedNotice.description}
          </AppText>
        ) : null}
      </View>

      {mostRecentUndismissedNotice.action ? (
        <AppRoundedButton
          style={tw`mt-6 w-full max-w-sm self-center`}
          suffixIcon={mostRecentUndismissedNotice.action.suffixIcon}
          onPress={() => {
            mostRecentUndismissedNotice.action?.onPress?.();
            bottomSheetRef.current?.close();
          }}>
          <AppText style={tw`text-base font-medium text-black`}>
            {mostRecentUndismissedNotice.action.label}
          </AppText>
        </AppRoundedButton>
      ) : null}
    </AppBottomSheet>
  );
};

export default NoticeBottomSheet;
