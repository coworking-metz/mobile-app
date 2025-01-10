import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import AppRoundedButton from '@/components/AppRoundedButton';
import ErrorChip from '@/components/ErrorChip';
import ProfilePicture from '@/components/Home/ProfilePicture';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
import { isSilentError } from '@/helpers/error';
import { getMemberProfile } from '@/services/api/members';
import { WORDPRESS_BASE_URL } from '@/services/environment';
import useAuthStore from '@/stores/auth';

const Advanced = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const authStore = useAuthStore();

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
    <ServiceLayout contentStyle={tw`pt-6 pb-12`} title={t('account.title')}>
      <Link href={`${WORDPRESS_BASE_URL}/mon-compte/polaroid/`} style={tw`flex flex-col mx-auto`}>
        <ProfilePicture
          loading={!authStore.user && authStore.isFetchingToken}
          style={tw`h-40 w-40 mx-auto`}
          url={authStore.user?.picture}>
          <View
            style={tw`z-10 h-12 w-12 bg-gray-50 dark:bg-zinc-900 rounded-full absolute flex items-center justify-center -bottom-3 -right-3`}>
            <View
              style={tw`bg-gray-400/50 dark:bg-gray-600/50 rounded-full  flex items-center justify-center h-9 w-9`}>
              <MaterialCommunityIcons
                color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
                iconStyle={{ height: 12, width: 12, marginRight: 0 }}
                name="pencil"
                size={20}
                style={tw``}
              />
            </View>
          </View>
        </ProfilePicture>
      </Link>

      <View style={tw`flex flex-row gap-2 min-h-6 mt-6 px-6`}>
        <Text style={tw`text-sm font-normal uppercase text-slate-500`}>
          {t('account.profile.label')}
        </Text>
        {profileError && !isSilentError(profileError) ? (
          <ErrorChip error={profileError} label={t('account.profile.onFetch.fail')} />
        ) : null}
      </View>

      <ServiceRow
        withBottomDivider
        label={t('account.profile.firstname.label')}
        loading={isFetchingProfile}
        style={tw`px-3 mx-3`}>
        <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
          {profile?.firstName}
        </Text>
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        label={t('account.profile.lastname.label')}
        loading={isFetchingProfile}
        style={tw`px-3 mx-3`}>
        <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
          {profile?.lastName}
        </Text>
      </ServiceRow>
      <ServiceRow
        withBottomDivider
        label={t('account.profile.birthdate.label')}
        loading={isFetchingProfile}
        style={tw`px-3 mx-3`}>
        <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
          {profile?.birthDate && dayjs(profile.birthDate).format('LL')}
        </Text>
      </ServiceRow>
      <ServiceRow
        label={t('account.profile.email.label')}
        loading={isFetchingProfile}
        style={tw`px-3 mx-3`}>
        <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
          {profile?.email}
        </Text>
      </ServiceRow>

      <View style={tw`mx-6 mt-auto pt-6`}>
        <Link asChild href={`${WORDPRESS_BASE_URL}/mon-compte/modifier-compte/`}>
          <AppRoundedButton style={tw`min-h-14 self-stretch`} suffixIcon="open-in-new">
            <Text style={tw`text-base font-medium text-black`}>{t('actions.edit')}</Text>
          </AppRoundedButton>
        </Link>
      </View>
    </ServiceLayout>
  );
};

export default Advanced;
