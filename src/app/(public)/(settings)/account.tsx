import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import AppIcon from '@/components/AppIcon';
import AppPressable from '@/components/AppPressable';
import AppText from '@/components/AppText';
import ErrorBadge from '@/components/ErrorBadge';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ZoomableImage from '@/components/ZoomableImage';
import { useAppAuth } from '@/context/auth';
import { isSilentError } from '@/helpers/error';
import { getMemberProfile } from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const Account = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { _root } = useLocalSearchParams();
  const authStore = useAuthStore();
  const { logout } = useAppAuth();

  const {
    isPending: isPendingProfile,
    isFetching: isFetchingProfile,
    data: profile,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: membersQueryKeys.profileById(authStore.user?.id ?? ''),
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  return (
    <ServiceLayout
      contentStyle={tw`pt-6 pb-12`}
      loading={isFetchingProfile}
      title={t('account.title')}
      withBackButton={!_root}
      onRefresh={refetchProfile}>
      <View style={tw`w-full max-w-xl mx-auto`}>
        <View style={tw`flex flex-col relative h-40 w-40 mx-auto`}>
          <View style={tw`h-full w-full rounded-2xl bg-gray-200 dark:bg-zinc-950 overflow-hidden`}>
            <ZoomableImage
              contentFit="cover"
              source={authStore.user?.picture}
              style={tw`h-full w-full`}
            />
          </View>

          <View
            style={tw`absolute -bottom-3 -right-3 z-10 h-12 w-12 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center`}>
            <Link asChild href={`${WORDPRESS_BASE_URL}/mon-compte/polaroid/`}>
              <AppPressable
                style={tw`bg-gray-400/50 dark:bg-zinc-600/40 rounded-full flex items-center justify-center h-9 w-9`}>
                <AppIcon
                  color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('neutral-700')}
                  icon="pencil"
                  size={20}
                />
              </AppPressable>
            </Link>
          </View>
        </View>

        <SectionTitle
          loading={isFetchingProfile}
          style={tw`mx-6 mt-8`}
          title={t('account.profile.title')}>
          {profileError && !isSilentError(profileError) && !isFetchingProfile ? (
            <ErrorBadge
              error={profileError}
              title={t('account.profile.onFetch.fail')}
              onRetry={refetchProfile}
            />
          ) : null}
          <Link asChild href={`${WORDPRESS_BASE_URL}/mon-compte/modifier-compte/`}>
            <AppText
              style={tw`ml-auto text-base font-normal leading-5 text-right text-amber-500 min-w-5`}>
              {t('actions.edit')}
            </AppText>
          </Link>
        </SectionTitle>

        <ServiceRow
          withBottomDivider
          label={t('account.profile.firstname.label')}
          style={tw`px-3 mx-3`}>
          {isPendingProfile ? (
            <LoadingSkeleton show height={28} width={Math.random() * 48 + 96} />
          ) : (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
              {profile?.firstName}
            </AppText>
          )}
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('account.profile.lastname.label')}
          style={tw`px-3 mx-3`}>
          {isPendingProfile ? (
            <LoadingSkeleton show height={28} width={Math.random() * 48 + 96} />
          ) : (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
              {profile?.lastName}
            </AppText>
          )}
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('account.profile.birthdate.label')}
          style={tw`px-3 mx-3`}>
          {isPendingProfile ? (
            <LoadingSkeleton show height={28} width={96} />
          ) : (
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
              {profile?.birthDate ? dayjs(profile.birthDate).format('LL') : null}
            </AppText>
          )}
        </ServiceRow>
        <ServiceRow label={t('account.profile.email.label')} style={tw`px-3 mx-3`}>
          {isPendingProfile ? (
            <LoadingSkeleton show height={28} width={Math.random() * 64 + 144} />
          ) : (
            <AppText
              ellipsizeMode={'middle'}
              numberOfLines={1}
              style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right grow ml-auto max-w-4/5`}>
              {profile?.email ?? authStore.user?.email}
            </AppText>
          )}
        </ServiceRow>

        <ServiceRow
          label={t('actions.logout')}
          prefixIcon="logout"
          style={tw`px-3 mx-3 mt-6`}
          suffixIcon="chevron-right"
          onPress={logout}
        />
      </View>
    </ServiceLayout>
  );
};

export default Account;
