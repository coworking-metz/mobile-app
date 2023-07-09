import CouponsAnimation from '../Animations/CouponsAnimation';
import AppBottomSheet from '../AppBottomSheet';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const CouponsBottomSheet = ({
  balance,
  style,
  onClose,
}: {
  balance: number;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col items-center justify-between gap-4 p-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <CouponsAnimation style={tw`h-56`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('home.tickets.coupons.label')}
        </Text>
        <Text style={tw`text-left text-base text-slate-500 dark:text-slate-400 w-full`}>
          {t('home.tickets.coupons.description')}
        </Text>
        <Link asChild href="https://www.coworking-metz.fr/boutique/carnet-10-journees/">
          <Button backgroundColor={theme.darkVanilla} style={tw`h-14 self-stretch`}>
            <Text style={tw`text-base font-medium`}>{t('home.tickets.coupons.order')}</Text>
          </Button>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default CouponsBottomSheet;
