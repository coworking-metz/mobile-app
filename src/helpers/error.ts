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

export interface DisconnectedError extends AppError {
  cause: AxiosError<ApiError>;
}

export type AnyError = AppError | AxiosError<ApiError> | Error;

export const parseErrorText = async (error: AnyError): Promise<string> => {
  const contentType = (error as AxiosError).response?.headers?.['content-type'] as string;
  const contentLength = (error as AxiosError).response?.headers?.['content-length'] as string;
  const hasContent = !contentLength || parseInt(contentLength, 10) > 0;
  if (hasContent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (error as AxiosError).response?.data as any;
    const isParseable = typeof content?.text === 'function';
    const isBodyJson = contentType?.includes('json');
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
