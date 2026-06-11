import DarklightModeAnimation from './DarklightModeAnimation';
import React, { forwardRef, ForwardRefRenderFunction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetRef,
  type AppBottomSheetProps,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { IS_RUNNING_IN_EXPO_GO } from '@/services/environment';
import {
  setAppThemePreference,
  useAppThemePreference,
  type AppThemePreference,
} from '@/services/theme';
import useSettingsStore from '@/stores/settings';

const ThemeBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  Omit<AppBottomSheetProps, 'children'>
> = ({ style, ...props }, forwardedRef) => {
  const { t } = useTranslation();
  const supportedThemes: { label: string; code: AppThemePreference }[] = [
    { label: t('settings.theme.options.system'), code: 'system' },
    { label: t('settings.theme.options.light'), code: 'light' },
    { label: t('settings.theme.options.dark'), code: 'dark' },
  ];
  const currentTheme = useColorScheme();
  const animationTheme = currentTheme === 'unspecified' ? null : currentTheme;
  const chosenTheme = useAppThemePreference();

  const onThemePicked = useCallback((newTheme: AppThemePreference) => {
    setAppThemePreference(newTheme);
    useSettingsStore.setState({ theme: newTheme });
  }, []);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`flex flex-col gap-0.5 py-6`, style]} {...props}>
      <DarklightModeAnimation mode={animationTheme} style={tw`mt-5 h-28 w-full`} />
      <AppText style={tw`my-5 text-center text-xl font-medium text-slate-900 dark:text-gray-200`}>
        {t('settings.theme.label')}
      </AppText>
      {supportedThemes.map((theme) => (
        <ServiceRow
          description={
            theme.code === 'system' && chosenTheme === 'system'
              ? t(`settings.theme.value.${currentTheme}`)
              : ''
          }
          disabled={IS_RUNNING_IN_EXPO_GO}
          key={`language-option-${theme.code}`}
          label={theme.label}
          selected={chosenTheme === theme.code}
          style={tw`mx-3 px-3`}
          suffixIcon={chosenTheme === theme.code ? 'check' : null}
          onPress={() => onThemePicked(theme.code)}
        />
      ))}
    </AppBottomSheet>
  );
};

export default forwardRef(ThemeBottomSheet);
