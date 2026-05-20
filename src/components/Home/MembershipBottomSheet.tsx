import ErrorChip from '../ErrorChip';
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

import { isSilentError } from '@/helpers/error';
import { getMemberProfile } from '@/services/api/members';
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
    isFetching: isFetchingProfile,
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

  useEffect(() => {
    if (isProfileQueryEnabled && profile?.membershipOk === false && hasNavigatedToShop.current) {
      hasNavigatedToShop.current = false;
      refetchProfile();
    }
  }, [activeSince]);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <MembershipFormAnimation
          active={profile?.activeUser && profile?.membershipOk}
          style={tw`h-56 w-full`}
          valid={profile?.membershipOk}
        />
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
        {isFetchingProfile ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <AppText
            style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
            {profile?.membershipOk
              ? t('home.profile.membership.status.valid', { year: profile.lastMembership })
              : profile?.lastMembership
                ? t('home.profile.membership.status.invalid', { year: profile.lastMembership })
                : t('home.profile.membership.status.none')}
          </AppText>
        )}
      </ServiceRow>

      <ServiceRow
        withBottomDivider
        description={t('home.profile.membership.activity.description')}
        label={t('home.profile.membership.activity.label')}
        style={tw`w-full px-0`}>
        {isFetchingProfile ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          // TODO: use <Trans /> component
          <View style={tw`flex flex-row justify-end items-end gap-1`}>
            {profile?.activity != 0 && (
              <AppText
                numberOfLines={1}
                style={tw`text-base font-semibold text-slate-900 dark:text-gray-200`}>
                {profile?.activity}
              </AppText>
            )}
            <AppText
              numberOfLines={1}
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500`}>
              {t('home.profile.membership.activity.days', {
                count: profile?.activity ?? 0,
              })}
            </AppText>
          </View>
        )}
      </ServiceRow>

      <ServiceRow label={t('home.profile.membership.grade.label')} style={tw`w-full px-0`}>
        {isFetchingProfile ? (
          <LoadingSkeleton height={24} width={128} />
        ) : (
          <AppText
            style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
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
          style={tw`self-start mt-1 mb-4`}
          onRetry={refetchProfile}
        />
      ) : null}

      {profile?.membershipOk ? (
        <View style={tw`flex flex-row items-start gap-3 w-full overflow-hidden`}>
          <MaterialCommunityIcons
            color={
              profile?.activeUser
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
            {profile?.activeUser
              ? t('home.profile.membership.grade.active.description')
              : t('home.profile.membership.grade.standard.description')}
          </AppText>
        </View>
      ) : profile?.membershipOk === false ? (
        <>
          <View style={tw`flex flex-row items-start gap-3 w-full overflow-hidden`}>
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
