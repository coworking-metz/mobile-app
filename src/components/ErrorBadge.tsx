import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import tw from 'twrnc';
import ErrorAnimation from '@/components/Animations/ErrorAnimation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AnyError, isSilentError, parseErrorText } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

const ErrorBadge = ({
  title,
  error,
  style,
  loading = false,
  onRetry,
}: {
  title: string;
  error?: AnyError | null;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
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

  if (!error || isSilentError(error)) return null;

  return (
    <TouchableOpacity disabled={loading} style={style} onPress={onPress}>
      {loading ? (
        <LoadingSpinner beamSize={2} style={tw`size-5`} />
      ) : (
        <ErrorAnimation style={tw`size-5`} />
      )}
    </TouchableOpacity>
  );
};

export default ErrorBadge;
