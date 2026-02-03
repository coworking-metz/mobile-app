import {
  type AxiosError,
  type AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type CancelToken,
  type InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import { AnyError, ApiErrorCode } from '@/helpers/error';
import { log } from '@/helpers/logger';
import i18n, { formatDuration } from '@/i18n';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const httpLogger = log.extend(`[http]`);

export interface AppAxiosRequestConfig<D = unknown> extends InternalAxiosRequestConfig<D> {
  id?: string;
  cancelToken?: CancelToken;
}

const MAX_REQUEST_RETRIES = 1;

// to avoid dependency cycle @see https://stackoverflow.com/a/51048400/15183871
const createHttpInterceptors = (httpInstance: AxiosInstance) => {
  httpInstance.interceptors.request.use(async (config: AppAxiosRequestConfig) => {
    const apiBaseUrl = useSettingsStore.getState().apiBaseUrl;
    if (apiBaseUrl) {
      config.baseURL = apiBaseUrl;
    }

    return config;
  });

  httpInstance.interceptors.request.use((config: AppAxiosRequestConfig) => {
    httpLogger.trace(
      `>> ${[
        config.method?.toUpperCase(),
        config.url,
        config.data && `\n${JSON.stringify(config.data, null, 2)}`,
      ]
        .filter(Boolean)
        .join(' ')}`,
    );

    return config;
  });

  httpInstance.interceptors.request.use(async (config: AppAxiosRequestConfig) => {
    const authState = useAuthStore.getState();
    const accessToken = authState.refreshToken ? await authState.getOrRefreshAccessToken() : null;

    const headers = {
      ...config.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(i18n.language && { 'Accept-Language': i18n.language }),
    } as AxiosHeaders;

    return {
      ...config,
      headers,
    };
  });

  axiosRetry(httpInstance, {
    retries: MAX_REQUEST_RETRIES,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: async (error: AxiosError) => {
      // check if the access token has been expired
      const axiosError = error as AxiosError;

      const is401 = axiosError.response?.status === 401;
      if (!is401) return false;

      const hadAccessToken = !!(axiosError.response?.config?.headers as AxiosHeaders).get(
        'Authorization',
      );
      if (!hadAccessToken) return false;

      const responseContentType = axiosError.response?.headers?.['content-type'];
      const isResponseContentJson = ((responseContentType || '') as string).includes(
        'application/json',
      );
      if (!isResponseContentJson) return false;

      // if the expected response type was blob,
      // the data won't be automatically parsed as JSON by axios
      // we need to do it ourselves
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content = axiosError.response?.data as any;
      const parsedError =
        typeof content?.text === 'function' ? JSON.parse(await content.text()) : content;
      const isTokenExpired = parsedError.code === ApiErrorCode.EXPIRED_ACCESS_TOKEN;
      if (isTokenExpired) {
        // should fetch another access token and retry
        httpLogger.warn(
          `Retrying to get an access token for ${error.config?.method?.toUpperCase()} ${
            error.config?.url
          }`,
        );
        await useAuthStore.getState().refreshAccessToken();
        return true;
      }
      return false;
    },
  });

  httpInstance.interceptors.response.use(
    (response) => response,
    async (error: AnyError) => {
      const axiosError = error as AxiosError;

      // handle timeout error by translating with a proper message
      if (axiosError.code === 'ECONNABORTED' && axiosError.message?.includes('timeout')) {
        const timeoutDuration = axiosError.config?.timeout;
        const errorMessage = i18n.t(
          'errors.timeout.message',
          timeoutDuration
            ? {
                withDuration: i18n.t('errors.timeout.withDuration', {
                  duration: formatDuration(timeoutDuration),
                }),
              }
            : {},
        );
        return Promise.reject(new Error(errorMessage));
      }

      return Promise.reject(error);
    },
  );

  httpInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      httpLogger.trace(
        `<< ${[response.config.method?.toUpperCase(), response.config.url]
          .filter(Boolean)
          .join(' ')}`,
        `\n${JSON.stringify(response.data, null, 2)}`,
      );

      return Promise.resolve(response);
    },
    (error: AxiosError & { config: AppAxiosRequestConfig }) => {
      if (error.config) {
        httpLogger.error(
          `<< ${[error.config.method?.toUpperCase(), error.config.url].filter(Boolean).join(' ')}`,
          `\n${JSON.stringify(error.response?.data, null, 2)}`,
        );
      } else {
        httpLogger.error(error);
      }

      return Promise.reject(error);
    },
  );
};

export default createHttpInterceptors;
