import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { isNil } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import CouponsAnimation from '@/components/Animations/CouponsAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import ErrorChip from '@/components/ErrorChip';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { isSilentError } from '@/helpers/error';
import {
  ApiMemberProfile,
  getMemberProfile,
  getMemberTickets,
  isMemberBalanceInsufficient,
} from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const BalanceBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const hasNavigatedToShop = useRef(false);
  const activeSince = useAppState();

  const {
    isFetching: isFetchingProfile,
    data: memberProfile,
    refetch: refetchProfile,
    isEnabled: isProfileQueryEnabled,
  } = useQuery<ApiMemberProfile>({
    queryKey: authStore.user?.id ? membersQueryKeys.profileById(authStore.user?.id) : [],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId as string);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const {
    data: ticketsOrders,
    isFetching: isFetchingTicketsOrders,
    error: ticketsOrdersError,
    refetch: refetchTicketsOrders,
    isEnabled: isTicketsOrdersQueryEnabled,
  } = useQuery({
    queryKey: authStore.user?.id ? membersQueryKeys.ticketsById(authStore.user?.id) : [],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberTickets(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  useEffect(() => {
    if (hasNavigatedToShop.current) {
      hasNavigatedToShop.current = false;
      if (isProfileQueryEnabled) refetchProfile();
      if (isTicketsOrdersQueryEnabled) refetchTicketsOrders();
    }
  }, [activeSince]);

  const consumedCount = useMemo(() => {
    const ordersCount = ticketsOrders?.reduce((acc, order) => acc + order.count, 0) ?? null;
    return !isNil(ordersCount) ? Math.abs(ordersCount - (memberProfile?.balance ?? 0)) : null;
  }, [ticketsOrders, memberProfile?.balance]);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      <View style={tw`flex h-40 items-center justify-center overflow-visible`}>
        <CouponsAnimation style={tw`h-56 w-full`} />
      </View>
      <AppText
        accessibilityLabel={t('home.profile.tickets.title')}
        accessible={true}
        style={tw`mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('home.profile.tickets.title')}
      </AppText>
      <AppText
        style={tw`mt-4 w-full text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('home.profile.tickets.description')}
      </AppText>

      <ServiceRow
        withBottomDivider
        label={t('home.profile.tickets.balance.label')}
        style={tw`mt-2 w-full px-0`}>
        {isFetchingProfile ? (
          <LoadingSkeleton height={24} width={96} />
        ) : (
          <Trans
            components={[
              <AppText
                key="emphasis"
                numberOfLines={1}
                style={tw`font-semibold text-slate-900 dark:text-gray-200`}
              />,
            ]}
            defaults={
              isNil(memberProfile?.balance)
                ? t('home.profile.tickets.unknown')
                : memberProfile.balance >= 0
                  ? t('home.profile.tickets.available', { count: memberProfile.balance })
                  : t('home.profile.tickets.depleted', { count: -memberProfile.balance })
            }
            numberOfLines={1}
            parent={AppText}
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}
          />
        )}
      </ServiceRow>
      <ServiceRow
        description={t('home.profile.tickets.consumed.description')}
        label={t('home.profile.tickets.consumed.label')}
        style={tw`mb-2 w-full px-0`}>
        {isFetchingTicketsOrders ? (
          <LoadingSkeleton height={24} width={96} />
        ) : (
          <Trans
            components={[
              <AppText
                key="emphasis"
                numberOfLines={1}
                style={tw`font-semibold text-slate-900 dark:text-gray-200`}
              />,
            ]}
            defaults={
              !isNil(consumedCount)
                ? t('home.profile.tickets.consumed.count', { count: consumedCount })
                : t('home.profile.tickets.consumed.unknown')
            }
            numberOfLines={1}
            parent={AppText}
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}
          />
        )}
      </ServiceRow>
      {ticketsOrdersError && !isSilentError(ticketsOrdersError) ? (
        <ErrorChip
          error={ticketsOrdersError}
          label={t('home.profile.tickets.onFetch.fail')}
          style={tw`mb-4 mt-1 self-start`}
          onRetry={refetchTicketsOrders}
        />
      ) : null}
      {memberProfile && isMemberBalanceInsufficient(memberProfile) && (
        <View style={tw`mb-3 flex w-full flex-row items-start gap-3 overflow-hidden`}>
          <MaterialCommunityIcons
            color={tw.color('yellow-500')}
            iconStyle={tw`mr-0 size-6`}
            name="alert"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText
            style={tw`shrink grow basis-0 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {t('home.profile.tickets.balance.onDepleted', {
              count: Math.abs(memberProfile.balance),
            })}
          </AppText>
        </View>
      )}

      {authStore.user && (
        <Link
          asChild
          href={`${WORDPRESS_BASE_URL}/boutique/carnet-10-journees/`}
          style={tw`mt-2`}
          onPress={() => {
            hasNavigatedToShop.current = true;
          }}>
          <AppRoundedButton
            label={t('home.profile.tickets.add')}
            style={tw`w-full max-w-sm self-center`}
            suffixIcon="open-in-new"
          />
        </Link>
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(BalanceBottomSheet);
