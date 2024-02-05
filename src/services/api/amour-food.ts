import { type CalendarEvent } from './calendar';
import { type AppAxiosRequestConfig } from '../interceptors';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { log } from '@/helpers/logger';

const amourFoodHttpLogger = log.extend(`[http]`);

const amourFoodHttpInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_AMOUR_FOOD_API_BASE_URL,
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
      `<< ${[response.config.method?.toUpperCase(), response.config.url]
        .filter(Boolean)
        .join(' ')}`,
      response.data,
    );

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

export const getAmourFoodEvents = (): Promise<CalendarEvent[]> => {
  return amourFoodHttpInstance.get('custom/v1/menu').then(({ data }) =>
    data
      .map(
        (event: AmourFoodEvent) =>
          ({
            id: event.time,
            start: dayjs(event.time * 1000)
              .add(11, 'hour')
              .toISOString(),
            end: dayjs(event.time * 1000)
              .add(12, 'hour')
              .add(30, 'minute')
              .toISOString(),
            label: event.nom,
            description: event.description.replace(/<[^>]*>?/gm, ''), // strip HTML tags
            location: "L'Amour Food, 7 Av. de Blida, 57000 Metz",
            url: event.permalink,
            picture: event.illustration,
            category: 'AMOUR_FOOD',
          }) as CalendarEvent,
      )
      .sort((a: CalendarEvent, b: CalendarEvent) => dayjs(a.start).diff(b.start)),
  );
};
