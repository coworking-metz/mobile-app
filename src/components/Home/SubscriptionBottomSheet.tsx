import CalendarAnimation from '../Animations/CalendarAnimation';
import AppBottomSheet from '../AppBottomSheet';
import ServiceRow from '../Settings/ServiceRow';
import { Button } from '@ddx0510/react-native-ui-lib';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { capitalize } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const SubscriptionBottomSheet = ({
  startDate,
  endDate,
  style,
  onClose,
}: {
  startDate: string;
  endDate: string;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col items-center justify-between p-6`}>
        <CalendarAnimation style={tw`w-full`} />
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('home.profile.subscription.label')}
        </Text>
        <Text style={tw`text-left text-base text-slate-500 dark:text-slate-400 w-full mt-4`}>
          {t('home.profile.subscription.description')}
        </Text>
        <ServiceRow
          withBottomDivider
          label={capitalize(t('home.profile.subscription.status.startedOn', { prefix: '' }))}
          style={tw`w-full px-0`}>
          <Text style={tw`text-base text-slate-500 grow text-right`}>
            {t('home.profile.subscription.date', {
              expired: new Date(startDate),
              formatParams: {
                expired: { weekday: 'long', month: 'long', day: 'numeric' },
              },
            })}
          </Text>
        </ServiceRow>
        <ServiceRow
          label={capitalize(
            dayjs().isBefore(endDate)
              ? t('home.profile.subscription.status.ongoingUntil', { prefix: '' })
              : t('home.profile.subscription.status.expiredSince', { prefix: '' }),
          )}
          style={tw`w-full px-0`}>
          <Text style={tw`text-base text-slate-500 grow text-right`}>
            {t('home.profile.subscription.date', {
              expired: new Date(endDate),
              formatParams: {
                expired: { weekday: 'long', month: 'long', day: 'numeric' },
              },
            })}
          </Text>
        </ServiceRow>
        <Link asChild href="https://www.coworking-metz.fr/boutique/pass-resident/">
          <Button backgroundColor={theme.darkVanilla} style={tw`h-14 self-stretch`}>
            <Text style={tw`text-base font-medium`}>{t('home.profile.subscription.order')}</Text>
          </Button>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default SubscriptionBottomSheet;
