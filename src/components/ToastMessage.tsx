import { Incubator, type ToastProps } from '@ddx0510/react-native-ui-lib';
import React, { useCallback, useEffect, useState } from 'react';
import tw from 'twrnc';
import useToastStore from '@/stores/toast';

const ToastMessage = ({ style, messageStyle, ...props }: ToastProps) => {
  const toastStore = useToastStore();
  const mostRecentUndismissedToast = useToastStore((state) =>
    state.history.find((n) => !n.dismissed),
  );
  const [isToastVisible, setToastVisible] = useState<boolean>(true);

  const onDismiss = useCallback(() => {
    setToastVisible(false);
  }, [toastStore]);

  const onAnimationEnd = useCallback(() => {
    if (!isToastVisible) {
      if (mostRecentUndismissedToast?.id) {
        toastStore.dismiss(mostRecentUndismissedToast.id);
      }
    }
  }, [toastStore, isToastVisible]);

  useEffect(() => {
    if (mostRecentUndismissedToast) {
      setToastVisible(true);
    }
  }, [mostRecentUndismissedToast]);

  if (!mostRecentUndismissedToast) return null;

  return (
    <Incubator.Toast
      enableHapticFeedback
      swipeable
      action={
        mostRecentUndismissedToast.action && {
          labelProps: {
            style: tw`dark:text-gray-200`,
          },
          style: tw`border-l-[0.5px] border-l-gray-300 dark:border-l-gray-700 rounded-r-lg px-4 h-full`,
          ...mostRecentUndismissedToast.action,
        }
      }
      autoDismiss={mostRecentUndismissedToast.timeout}
      message={mostRecentUndismissedToast.message}
      messageStyle={[tw`dark:text-gray-200`, messageStyle]}
      position="top"
      preset={mostRecentUndismissedToast.type}
      style={[tw`dark:bg-zinc-900`, style]}
      visible={isToastVisible}
      onAnimationEnd={onAnimationEnd}
      onDismiss={onDismiss}
      {...props}
    />
  );
};

export default ToastMessage;
