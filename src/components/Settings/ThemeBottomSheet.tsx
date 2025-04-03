import DarklightModeAnimation from './DarklightModeAnimation';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme, View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, { type AppBottomSheetProps } from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Settings/ServiceRow';
import { IS_RUNNING_IN_EXPO_GO } from '@/services/environment';
import {
  setAppThemePreference,
  useAppThemePreference,
  type AppThemePreference,
} from '@/services/theme';
import useSettingsStore from '@/stores/settings';

const ThemeOptions = () => {
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
    <View style={tw`flex flex-col w-full gap-1 pb-3 pt-6`}>
      <AppText style={tw`text-center text-xl text-slate-900 dark:text-gray-200 font-medium mb-5`}>
        {t('settings.general.theme.label')}
      </AppText>
      <DarklightModeAnimation mode={currentTheme} style={tw`w-full h-28 mb-4`} />
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
          style={[tw`px-3 mx-3`]}
          suffixIcon={chosenTheme === theme.code ? 'check' : null}
          onPress={() => onThemePicked(theme.code)}
        />
      ))}
    </View>
  );
};

const ThemeBottomSheet = (props: Omit<AppBottomSheetProps, 'children'>) => {
  return (
    <AppBottomSheet {...props}>
      <ThemeOptions />
    </AppBottomSheet>
  );
};

export default ThemeBottomSheet;
