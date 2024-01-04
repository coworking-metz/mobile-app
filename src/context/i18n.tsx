import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SYSTEM_LANGUAGE } from '@/i18n';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const I18nContext = createContext<{
  language: string | null;
  ready: boolean;
}>({ language: null, ready: false });

export const useAppI18n = () => {
  return useContext(I18nContext);
};

const useChosenLanguange = (language: string | null, setReady: (ready: boolean) => void) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const chosenLanguage = !language || language === SYSTEM_OPTION ? SYSTEM_LANGUAGE : language;
    const isLanguageSupported = Object.keys(i18n.options.resources || {}).includes(chosenLanguage);
    const appliedLanguage = isLanguageSupported
      ? chosenLanguage
      : process.env.EXPO_PUBLIC_DEFAULT_LANGUAGE;
    i18n.changeLanguage(appliedLanguage);
    dayjs.locale(appliedLanguage);
    setReady(true);
  }, [i18n, language]);
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const { language } = useSettingsStore();

  useChosenLanguange(language, setReady);

  return <I18nContext.Provider value={{ language, ready }}>{children}</I18nContext.Provider>;
};
