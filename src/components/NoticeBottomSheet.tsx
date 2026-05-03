import * as Haptics from 'expo-haptics';
import React, { forwardRef, ForwardRefRenderFunction, useCallback } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import ErrorAnimation from '@/components/Animations/ErrorAnimation';
import InfoAnimation from '@/components/Animations/InfoAnimation';
import SuccessAnimation from '@/components/Animations/SuccessAnimation';
import WarningAnimation from '@/components/Animations/WarningAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { Notice, type NoticeType } from '@/stores/notice';

const NoticeBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    notice: Notice;
  }
> = ({ notice, style, onClose }, forwardedRef) => {
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

  const onPresent = useCallback(() => {
    if (notice.type === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (notice.type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (notice.type === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [notice]);

  return (
    <AppBottomSheet
      ref={forwardedRef}
      initialDetentAnimated
      detents={['auto']}
      initialDetentIndex={0}
      style={[tw`p-6`, style]}
      onClose={onClose}
      onDidPresent={onPresent}>
      <View style={tw`flex flex-col h-32 w-32 items-center justify-center mx-auto`}>
        {getAnimation(notice.type)}
      </View>
      <View style={tw`flex flex-col items-center grow self-stretch mt-4`}>
        <AppText
          style={tw`text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {notice.message}
        </AppText>
        {notice.description ? (
          <AppText
            style={tw`mt-2 text-center text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {notice.description}
          </AppText>
        ) : null}
      </View>

      {notice.action ? (
        <AppRoundedButton
          style={tw`mt-6 w-full max-w-sm self-center`}
          suffixIcon={notice.action.suffixIcon}
          onPress={() => {
            notice.action?.onPress?.();
            onClose?.();
          }}>
          <AppText style={tw`text-base font-medium text-black`}>{notice.action.label}</AppText>
        </AppRoundedButton>
      ) : null}
    </AppBottomSheet>
  );
};

export default forwardRef(NoticeBottomSheet);
