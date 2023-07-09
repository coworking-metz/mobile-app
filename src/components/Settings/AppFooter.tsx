import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type ViewProps } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';

const AppFooter = ({ style, ...props }: ViewProps) => {
  useDeviceContext(tw);
  const { t } = useTranslation();

  return (
    <View style={[tw`flex flex-col items-center gap-1 text-center py-6`, style]} {...props}>
      <Text style={tw`text-slate-500`}>{t('footer.copyright')}</Text>
      <Text style={tw`text-slate-500`}>{t('footer.madeWith')}</Text>
      <Text style={tw`text-amber-500`}>{t('footer.about')}</Text>
    </View>
  );
};

export default AppFooter;
