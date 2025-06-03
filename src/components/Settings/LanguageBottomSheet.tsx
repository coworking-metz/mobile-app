import SwitchLanguageAnimation from '../Animations/SwitchLanguageAnimation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetRef,
  type AppBottomSheetProps,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { APP_LANGUAGES, getLanguageLabel, SYSTEM_LANGUAGE } from '@/i18n';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const LanguageBottomSheet = (props: Omit<AppBottomSheetProps, 'children'>) => {
  const { t } = useTranslation();
  const supportedLanguages = [
    { label: t('settings.general.language.system.label'), code: SYSTEM_OPTION },
    ...APP_LANGUAGES,
  ];
  const settingsStore = useSettingsStore();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);
  const animation = useRef<LottieView>(null);

  const onBottomSheetChange = useCallback(
    (snapPointIndex: number) => {
      if (snapPointIndex >= 0) {
        animation.current?.play();
      }
    },
    [animation],
  );

  const onLanguagePicked = useCallback(
    (newLanguage: string) => {
      useSettingsStore.setState({ language: newLanguage });
      bottomSheetRef.current?.close();
    },
    [settingsStore, bottomSheetRef],
  );

  return (
    <AppBottomSheet ref={bottomSheetRef} onChange={onBottomSheetChange} {...props}>
      <View style={tw`flex flex-col w-full gap-1 pt-6 pb-3`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <SwitchLanguageAnimation ref={animation} style={tw`h-60 w-full`} />
        </View>
        <AppText style={tw`text-center text-xl text-slate-900 dark:text-gray-200 font-medium mb-5`}>
          {t('settings.general.language.label')}
        </AppText>
        {supportedLanguages.map((language) => (
          <ServiceRow
            description={
              language.code === SYSTEM_OPTION
                ? getLanguageLabel(SYSTEM_LANGUAGE) ||
                `${SYSTEM_LANGUAGE} - ${t('settings.general.language.system.unsupported')}`
                : ''
            }
            key={`language-option-${language.code}`}
            label={language.label}
            selected={settingsStore.language === language.code}
            style={tw`px-3 mx-3`}
            suffixIcon={settingsStore.language === language.code ? 'check' : null}
            onPress={() => onLanguagePicked(language.code)}>
            {!getLanguageLabel(SYSTEM_LANGUAGE) && language.code === SYSTEM_OPTION ? (
              <MaterialCommunityIcons
                color={tw.color('yellow-500')}
                iconStyle={tw`h-6 w-6`}
                name="alert"
                size={24}
                style={tw`shrink-0`}
              />
            ) : null}
          </ServiceRow>
        ))}
      </View>
    </AppBottomSheet>
  );
};

export default LanguageBottomSheet;
