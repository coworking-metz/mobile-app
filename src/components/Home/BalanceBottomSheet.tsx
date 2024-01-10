import CouponsAnimation from '../Animations/CouponsAnimation';
import AppBottomSheet from '../AppBottomSheet';
import ServiceRow from '../Settings/ServiceRow';
import { Button } from '@ddx0510/react-native-ui-lib';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const TicketsBottomSheet = ({
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
      <View style={tw`flex flex-col w-full justify-between p-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <CouponsAnimation style={tw`h-56`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('home.profile.tickets.label')}
        </Text>
        <Text style={tw`text-left text-base text-slate-500 dark:text-slate-400 w-full mt-4`}>
          {t('home.profile.tickets.description')}
        </Text>
        <ServiceRow label={t('home.profile.tickets.balance.label')} style={tw`w-full px-0`}>
          <Text style={tw`text-base text-slate-500 grow text-right`}>
            {balance >= 0
              ? t('home.profile.tickets.available', {
                  count: balance,
                })
              : t('home.profile.tickets.depleted', {
                  count: -balance,
                })}
          </Text>
        </ServiceRow>
        {balance < 0 ? (
          <View style={tw`flex flex-row items-start flex-gap-2 w-full overflow-hidden`}>
            <MaterialCommunityIcons
              color={tw.color('yellow-500')}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="alert"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <Text style={tw`text-base text-slate-500 shrink grow basis-0`}>
              {t('home.profile.tickets.balance.onDepleted', {
                count: -balance,
              })}
            </Text>
          </View>
        ) : (
          <></>
        )}
        <Link asChild href="https://www.coworking-metz.fr/boutique/carnet-10-journees/">
          <Button backgroundColor={theme.darkVanilla} style={tw`h-14 self-stretch`}>
            <Text style={tw`text-base font-medium`}>{t('home.profile.tickets.order')}</Text>
          </Button>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default TicketsBottomSheet;
