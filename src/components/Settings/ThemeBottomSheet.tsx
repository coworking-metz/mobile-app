import DarklightModeAnimation from './DarklightModeAnimation';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, { type AppBottomSheetProps } from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { IS_RUNNING_IN_EXPO_GO } from '@/services/environment';
import {
  setAppThemePreference,
  useAppThemePreference,
  type AppThemePreference,
} from '@/services/theme';
import useSettingsStore from '@/stores/settings';

const ThemeBottomSheet = (props: Omit<AppBottomSheetProps, 'children'>) => {
  const { t } = useTranslation();
  const supportedThemes: { label: string; code: AppThemePreference }[] = [
    { label: t('settings.general.theme.options.system'), code: 'system' },
    { label: t('settings.general.theme.options.light'), code: 'light' },
    { label: t('settings.general.theme.options.dark'), code: 'dark' },
  ];
  const currentTheme = useColorScheme();
  const chosenTheme = useAppThemePreference();

  const onThemePicked = useCallback((newTheme: AppThemePreference) => {
    setAppThemePreference(newTheme);
    useSettingsStore.setState({ theme: newTheme });
  }, []);

  return (
    <AppBottomSheet contentContainerStyle={tw`pt-6`} {...props}>
      <DarklightModeAnimation mode={currentTheme} style={tw`w-full h-28 mt-5`} />
      <AppText style={tw`text-center text-xl text-slate-900 dark:text-gray-200 font-medium my-5`}>
        {t('settings.general.theme.label')}
      </AppText>
      {supportedThemes.map((theme) => (
        <ServiceRow
          description={
            theme.code === 'system' && chosenTheme === 'system'
              ? t(`settings.general.theme.value.${currentTheme}`)
              : ''
          }
          disabled={IS_RUNNING_IN_EXPO_GO}
          key={`language-option-${theme.code}`}
          label={theme.label}
          selected={chosenTheme === theme.code}
          style={tw`px-3 mx-3`}
          suffixIcon={chosenTheme === theme.code ? 'check' : null}
          onPress={() => onThemePicked(theme.code)}
        />
      ))}
    </AppBottomSheet>
  );
};

export default ThemeBottomSheet;
