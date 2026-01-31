import ErrorAnimation from './Animations/ErrorAnimation';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import tw from 'twrnc';
import { AnyError, parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ErrorBadge = ({
  title,
  error,
  style,
  onRetry,
}: {
  title: string;
  error?: AnyError;
  style?: StyleProp<ViewStyle>;
  onRetry?: () => void;
}) => {
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();

  const onPress = useCallback(async () => {
    const description = error ? await parseErrorText(error) : null;
    noticeStore.add({
      message: title,
      type: 'error',
      ...(description && { description }),
      ...(onRetry && {
        action: {
          label: t('actions.retry'),
          onPress: onRetry,
          suffixIcon: 'reload',
        },
      }),
    });
  }, [noticeStore, title, error]);

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <ErrorAnimation style={tw`h-5 w-5`} />
    </TouchableOpacity>
  );
};

export default ErrorBadge;
