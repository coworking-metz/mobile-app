import CouponsAnimation from '../Animations/CouponsAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import ErrorChip from '../ErrorChip';
import ServiceRow from '../Settings/ServiceRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { isSilentError } from '@/helpers/error';
import { getMemberTickets } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const BalanceBottomSheet = ({
  balance,
  loading = false,
  style,
  onClose,
}: {
  balance: number;
  loading?: boolean;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const {
    data: ticketsOrders,
    isFetching: isFetchingTicketsOrders,
    error: ticketsOrdersError,
  } = useQuery({
    queryKey: ['members', user?.id, 'tickets'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberTickets(userId);
      }
      throw new Error('Missing user id');
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!user?.id,
  });

  const consumedCount = useMemo(() => {
    return (ticketsOrders || []).reduce((acc, order) => acc + order.count, -balance) || 0;
  }, [ticketsOrders, balance]);

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full justify-between p-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <CouponsAnimation style={tw`h-56 w-full`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('home.profile.tickets.label')}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('home.profile.tickets.description')}
        </Text>
        <ServiceRow
          withBottomDivider
          label={t('home.profile.tickets.balance.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={24}
              width={96}
            />
          ) : (
            <View style={tw`flex flex-row justify-end items-end gap-1 grow`}>
              {balance != 0 && (
                <Text
                  numberOfLines={1}
                  style={tw`text-base font-semibold text-slate-900 dark:text-gray-200`}>
                  {Math.abs(balance)}
                </Text>
              )}
              <Text
                numberOfLines={1}
                style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
                {balance >= 0
                  ? t('home.profile.tickets.available', {
                      count: balance,
                    })
                  : t('home.profile.tickets.depleted', {
                      count: -balance,
                    })}
              </Text>
            </View>
          )}
        </ServiceRow>
        <ServiceRow
          description={t('home.profile.tickets.consumed.description')}
          label={t('home.profile.tickets.consumed.label')}
          style={tw`w-full px-0`}>
          {isFetchingTicketsOrders ? (
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={24}
              width={96}
            />
          ) : (
            <View style={tw`flex flex-row justify-end items-end gap-1 grow`}>
              {consumedCount != 0 && (
                <Text
                  numberOfLines={1}
                  style={tw`text-base font-semibold text-slate-900 dark:text-gray-200`}>
                  {consumedCount}
                </Text>
              )}
              <Text
                numberOfLines={1}
                style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
                {t('home.profile.tickets.consumed.count', { count: consumedCount })}
              </Text>
            </View>
          )}
        </ServiceRow>
        {ticketsOrdersError && !isSilentError(ticketsOrdersError) ? (
          <ErrorChip
            error={ticketsOrdersError}
            label={t('home.profile.tickets.onFetch.fail')}
            style={tw`self-start my-1`}
          />
        ) : null}
        {balance < 0 && (
          <View style={tw`flex flex-row items-start flex-gap-2 mb-4 mt-2 w-full overflow-hidden`}>
            <MaterialCommunityIcons
              color={tw.color('yellow-500')}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="alert"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <Text style={tw`text-left text-base font-normal text-slate-500 shrink grow basis-0`}>
              {t('home.profile.tickets.balance.onDepleted')}
            </Text>
          </View>
        )}
        <Link
          asChild
          href="https://www.coworking-metz.fr/boutique/carnet-10-journees/"
          style={tw`mt-2`}>
          <AppRoundedButton style={tw`h-14 self-stretch`} suffixIcon="open-in-new">
            <Text style={tw`text-base text-black font-medium`}>
              {t('home.profile.tickets.add')}
            </Text>
          </AppRoundedButton>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default BalanceBottomSheet;
