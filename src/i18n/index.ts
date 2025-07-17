import * as british from './locales/en-GB';
import * as french from './locales/fr-FR';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import * as Localisation from 'expo-localization';
// @see https://dev.to/ramonak/react-native-internationalization-with-i18next-568n
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl-pluralrules';

// load all dayjs locales supported by the app
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);
dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(utc);

dayjs.updateLocale('fr', {
  calendar: {
    lastDay: '[Hier à] LT',
    sameDay: "[Aujourd'hui à] LT",
    nextDay: '[Demain à] LT',
    lastWeek: 'dddd [dernier à] LT',
    nextWeek: 'dddd [à] LT',
    sameElse: '[Le] dddd D MMMM à LT',
  },
  relativeTime: {
    ...dayjs.Ls['fr'].relativeTime,
    s: 'un instant',
  },
});

dayjs.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday at] LT',
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    lastWeek: '[Last] dddd [at] LT',
    nextWeek: 'dddd [at] LT',
    sameElse: 'dddd MMMM D [at] LT',
  },
});

export const formatDuration = (milliseconds: number): string => {
  const dayJSduration = dayjs.duration(milliseconds, 'milliseconds');
  const days = dayJSduration.get('day');
  const minutes = dayJSduration.get('minute');
  const seconds = dayJSduration.get('second');
  const dynamicFormats = [!!days && 'H[h]', !!minutes && 'm[m]', !!seconds && 's[s]']
    .filter(Boolean)
    .join(' ');

  return dayJSduration.format(dynamicFormats);
};

export const APP_LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    translation: british,
  },
  {
    code: 'fr',
    label: 'Français',
    translation: french,
  },
];

export const getLanguageLabel = (languageCode: string | null): string | null => {
  return APP_LANGUAGES.find(({ code }) => code === languageCode)?.label || null;
};

const [firstLocale] = Localisation.getLocales();
export const SYSTEM_LANGUAGE = firstLocale?.languageCode;

i18n.use(initReactI18next).init({
  resources: APP_LANGUAGES.reduce((acc, language) => ({ ...acc, [language.code]: language }), {}),
  lng: SYSTEM_LANGUAGE || '',
  // fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
