import CouponsAnimation from '../Animations/CouponsAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import AppText from '../AppText';
import ErrorChip from '../ErrorChip';
import ServiceRow from '../Settings/ServiceRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { isSilentError } from '@/helpers/error';
import {
  ApiMemberProfile,
  getMemberTickets,
  isMemberBalanceInsufficient,
} from '@/services/api/members';
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

  const { data: memberProfile, refetch: refetchProfile } = useQuery<ApiMemberProfile>({
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
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
        {t('home.profile.tickets.label')}
      </AppText>
      <AppText style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
        {t('home.profile.tickets.description')}
      </AppText>

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
              <AppText
                numberOfLines={1}
                style={tw`text-base font-semibold text-slate-900 dark:text-gray-200`}>
                {consumedCount}
              </AppText>
            )}
            <AppText
              numberOfLines={1}
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
              {t('home.profile.tickets.consumed.count', { count: consumedCount })}
            </AppText>
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
              <AppText
                numberOfLines={1}
                style={tw`text-base font-semibold text-slate-900 dark:text-gray-200`}>
                {Math.abs(balance)}
              </AppText>
            )}
            <AppText
              numberOfLines={1}
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400`}>
              {balance >= 0
                ? t('home.profile.tickets.available', {
                  count: balance,
                })
                : t('home.profile.tickets.depleted', {
                  count: -balance,
                })}
            </AppText>
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
      {memberProfile && isMemberBalanceInsufficient(memberProfile) && (
        <View style={tw`flex flex-row items-start flex-gap-2 mb-4 w-full overflow-hidden`}>
          <MaterialCommunityIcons
            color={tw.color('yellow-500')}
            iconStyle={tw`h-6 w-6 mr-0`}
            name="alert"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText style={tw`text-left text-base font-normal text-slate-500 shrink grow basis-0`}>
            {t('home.profile.tickets.balance.onDepleted', { count: Math.abs(balance) })}
          </AppText>
        </View>
      )}
      <Link
        asChild
        href="https://www.coworking-metz.fr/boutique/carnet-10-journees/"
        style={tw`mt-2`}>
        <AppRoundedButton disabled={!user} style={tw`h-14 self-stretch`} suffixIcon="open-in-new">
          <AppText style={tw`text-base text-black font-medium`}>
            {t('home.profile.tickets.add')}
          </AppText>
        </AppRoundedButton>
      </Link>
    </AppBottomSheet>
  );
};

export default BalanceBottomSheet;
