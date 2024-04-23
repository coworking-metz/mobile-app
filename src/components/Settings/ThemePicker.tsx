import ServiceRow, { type ServiceRowProps } from './ServiceRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import tw from 'twrnc';
import { useAppThemePreference } from '@/services/theme';

const ThemePicker = (props: Omit<ServiceRowProps, 'label' | 'prefixIcon'>) => {
  const { t } = useTranslation();
  const chosenTheme = useAppThemePreference();

  return (
    <ServiceRow {...props} label={t('settings.general.theme.label')} prefixIcon="circle-half-full">
      <Text style={tw`text-base font-normal text-amber-500 grow text-right`}>
        {t(`settings.general.theme.options.${chosenTheme}`)}
      </Text>
    </ServiceRow>
  );
};

export default ThemePicker;
