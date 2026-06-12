import ErrorChip from '../ErrorChip';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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

import { isSilentError } from '@/helpers/error';
import { getMemberMemberships, getMemberProfile } from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const MembershipBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const hasNavigatedToShop = useRef(false);
  const activeSince = useAppState();

  const {
    isPending: isPendingProfile,
    data: profile,
    refetch: refetchProfile,
    error: profileError,
    isEnabled: isProfileQueryEnabled,
  } = useQuery({
    queryKey: authStore.user?.id ? membersQueryKeys.profileById(authStore.user?.id) : [],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId as string);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const { data: memberships } = useQuery({
    queryKey: authStore.user?.id ? membersQueryKeys.membershipsById(authStore.user?.id) : [],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberMemberships(userId as string);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    enabled: !!authStore.user?.id,
  });

  const firstMembership = useMemo(() => {
    const [first] = [...(memberships ?? [])].sort((a, b) =>
      dayjs(a.membershipStart).diff(dayjs(b.membershipStart)),
    );
    return first ?? null;
  }, [memberships, profile?.lastMembership]);

  useEffect(() => {
    if (isProfileQueryEnabled && profile?.membershipOk === false && hasNavigatedToShop.current) {
      hasNavigatedToShop.current = false;
      refetchProfile();
    }
  }, [activeSince]);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      <View style={tw`flex h-40 items-center justify-center overflow-visible`}>
        <MembershipFormAnimation
          active={profile?.activeUser && profile?.membershipOk}
          style={tw`h-56 w-full`}
          valid={profile?.membershipOk}
        />
      </View>
      <AppText
        style={tw`mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('home.profile.membership.title')}
      </AppText>
      <AppText
        style={tw`mt-4 w-full text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('home.profile.membership.description')}
      </AppText>

      <ServiceRow
        withBottomDivider
        label={t('home.profile.membership.status.label')}
        style={tw`w-full px-0`}
        {...(firstMembership &&
          dayjs(firstMembership.membershipStart).year() !== profile?.lastMembership && {
            description: t('home.profile.membership.since', {
              year: dayjs(firstMembership.membershipStart).year(),
            }),
          })}>
        {isPendingProfile ? (
          <LoadingSkeleton height={24} width={128} />
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
              profile?.membershipOk
                ? t('home.profile.membership.status.valid', { year: profile.lastMembership })
                : profile?.lastMembership
                  ? t('home.profile.membership.status.invalid', { year: profile.lastMembership })
                  : t('home.profile.membership.status.none')
            }
            numberOfLines={1}
            parent={AppText}
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}
          />
        )}
      </ServiceRow>

      <ServiceRow
        withBottomDivider
        description={t('home.profile.membership.activity.description')}
        label={t('home.profile.membership.activity.label')}
        style={tw`w-full px-0`}>
        {isPendingProfile ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <Trans
            components={[
              <AppText
                key="emphasis"
                numberOfLines={1}
                style={tw`font-semibold text-slate-900 dark:text-gray-200`}
              />,
            ]}
            defaults={t('home.profile.membership.activity.days', {
              count: profile?.activity ?? 0,
            })}
            numberOfLines={1}
            parent={AppText}
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}
          />
        )}
      </ServiceRow>

      <ServiceRow label={t('home.profile.membership.grade.label')} style={tw`w-full px-0`}>
        {isPendingProfile ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <AppText
            style={tw`text-right text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {profile?.activeUser && profile?.membershipOk
              ? t('home.profile.membership.grade.active.label')
              : profile?.membershipOk
                ? t('home.profile.membership.grade.standard.label')
                : t('home.profile.membership.grade.none.label')}
          </AppText>
        )}
      </ServiceRow>

      {profileError && !isSilentError(profileError) ? (
        <ErrorChip
          error={profileError}
          label={t('home.profile.onFetch.fail')}
          style={tw`mb-4 mt-1 self-start`}
          onRetry={refetchProfile}
        />
      ) : null}

      {profile?.membershipOk ? (
        <View style={tw`flex w-full flex-row items-start gap-3 overflow-hidden`}>
          <MaterialCommunityIcons
            color={
              profile?.activeUser
                ? theme.meatBrown
                : tw.prefixMatch('dark')
                  ? tw.color('gray-400')
                  : tw.color('gray-700')
            }
            iconStyle={tw`mr-0 size-6`}
            name="star-circle-outline"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText
            style={tw`shrink grow basis-0 text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {profile?.activeUser
              ? t('home.profile.membership.grade.active.description')
              : t('home.profile.membership.grade.standard.description')}
          </AppText>
        </View>
      ) : profile?.membershipOk === false ? (
        <>
          <View style={tw`flex w-full flex-row items-start gap-3 overflow-hidden`}>
            <MaterialCommunityIcons
              color={tw.color('yellow-500')}
              iconStyle={tw`mr-0 size-6`}
              name="alert"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <AppText
              style={tw`shrink grow basis-0 text-base font-normal text-slate-500 dark:text-neutral-500`}>
              {t('home.profile.membership.required')}
            </AppText>
          </View>

          <Link
            asChild
            href={`${WORDPRESS_BASE_URL}/boutique/carte-adherent/`}
            style={tw`mt-5`}
            onPress={() => {
              hasNavigatedToShop.current = true;
            }}>
            <AppRoundedButton
              label={
                profile?.lastMembership
                  ? t('home.profile.membership.renew', { year: dayjs().year() })
                  : t('home.profile.membership.get', { year: dayjs().year() })
              }
              style={tw`w-full max-w-sm self-center`}
              suffixIcon="open-in-new"
            />
          </Link>
        </>
      ) : null}
    </AppBottomSheet>
  );
};

export default forwardRef(MembershipBottomSheet);
