import ErrorAnimation from './Animations/ErrorAnimation';
import HorizontalLoadingAnimation from './Animations/HorizontalLoadingAnimation';
import InfoAnimation from './Animations/InfoAnimation';
import SuccessAnimation from './Animations/SuccessAnimation';
import UnlockAnimation from './Animations/UnlockAnimation';
import WarningAnimation from './Animations/WarningAnimation';
import AppBottomSheet from './AppBottomSheet';
import AppText from './AppText';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import useNoticeStore, { type NoticeType } from '@/stores/notice';

const NoticeBottomSheet = () => {
  const noticeStore = useNoticeStore();
  const mostRecentUndismissedNotice = useNoticeStore((state) =>
    state.history.find((n) => !n.dismissed),
  );

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
      mostRecentUndismissedNotice.onClose?.();
      noticeStore.dismiss(mostRecentUndismissedNotice.id);
    }
  }, [noticeStore]);

  if (!mostRecentUndismissedNotice) return null;

  return (
    <AppBottomSheet onClose={onClose}>
      <View style={tw`flex flex-col items-center gap-4 px-6 pt-6`}>
        <View style={tw`flex flex-col h-32 w-32 items-center justify-center`}>
          {getAnimation(mostRecentUndismissedNotice.type)}
        </View>
        <View style={tw`flex flex-col items-center grow gap-2 self-stretch pb-4`}>
          <AppText
            style={tw`text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {mostRecentUndismissedNotice.message}
          </AppText>
          {mostRecentUndismissedNotice.description && (
            <AppText style={tw`text-center text-xl font-normal text-slate-500 dark:text-slate-400`}>
              {mostRecentUndismissedNotice.description}
            </AppText>
          )}
        </View>
      </View>
    </AppBottomSheet>
  );
};

export default NoticeBottomSheet;
