import { version as appVersion } from '../../package.json';
import {
  type AxiosError,
  type AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type CancelToken,
  type InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import { ToastPresets } from 'react-native-ui-lib';
import { type AppError, AppErrorCode, ApiErrorCode, parseErrorText } from '@/helpers/error';
import { log } from '@/helpers/logger';
import i18n, { formatDuration } from '@/i18n';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore from '@/stores/settings';
import useToastStore from '@/stores/toast';

const httpLogger = log.extend(`[http]`);

export interface AppAxiosRequestConfig<D = unknown> extends InternalAxiosRequestConfig<D> {
  id?: string;
  cancelToken?: CancelToken;
}

const MAX_REQUEST_RETRIES = 1;

// to avoid dependency cycle @see https://stackoverflow.com/a/51048400/15183871
const createHttpInterceptors = (httpInstance: AxiosInstance) => {
  httpInstance.interceptors.request.use(async (config: AppAxiosRequestConfig) => {
    const { apiBaseUrl } = useSettingsStore.getState();
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
        // config.headers && `headers: ${JSON.stringify(config.headers)}`,
        config.data && `\n${JSON.stringify(config.data, null, 2)}`,
      ]
        .filter(Boolean)
        .join(' ')}`,
    );

    return config;
  });

  httpInstance.interceptors.request.use((config: AppAxiosRequestConfig) => {
    // do not add it to the store if it already has a cancelToken
    // meaning: it doesn't want to be managed by the store
    // example: for requests like /entities/me or /auth/token
    if (config.cancelToken) return config;

    //TODO
    // dispatch a new request in the store with the cancelToken source
    // const cancelTokenSource = axios.CancelToken.source();
    // const uuid = uuidv4();

    // const httpStore = useHttpStore();

    // httpStore.addRequest({
    //   id: uuid,
    //   cancelTokenSource,
    // });

    return {
      ...config,
      // id: uuid,
      // cancelToken: cancelTokenSource.token,
    };
  });

  httpInstance.interceptors.request.use((config: AppAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    const headers = {
      ...config.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(appVersion ? { 'X-APP-VERSION': appVersion } : {}),
      ...(i18n.language ? { 'Accept-Language': i18n.language } : {}),
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

      // if the expected response type was blob, the data won't be parsed as JSON by axios
      // we need to do it ourselves
      const content = axiosError.response?.data as any;
      const parsedError =
        typeof content?.text === 'function' ? JSON.parse(await content.text()) : content;
      const isTokenExpired = parsedError.code === ApiErrorCode.EXPIRED_ACCESS_TOKEN;
      if (isTokenExpired) {
        // should fetch another access token and retry
        httpLogger.warn(
          `Retrying to get an access token for ${error.config?.method?.toUpperCase()} ${error.config
            ?.url}`,
        );
        await useAuthStore.getState().refreshAccessToken();
        return true;
      }
      return false;
    },
  });

  httpInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const authStore = useAuthStore.getState();
      // disconnect the user on 401
      if (error.response && error.response.status === 401 && authStore.accessToken) {
        // TODO
        // cancel all requests
        const disconnectedError = new Error('User has been logged out', {
          cause: error,
        }) as AppError;
        disconnectedError.code = AppErrorCode.DISCONNECTED;
        // const httpStore = useHttpStore();
        // httpStore.cancelAllRequests(disconnectedError.message);

        httpLogger.debug(`Login out user`, error.message);

        // the user should be properly logged out
        await authStore.logout();

        // explain what happened to the user
        const toastStore = useToastStore();
        const noticeStore = useNoticeStore();
        const errorMessage = await parseErrorText(error);
        const errorLabel = i18n.t('auth.login.onRefreshTokenFail.message');
        const toast = toastStore.add({
          message: errorLabel,
          type: ToastPresets.FAILURE,
          action: {
            label: i18n.t('actions.more'),
            onPress: () => {
              noticeStore.add({
                message: errorLabel,
                description: errorMessage,
                type: 'error',
              });
              toastStore.dismiss(toast.id);
            },
          },
        });

        return Promise.reject(disconnectedError);
      }

      // handle timeout error by translating with a proper message
      if (error.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
        const timeoutDuration = (error as AxiosError).config?.timeout;
        return Promise.reject(
          new Error(
            i18n.t(
              'errors.timeout.message',
              timeoutDuration
                ? {
                    withDuration: i18n.t('errors.timeout.message', {
                      duration: formatDuration(timeoutDuration),
                    }),
                  }
                : {},
            ),
          ),
        );
      }

      return Promise.reject(error);
    },
  );

  httpInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      httpLogger.trace(
        `<< ${[
          response.config.method?.toUpperCase(),
          response.config.url,
          // config.headers && `headers: ${JSON.stringify(config.headers)}`,
        ]
          .filter(Boolean)
          .join(' ')}`,
        response.data,
      );

      // remove request from the store once it has ended
      const { id } = response.config as AppAxiosRequestConfig;
      if (id) {
        // TODO
        // const httpStore = useHttpStore();
        // httpStore.removeRequest(id);
      }
      return Promise.resolve(response);
    },
    (error: AxiosError & { config: AppAxiosRequestConfig }) => {
      if (error.config) {
        httpLogger.error(
          `<< ${[error.config.method?.toUpperCase(), error.config.url].filter(Boolean).join(' ')}`,
          error.response?.data,
        );
      } else {
        httpLogger.error(error);
      }

      // remove request from the store once it has ended
      // unless it has been aborted: therefore it won't have a config

      if (error.config?.id) {
        // TODO
        // const httpStore = useHttpStore();
        // httpStore.removeRequest(error.config.id);
      }
      return Promise.reject(error);
    },
  );
};

export default createHttpInterceptors;
