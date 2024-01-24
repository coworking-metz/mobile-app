import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type ViewProps } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';

const AppFooter = ({ style, ...props }: ViewProps) => {
  useDeviceContext(tw);
  const { t } = useTranslation();

  return (
    <View style={[tw`flex flex-col gap-1 w-full`, style]} {...props}>
      <Text style={tw`font-normal text-slate-500 text-center`}>
        {t('footer.copyright', { year: dayjs().year() })}
      </Text>
      <Text style={tw`font-normal text-slate-500 text-center`}>{t('footer.madeWith')}</Text>

      <Link asChild href="/about">
        <Text style={tw`font-normal text-amber-500 text-center`}>{t('footer.about')}</Text>
      </Link>
    </View>
  );
};

export default AppFooter;
