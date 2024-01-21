import ServiceRow from './ServiceRow';
import AppBottomSheet, { type AppBottomSheetProps } from '../AppBottomSheet';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme, View } from 'react-native';
import tw from 'twrnc';

const IS_RUNNING_IN_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type ThemePreference = 'light' | 'dark' | 'auto';
let setThemePreference: (theme: ThemePreference) => void;
let useThemePreference: () => 'light' | 'dark' | 'auto';
if (IS_RUNNING_IN_EXPO_GO) {
  setThemePreference = () => null;
  useThemePreference = () => 'auto';
} else {
  setThemePreference = require('@vonovak/react-native-theme-control').setThemePreference; // eslint-disable-line @typescript-eslint/no-var-requires
  useThemePreference = require('@vonovak/react-native-theme-control').useThemePreference; // eslint-disable-line @typescript-eslint/no-var-requires
}

const ThemeOptions = () => {
  const { t } = useTranslation();
  const supportedThemes: { label: string; code: ThemePreference }[] = [
    { label: t('settings.general.theme.value.auto'), code: 'auto' },
    { label: t('settings.general.theme.value.light'), code: 'light' },
    { label: t('settings.general.theme.value.dark'), code: 'dark' },
  ];
  const currentTheme = useColorScheme();
  const chosenTheme = useThemePreference();
  const { close } = useBottomSheet();

  const onThemePicked = useCallback(
    (newTheme: ThemePreference) => {
      setThemePreference(newTheme);
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
            theme.code === 'auto' && chosenTheme === 'auto'
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
