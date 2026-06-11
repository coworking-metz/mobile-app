import React from 'react';
import { useTranslation } from 'react-i18next';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import ServiceRow, { type ServiceRowProps } from '@/components/Layout/ServiceRow';
import { useAppThemePreference } from '@/services/theme';

const ThemePicker = (props: Omit<ServiceRowProps, 'label' | 'prefixIcon'>) => {
  const { t } = useTranslation();
  const chosenTheme = useAppThemePreference();

  return (
    <ServiceRow {...props} label={t('settings.theme.label')} prefixIcon="circle-half-full">
      <AppText style={tw`text-right text-base font-normal text-amber-500`}>
        {t(`settings.theme.options.${chosenTheme}`)}
      </AppText>
    </ServiceRow>
  );
};

export default ThemePicker;
