import * as Haptics from 'expo-haptics';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native';
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
  const bottomSheetRef = useRef<AppBottomSheetRef | null>(null);
  useImperativeHandle(forwardedRef, () => bottomSheetRef.current as AppBottomSheetRef);

  const getAnimation = (type?: NoticeType) => {
    switch (type) {
      case 'error':
        return <ErrorAnimation style={tw`size-full`} />;
      case 'warning':
        return <WarningAnimation style={tw`size-full`} />;
      case 'success':
        return <SuccessAnimation style={tw`size-full`} />;
      case 'info':
        return <InfoAnimation style={tw`size-full`} />;
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

  const isDescriptionCode = useMemo(() => {
    return notice.description?.startsWith('<') || notice.description?.startsWith('{');
  }, [notice.description]);

  return (
    <AppBottomSheet
      ref={bottomSheetRef}
      initialDetentAnimated
      detents={['auto']}
      initialDetentIndex={0}
      style={[tw`p-6`, style]}
      onClose={onClose}
      onDidPresent={onPresent}>
      <View style={tw`mx-auto flex size-32 flex-col items-center justify-center`}>
        {getAnimation(notice.type)}
      </View>
      <View style={tw`mt-4 flex grow flex-col items-center self-stretch`}>
        <AppText
          style={tw`text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {notice.message}
        </AppText>
        {notice.description ? (
          isDescriptionCode ? (
            <ScrollView
              horizontal
              persistentScrollbar
              contentContainerStyle={tw``}
              style={tw`mt-4 rounded-2xl bg-gray-200 px-4 py-2 dark:bg-black`}>
              <AppText
                style={tw`whitespace-pre text-left font-mono text-sm text-slate-500 dark:text-neutral-500`}>
                {notice.description.trim()}
              </AppText>
            </ScrollView>
          ) : (
            <AppText
              style={tw`mt-2 text-center text-base font-normal text-slate-500 dark:text-neutral-500`}>
              {notice.description}
            </AppText>
          )
        ) : null}
      </View>

      {notice.action ? (
        <AppRoundedButton
          label={notice.action.label}
          style={tw`mt-6 w-full max-w-sm self-center`}
          suffixIcon={notice.action.suffixIcon}
          onPress={() => {
            notice.action?.onPress?.();
            bottomSheetRef.current?.close();
            onClose?.();
          }}
        />
      ) : null}
    </AppBottomSheet>
  );
};

export default forwardRef(NoticeBottomSheet);
