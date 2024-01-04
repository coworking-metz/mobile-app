import CalendarAnimation from '../Animations/CalendarAnimation';
import AppBottomSheet from '../AppBottomSheet';
import ServiceRow from '../Settings/ServiceRow';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import { Button } from 'react-native-ui-lib';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const SubscriptionBottomSheet = ({
  endDate,
  style,
  onClose,
}: {
  endDate: string;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col items-center justify-between gap-4 p-6`}>
        <CalendarAnimation style={tw`w-full`} />
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('home.tickets.subscription.label')}
        </Text>
        <Text style={tw`text-left text-base text-slate-500 dark:text-slate-400 w-full`}>
          {t('home.tickets.subscription.description')}
        </Text>
        <ServiceRow
          description={
            dayjs().isBefore(endDate)
              ? t('home.tickets.subscription.status.ongoingUntil', { prefix: '' })
              : t('home.tickets.subscription.status.expiredSince', { prefix: '' })
          }
          label={t('home.tickets.subscription.label')}
          style={tw`w-full px-0`}>
          <Text style={tw`text-base text-slate-500 grow text-right`}>
            {t('home.tickets.subscription.expiration', {
              expired: new Date(endDate),
              formatParams: {
                expired: { weekday: 'long', month: 'long', day: 'numeric' },
              },
            })}
          </Text>
        </ServiceRow>
        <Link asChild href="https://www.coworking-metz.fr/boutique/pass-resident/">
          <Button backgroundColor={theme.darkVanilla} style={tw`h-14 self-stretch`}>
            <Text style={tw`text-base font-medium`}>{t('home.tickets.subscription.order')}</Text>
          </Button>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default SubscriptionBottomSheet;
