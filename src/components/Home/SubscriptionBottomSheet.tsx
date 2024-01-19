import CalendarAnimation from '../Animations/CalendarAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import ServiceRow from '../Settings/ServiceRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { type ApiMemberSubscription } from '@/services/api/members';

const SubscriptionBottomSheet = ({
  subscription,
  loading = false,
  style,
  onClose,
}: {
  subscription?: ApiMemberSubscription | null;
  loading?: boolean;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  const label = useMemo(() => {
    if (!subscription) return t('home.profile.subscription.label.none');
    const now = dayjs();
    if (now.startOf('day').isAfter(subscription.aboEnd))
      return t('home.profile.subscription.label.expired');
    if (now.isBefore(subscription.aboStart)) return t('home.profile.subscription.label.next');
    return t('home.profile.subscription.label.active');
  }, [subscription, t]);

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col w-full justify-between p-6`}>
        <CalendarAnimation style={tw`w-full`} />
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {label}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4 mb-2`}>
          {t('home.profile.subscription.description')}
        </Text>
        {subscription && (
          <>
            <ServiceRow
              withBottomDivider
              label={t('home.profile.subscription.status.startedOn')}
              style={tw`w-full px-0`}>
              {loading ? (
                <Skeleton
                  backgroundColor={
                    tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                  }
                  colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                  height={24}
                  width={128}
                />
              ) : (
                <Text
                  style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
                  {dayjs(subscription.aboStart).format('dddd ll')}
                </Text>
              )}
            </ServiceRow>
            <ServiceRow
              label={
                dayjs().startOf('day').isAfter(subscription.aboEnd)
                  ? t('home.profile.subscription.status.expiredSince')
                  : t('home.profile.subscription.status.ongoingUntil')
              }
              style={tw`w-full px-0`}>
              {loading ? (
                <Skeleton
                  backgroundColor={
                    tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                  }
                  colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                  height={24}
                  width={128}
                />
              ) : (
                <Text
                  style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
                  {dayjs(subscription.aboEnd).format('dddd ll')}
                </Text>
              )}
            </ServiceRow>
          </>
        )}
        <Link asChild href="https://www.coworking-metz.fr/boutique/pass-resident/" style={tw`mt-2`}>
          <AppRoundedButton style={tw`h-14 self-stretch`}>
            <Text style={tw`text-base font-medium text-black`}>
              {subscription
                ? t('home.profile.subscription.renew')
                : t('home.profile.subscription.get')}
            </Text>
            <MaterialCommunityIcons
              color={tw.color('black')}
              iconStyle={tw`h-6 w-6`}
              name="open-in-new"
              size={24}
              style={tw`ml-1`}
            />
          </AppRoundedButton>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default SubscriptionBottomSheet;
