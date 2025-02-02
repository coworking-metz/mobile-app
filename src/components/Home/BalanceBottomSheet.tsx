import CouponsAnimation from '../Animations/CouponsAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import ErrorChip from '../ErrorChip';
import ServiceRow from '../Settings/ServiceRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { isSilentError } from '@/helpers/error';

import { getMemberTickets } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const BalanceBottomSheet = ({
  balance,
  loading = false,
  activeSince,
  style,
  onClose,
}: {
  balance: number;
  loading?: boolean;
  activeSince?: string;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const hasBeenActive = useRef(false);

  const { refetch: refetchProfile } = useQuery({
    queryKey: ['members', user?.id],
    enabled: false,
  });

  const {
    data: ticketsOrders,
    isFetching: isFetchingTicketsOrders,
    error: ticketsOrdersError,
    refetch: refetchTicketsOrders,
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

  useEffect(() => {
    if (!!user?.id && hasBeenActive.current) {
      refetchProfile();
      refetchTicketsOrders();
    }
  }, [user, activeSince, refetchProfile]);

  useEffect(() => {
    hasBeenActive.current = true;
  }, []);

  const consumedCount = useMemo(() => {
    const ordersCount = (ticketsOrders || []).reduce((acc, order) => acc + order.count, 0);
    return Math.abs(ordersCount - balance);
  }, [ticketsOrders, balance]);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`px-6 pt-6`}
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
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
        description={t('home.profile.tickets.consumed.description')}
        label={t('home.profile.tickets.consumed.label')}
        style={tw`w-full px-0 mt-2`}>
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
      <ServiceRow label={t('home.profile.tickets.balance.label')} style={tw`w-full px-0`}>
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
      {ticketsOrdersError && !isSilentError(ticketsOrdersError) ? (
        <ErrorChip
          error={ticketsOrdersError}
          label={t('home.profile.tickets.onFetch.fail')}
          style={tw`self-start my-1`}
        />
      ) : null}
      {balance < 0 && (
        <View style={tw`flex flex-row items-start flex-gap-2 mb-4 w-full overflow-hidden`}>
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
        <AppRoundedButton disabled={!user} style={tw`h-14 self-stretch`} suffixIcon="open-in-new">
          <Text style={tw`text-base text-black font-medium`}>{t('home.profile.tickets.add')}</Text>
        </AppRoundedButton>
      </Link>
    </AppBottomSheet>
  );
};

export default BalanceBottomSheet;
