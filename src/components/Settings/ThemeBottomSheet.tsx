import ServiceRow from './ServiceRow';
import AppBottomSheet, { type AppBottomSheetProps } from '../AppBottomSheet';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme, View } from 'react-native';
import tw from 'twrnc';
import { IS_RUNNING_IN_EXPO_GO } from '@/services/environment';
import {
  type AppThemePreference,
  setAppThemePreference,
  useAppThemePreference,
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
  const { close } = useBottomSheet();

  const onThemePicked = useCallback(
    (newTheme: AppThemePreference) => {
      setAppThemePreference(newTheme);
      useSettingsStore.setState({ theme: newTheme });
      close();
    },
    [close],
  );

  return (
    <View style={tw`flex flex-col w-full gap-1 py-3`}>
      <Text style={tw`text-center text-xl text-slate-900 dark:text-gray-200 font-medium mb-5`}>
        {t('settings.general.theme.label')}
      </Text>
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
