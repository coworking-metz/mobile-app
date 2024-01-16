import ServiceRow, { type ServiceRowProps } from './ServiceRow';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import tw from 'twrnc';

const IS_RUNNING_IN_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let useThemePreference: () => 'light' | 'dark' | 'auto';
if (IS_RUNNING_IN_EXPO_GO) {
  useThemePreference = () => 'auto';
} else {
  useThemePreference = require('@vonovak/react-native-theme-control').useThemePreference; // eslint-disable-line @typescript-eslint/no-var-requires
}

const ThemePicker = (props: Omit<ServiceRowProps, 'label' | 'prefixIcon'>) => {
  const { t } = useTranslation();
  const chosenTheme = useThemePreference();

  return (
    <ServiceRow {...props} label={t('settings.general.theme.label')} prefixIcon="circle-half-full">
      <Text style={tw`text-base font-normal text-amber-500 grow text-right`}>
        {t(`settings.general.theme.value.${chosenTheme}`)}
      </Text>
    </ServiceRow>
  );
};

export default ThemePicker;
