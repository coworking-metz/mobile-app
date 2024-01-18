import { type AppAxiosRequestConfig } from '../interceptors';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { log } from '@/helpers/logger';

const amourFoodHttpLogger = log.extend(`[http]`);

const amourFoodHttpInstance = axios.create({
  baseURL: 'https://lamourfood.fr/wp-json/',
  timeout: Number.parseInt(process.env.EXPO_PUBLIC_TIMEOUT_IN_MS || '0', 10) || 10000,
  headers: {
    'X-Client': 'COWORKING_MOBILE',
  },
});

amourFoodHttpInstance.interceptors.request.use((config: AppAxiosRequestConfig) => {
  amourFoodHttpLogger.trace(
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

amourFoodHttpInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    amourFoodHttpLogger.trace(
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
      amourFoodHttpLogger.error(
        `<< ${[error.config.method?.toUpperCase(), error.config.url].filter(Boolean).join(' ')}`,
        error.response?.data,
      );
    } else {
      amourFoodHttpLogger.error(error);
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

export interface AmourFoodEvent {
  date: string;
  time: number;
  disponible: boolean;
  nom: string;
  description: string;
  illustration: string;
  permalink: string;
  location: string;
  details: {
    plat_viande: string;
    accompagnement_viande: string;
    plat_vege: string;
    accompagnement_vege: string;
    desserts: string;
  };
}

export const getAmourFoodEvents = (): Promise<AmourFoodEvent[]> => {
  return amourFoodHttpInstance.get('custom/v1/menu').then(({ data }) =>
    data.map((event: AmourFoodEvent) => ({
      ...event,
      time: event.time * 1000,
      location: "L'Amour Food, 7 Av. de Blida, 57000 Metz",
      description: event.description.replace(/<[^>]*>?/gm, ''), // strip HTML tags
    })),
  );
};
