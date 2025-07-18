import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import AppText from '@/components/AppText';
import AppTouchable from '@/components/AppTouchable';
import ErrorBadge from '@/components/ErrorBagde';
import ErrorChip from '@/components/ErrorChip';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import ServiceRow from '@/components/Layout/ServiceRow';
import ZoomableImage from '@/components/ZoomableImage';
import { useAppAuth } from '@/context/auth';
import { isSilentError } from '@/helpers/error';
import { getMemberProfile } from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import useAuthStore from '@/stores/auth';

const Advanced = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { _root } = useLocalSearchParams();
  const authStore = useAuthStore();
  const { logout } = useAppAuth();

  const {
    data: profile,
    isFetching: isFetchingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['members', authStore.user?.id],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberProfile(userId);
      }
      throw new Error(t('account.profile.onFetch.missing'));
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  return (
    <ServiceLayout contentStyle={tw`pt-6 pb-12`} title={t('account.title')} withBackButton={!_root}>
      <View style={tw`w-full max-w-xl mx-auto`}>
        <View style={tw`flex flex-col relative h-40 w-40 mx-auto`}>
          <ZoomableImage
            contentFit="cover"
            source={authStore.user?.picture}
            style={tw`h-full w-full rounded-2xl bg-gray-200 dark:bg-gray-900`}
          />

          <View
            style={tw`absolute -bottom-3 -right-3 z-10 h-12 w-12 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center`}>
            <Link asChild href={`${WORDPRESS_BASE_URL}/mon-compte/polaroid/`}>
              <AppTouchable
                style={tw`bg-gray-400/50 dark:bg-gray-600/50 rounded-full flex items-center justify-center h-9 w-9`}>
                <MaterialCommunityIcons
                  color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
                  iconStyle={{ height: 12, width: 12, marginRight: 0 }}
                  name="pencil"
                  size={20}
                  style={tw``}
                />
              </AppTouchable>
            </Link>
          </View>
        </View>

        <SectionTitle style={tw`mx-6 mt-8`} title={t('account.profile.title')}>
          {profileError && !isSilentError(profileError) ? (
            <ErrorBadge error={profileError} title={t('account.profile.onFetch.fail')} />
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
          loading={isFetchingProfile}
          style={tw`px-3 mx-3`}>
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
            {profile?.firstName}
          </AppText>
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('account.profile.lastname.label')}
          loading={isFetchingProfile}
          style={tw`px-3 mx-3`}>
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
            {profile?.lastName}
          </AppText>
        </ServiceRow>
        <ServiceRow
          withBottomDivider
          label={t('account.profile.birthdate.label')}
          loading={isFetchingProfile}
          style={tw`px-3 mx-3`}>
          <AppText style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
            {profile?.birthDate && dayjs(profile.birthDate).format('LL')}
          </AppText>
        </ServiceRow>
        <ServiceRow
          label={t('account.profile.email.label')}
          loading={isFetchingProfile}
          style={tw`px-3 mx-3`}>
          <AppText
            ellipsizeMode={'middle'}
            numberOfLines={1}
            style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right max-w-4/5`}>
            {profile?.email}
          </AppText>
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

export default Advanced;
