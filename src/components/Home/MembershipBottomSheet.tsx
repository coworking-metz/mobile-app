import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import MembershipFormAnimation from '@/components/Animations/MembershipFormAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { theme } from '@/helpers/colors';

import { getMemberProfile } from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const MembershipBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & {
    lastMembershipYear?: number;
    valid?: boolean;
    active?: boolean;
    loading?: boolean;
    activityOverLast6Months?: number;
  }
> = (
  { lastMembershipYear, valid, active, activityOverLast6Months, loading = false, style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const hasNavigatedToShop = useRef(false);
  const activeSince = useAppState();

  const { refetch: refetchProfile } = useQuery({
    queryKey: authStore.user?.id ? membersQueryKeys.profileById(authStore.user?.id) : [],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId as string);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: false,
  });

  useEffect(() => {
    if (!!authStore.user?.id && !valid && hasNavigatedToShop.current) {
      hasNavigatedToShop.current = false;
      refetchProfile();
    }
  }, [activeSince, valid]);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <MembershipFormAnimation active={active && valid} style={tw`h-56 w-full`} valid={valid} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
        {t('home.profile.membership.title')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 w-full mt-4`}>
        {t('home.profile.membership.description')}
      </AppText>

      <ServiceRow
        withBottomDivider
        label={t('home.profile.membership.status.label')}
        style={tw`w-full px-0`}>
        {loading ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <AppText
            style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
            {valid
              ? t('home.profile.membership.status.valid', { year: lastMembershipYear })
              : lastMembershipYear
                ? t('home.profile.membership.status.invalid', { year: lastMembershipYear })
                : t('home.profile.membership.status.none')}
          </AppText>
        )}
      </ServiceRow>

      <ServiceRow
        withBottomDivider
        description={t('home.profile.membership.activity.description')}
        label={t('home.profile.membership.activity.label')}
        style={tw`w-full px-0`}>
        {loading ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <View style={tw`flex flex-row justify-end items-end gap-1`}>
            {activityOverLast6Months != 0 && (
              <AppText
                numberOfLines={1}
                style={tw`text-base font-semibold text-slate-900 dark:text-gray-200`}>
                {activityOverLast6Months}
              </AppText>
            )}
            <AppText
              numberOfLines={1}
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500`}>
              {t('home.profile.membership.activity.days', {
                count: activityOverLast6Months ?? 0,
              })}
            </AppText>
          </View>
        )}
      </ServiceRow>

      <ServiceRow label={t('home.profile.membership.grade.label')} style={tw`w-full px-0`}>
        {loading ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <AppText
            style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
            {active && valid
              ? t('home.profile.membership.grade.active.label')
              : valid
                ? t('home.profile.membership.grade.standard.label')
                : t('home.profile.membership.grade.none.label')}
          </AppText>
        )}
      </ServiceRow>

      <View style={tw`flex flex-row items-start gap-3 w-full overflow-hidden`}>
        {valid ? (
          <>
            <MaterialCommunityIcons
              color={
                active
                  ? theme.meatBrown
                  : tw.prefixMatch('dark')
                    ? tw.color('gray-400')
                    : tw.color('gray-700')
              }
              iconStyle={tw`h-6 w-6 mr-0`}
              name="star-circle-outline"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 shrink grow basis-0`}>
              {active
                ? t('home.profile.membership.grade.active.description')
                : t('home.profile.membership.grade.standard.description')}
            </AppText>
          </>
        ) : (
          <>
            <MaterialCommunityIcons
              color={tw.color('yellow-500')}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="alert"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 shrink grow basis-0`}>
              {t('home.profile.membership.required')}
            </AppText>
          </>
        )}
      </View>

      {authStore.user && !valid && (
        <Link
          asChild
          href={`${WORDPRESS_BASE_URL}/boutique/carte-adherent/`}
          style={tw`mt-5`}
          onPress={() => {
            hasNavigatedToShop.current = true;
          }}>
          <AppRoundedButton
            label={
              lastMembershipYear
                ? t('home.profile.membership.renew', { year: dayjs().year() })
                : t('home.profile.membership.get', { year: dayjs().year() })
            }
            style={tw`w-full max-w-sm self-center`}
            suffixIcon="open-in-new"
          />
        </Link>
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(MembershipBottomSheet);
