import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import tw from 'twrnc';
import ErrorAnimation from '@/components/Animations/ErrorAnimation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AnyError, isSilentError } from '@/helpers/error';
import useNoticeStore from '@/stores/notice';

export interface FetchError {
  title?: string;
  error?: AnyError | null;
  updatedAt?: number;
  onRetry?: () => void;
}

const FetchBadge = ({
  errors,
  loading = false,
  style,
}: {
  errors: FetchError[];
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();

  const visibleErrors = useMemo(
    () => errors.filter(({ error }) => error && !isSilentError(error)),
    [errors],
  );

  const onPress = useCallback(() => {
    // same callback may be shared by several errors (e.g. a screen-wide refresh)
    const retries = [
      ...new Set(visibleErrors.map(({ onRetry }) => onRetry).filter((onRetry) => !!onRetry)),
    ];

    noticeStore.addErrors(
      visibleErrors.map(({ title, error, updatedAt }) => ({
        title,
        error: error as AnyError,
        ...(updatedAt && { date: new Date(updatedAt).toISOString() }),
      })),
      {
        ...(retries.length && {
          action: {
            label: t('actions.retry'),
            onPress: () => retries.forEach((retry) => retry()),
            suffixIcon: 'reload',
          },
        }),
      },
    );
  }, [noticeStore, visibleErrors, t]);

  if (!visibleErrors.length) return null;

  return (
    <TouchableOpacity disabled={loading} style={style} onPress={onPress}>
      {loading ? (
        <LoadingSpinner
          beamSize={2}
          ringStyle={tw`border-gray-200 dark:border-zinc-800`}
          style={tw`mx-0.5 size-4`}
        />
      ) : (
        <ErrorAnimation style={tw`size-5`} />
      )}
    </TouchableOpacity>
  );
};

export default FetchBadge;
