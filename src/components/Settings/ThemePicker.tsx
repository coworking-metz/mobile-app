import ServiceRow, { type ServiceRowProps } from './ServiceRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import { useAppThemePreference } from '@/services/theme';

const ThemePicker = (props: Omit<ServiceRowProps, 'label' | 'prefixIcon'>) => {
  const { t } = useTranslation();
  const chosenTheme = useAppThemePreference();

  return (
    <ServiceRow {...props} label={t('settings.general.theme.label')} prefixIcon="circle-half-full">
      <AppText style={tw`text-base font-normal text-amber-500 text-right`}>
        {t(`settings.general.theme.options.${chosenTheme}`)}
      </AppText>
    </ServiceRow>
  );
};

export default ThemePicker;
