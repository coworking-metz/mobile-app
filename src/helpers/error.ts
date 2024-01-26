import { type AxiosError } from 'axios';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastPresets } from 'react-native-ui-lib';
import useNoticeStore from '@/stores/notice';
import useToastStore from '@/stores/toast';

export enum ApiErrorCode {
  EXPIRED_ACCESS_TOKEN = 'EXPIRED_ACCESS_TOKEN',
}

export interface ApiError {
  code: ApiErrorCode;
  data: unknown;
  message: string;
  statusCode: number;
}

export enum AppErrorCode {
  DISCONNECTED = 'DISCONNECTED',
  CANCELED = 'CANCELED',
}

export interface AppError extends Error {
  code: AppErrorCode;
}

export const parseErrorText = async (error: AxiosError | Error): Promise<string> => {
  const contentType = (error as AxiosError).response?.headers?.['content-type'] as string;
  const contentLength = (error as AxiosError).response?.headers?.['content-length'] as string;
  const hasContent = !contentLength || parseInt(contentLength, 10) > 0;
  const isBodyJson = hasContent && contentType?.includes('json');
  if (hasContent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (error as AxiosError).response?.data as any;
    const isParseable = typeof content?.text === 'function';
    if (isParseable && isBodyJson) {
      const isEmpty = !content?.size;
      if (!isEmpty) {
        const parsedError = JSON.parse(await content.text());
        return parsedError.message || parsedError.error;
      }
      return error.message;
    }
    if (content) {
      return typeof content !== 'string' ? content.message : content;
    }
  }
  return error.message;
};

export type AnyError = AppError | AxiosError<ApiError> | Error;

export const isSilentError = (error: AnyError): boolean =>
  [AppErrorCode.DISCONNECTED, AppErrorCode.CANCELED].includes((error as AppError)?.code) ||
  [ApiErrorCode.EXPIRED_ACCESS_TOKEN].includes(
    ((error as AxiosError).response?.data as ApiError)?.code,
  );

/**
 * Silence some errors that don't need to be handled by the UI.
 */
export const handleSilentError = async (error: AppError | AxiosError): Promise<void> => {
  if (isSilentError(error)) {
    return Promise.resolve();
  }
  return Promise.reject(error);
};

export const useErrorNotification = () => {
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
  const { t } = useTranslation();

  const notifyError = useCallback(
    async (label: string, error: Error) => {
      const errorMessage = await parseErrorText(error);
      const toast = toastStore.add({
        message: label,
        type: ToastPresets.FAILURE,
        action: {
          label: t('actions.more'),
          onPress: () => {
            noticeStore.add({
              message: label,
              description: errorMessage,
              type: 'error',
            });
            toastStore.dismiss(toast.id);
          },
        },
      });
    },
    [toastStore, noticeStore, t],
  );

  return notifyError;
};
