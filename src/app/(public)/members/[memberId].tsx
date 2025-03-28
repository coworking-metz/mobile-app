import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { FadeInLeft } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import AppText from '@/components/AppText';
import ErrorChip from '@/components/ErrorChip';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import ServiceRow from '@/components/Settings/ServiceRow';
import ZoomableImage from '@/components/ZoomableImage';
import { isSilentError } from '@/helpers/error';
import { getCurrentMembers } from '@/services/api/members';

const Advanced = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { memberId } = useLocalSearchParams();

  const {
    data: currentMembers,
    isLoading: isLoadingCurrentMembers,
    error: currentMembersError,
  } = useQuery({
    queryKey: ['currentMembers'],
    queryFn: getCurrentMembers,
    enabled: false,
  });

  const member = useMemo(() => {
    return (currentMembers ?? []).find((m) => m._id === memberId);
  }, [currentMembers, memberId]);

  const fullname = useMemo(() => {
    return [member?.firstName, member?.lastName].filter(Boolean).join(' ');
  }, [member]);

  return (
    <ServiceLayout contentStyle={tw`pt-6 pb-12`} title={fullname}>
      {member ? (
        <>
          <View style={tw`flex flex-col relative h-40 w-40 mx-auto`}>
            <ZoomableImage
              contentFit="cover"
              source={member.picture}
              style={tw`h-full w-full rounded-2xl bg-gray-200 dark:bg-gray-900`}
            />
          </View>

          <View style={tw`flex flex-row gap-2 min-h-6 mt-6 px-6`}>
            <AppText style={tw`text-sm font-normal uppercase text-slate-500`}>
              {t('members.profile.title')}
            </AppText>
            {currentMembersError && !isSilentError(currentMembersError) ? (
              <ErrorChip error={currentMembersError} label={t('members.detail.onFetch.fail')} />
            ) : null}
          </View>

          <ServiceRow
            withBottomDivider
            label={t('members.profile.since.label')}
            loading={isLoadingCurrentMembers}
            style={tw`px-3 mx-3`}>
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
              {dayjs(member.created).format('YYYY')}
            </AppText>
          </ServiceRow>
          <ServiceRow
            label={t('members.profile.location.label')}
            loading={isLoadingCurrentMembers}
            style={tw`px-3 mx-3`}>
            <Link href={`/on-premise${member.location ? `?location=${member.location}` : ''}`}>
              <AppText style={tw`text-base font-normal text-amber-500 grow text-right`}>
                {t(`onPremise.location.${member.location || 'unknown'}`)}
              </AppText>
            </Link>
          </ServiceRow>
        </>
      ) : (
        <>
          <View style={tw`flex flex-col items-center justify-end px-4 grow basis-0`}>
            <TumbleweedRollingAnimation style={tw`h-56 w-full max-w-xs`} />
          </View>
          <View
            style={tw`flex flex-col px-4 gap-2 grow basis-0 justify-start mx-auto w-full max-w-sm`}>
            <AppText
              entering={FadeInLeft.duration(500)}
              numberOfLines={1}
              style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
              {t('members.profile.empty.title')}
            </AppText>
            <AppText
              entering={FadeInLeft.duration(500).delay(150)}
              numberOfLines={2}
              style={tw`text-base text-center text-slate-500 dark:text-slate-400`}>
              {t('members.profile.empty.description')}
            </AppText>
          </View>
        </>
      )}
    </ServiceLayout>
  );
};

export default Advanced;
