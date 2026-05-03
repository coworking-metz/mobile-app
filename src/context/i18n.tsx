import dayjs from 'dayjs';
import { includes } from 'lodash';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import LanguageBottomSheet from '@/components/Settings/LanguageBottomSheet';
import { SYSTEM_LANGUAGE } from '@/i18n';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const I18nContext = createContext<{
  language: string | null;
  ready: boolean;
  selectLanguage: () => void;
}>({ language: null, ready: false, selectLanguage: () => {} });

export const DEFAULT_LANGUAGE = process.env.EXPO_PUBLIC_DEFAULT_LANGUAGE || 'fr';

export const useAppI18n = () => {
  return useContext(I18nContext);
};

const useChosenLanguange = (language: string | null, setReady: (ready: boolean) => void) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const selectedLanguage = !language || language === SYSTEM_OPTION ? SYSTEM_LANGUAGE : language;
    const isLanguageSupported = includes(
      Object.keys(i18n.options.resources || {}),
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
  const language = useSettingsStore((state) => state.language);
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  useChosenLanguange(language, setReady);

  return (
    <I18nContext.Provider
      value={{ language, ready, selectLanguage: () => bottomSheetRef.current?.open() }}>
      {children}

      <LanguageBottomSheet ref={bottomSheetRef} />
    </I18nContext.Provider>
  );
};
