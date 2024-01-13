import * as british from './locales/en-GB';
import * as french from './locales/fr-FR';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import * as Localisation from 'expo-localization';
// @see https://dev.to/ramonak/react-native-internationalization-with-i18next-568n
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl-pluralrules';

// load all dayjs locales supported by the app
import 'dayjs/locale/fr';
import 'dayjs/locale/en';

dayjs.extend(RelativeTime);
dayjs.extend(LocalizedFormat);

export const SYSTEM_LANGUAGE = Localisation.locale.substring(0, 2);

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

export const getLanguageLabel = (languageCode: string): string | null => {
  return APP_LANGUAGES.find(({ code }) => code === languageCode)?.label || null;
};

i18n.use(initReactI18next).init({
  resources: APP_LANGUAGES.reduce((acc, language) => ({ ...acc, [language.code]: language }), {}),
  lng: Localisation.locale.substring(0, 2),
  // fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
