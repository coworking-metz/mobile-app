import { type AxiosError } from 'axios';

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

/**
 * Silence some errors that don't need to be handled by the UI.
 *
 * @param error
 * @returns
 */
export const handleSilentError = async (error: AppError | AxiosError): Promise<void> => {
  if (
    [AppErrorCode.DISCONNECTED, AppErrorCode.CANCELED].includes((error as AppError)?.code) ||
    [ApiErrorCode.EXPIRED_ACCESS_TOKEN].includes(
      ((error as AxiosError).response?.data as ApiError)?.code,
    )
  ) {
    return Promise.resolve();
  }
  return Promise.reject(error);
};
