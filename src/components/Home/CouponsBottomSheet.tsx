import CouponsAnimation from '../Animations/CouponsAnimation';
import AppBottomSheet from '../AppBottomSheet';
import ServiceRow from '../Settings/ServiceRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      <View style={tw`flex flex-col items-center justify-between p-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <CouponsAnimation style={tw`h-56`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('home.tickets.coupons.label')}
        </Text>
        <Text style={tw`text-left text-base text-slate-500 dark:text-slate-400 w-full mt-4`}>
          {t('home.tickets.coupons.description')}
        </Text>
        <ServiceRow label={t('home.tickets.coupons.balance.label')} style={tw`w-full px-0`}>
          <Text style={tw`text-base text-slate-500 ml-auto`}>
            {balance >= 0
              ? t('home.tickets.coupons.available', {
                  count: balance,
                })
              : t('home.tickets.coupons.depleted', {
                  count: -balance,
                })}
          </Text>
        </ServiceRow>
        {balance < 0 ? (
          <View style={tw`flex flex-row items-start flex-gap-2 w-full overflow-hidden mb-4`}>
            <MaterialCommunityIcons
              color={tw.color('yellow-500')}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="alert"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <Text style={tw`text-base text-slate-500 shrink grow basis-0`}>
              {t('home.tickets.coupons.balance.onDepleted', {
                count: -balance,
              })}
            </Text>
          </View>
        ) : (
          <></>
        )}
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
