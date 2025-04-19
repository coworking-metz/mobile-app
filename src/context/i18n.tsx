import dayjs from 'dayjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageBottomSheet from '@/components/Settings/LanguageBottomSheet';
import { SYSTEM_LANGUAGE } from '@/i18n';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const I18nContext = createContext<{
  language: string | null;
  ready: boolean;
  selectLanguage: () => void;
}>({ language: null, ready: false, selectLanguage: () => { } });

export const DEFAULT_LANGUAGE = process.env.EXPO_PUBLIC_DEFAULT_LANGUAGE || 'fr';

export const useAppI18n = () => {
  return useContext(I18nContext);
};

const useChosenLanguange = (language: string | null, setReady: (ready: boolean) => void) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const selectedLanguage = !language || language === SYSTEM_OPTION ? SYSTEM_LANGUAGE : language;
    const isLanguageSupported = Object.keys(i18n.options.resources || {}).includes(
      selectedLanguage,
    );
    const appliedLanguage = isLanguageSupported ? selectedLanguage : DEFAULT_LANGUAGE;
    i18n.changeLanguage(appliedLanguage);
    dayjs.locale(appliedLanguage);
    setReady(true);
  }, [i18n, language]);
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const [isSelecting, setSelecting] = useState<boolean>(false);
  const language = useSettingsStore((state) => state.language);

  useChosenLanguange(language, setReady);

  return (
    <I18nContext.Provider value={{ language, ready, selectLanguage: () => setSelecting(true) }}>
      {children}

      {isSelecting && <LanguageBottomSheet onClose={() => setSelecting(false)} />}
    </I18nContext.Provider>
  );
};
