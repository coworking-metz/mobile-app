import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import MemberCard from '@/components/Attendance/MemberCard';
import ErrorState from '@/components/ErrorState';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import { isSilentError } from '@/helpers/error';
import { getCurrentMembers } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const Attendance = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const authStore = useAuthStore();

  const {
    data: currentMembers,
    isLoading: isLoadingCurrentMembers,
    refetch: refetchCurrentMembers,
    error: currentMembersError,
    dataUpdatedAt: currentMembersUpdatedAt,
  } = useQuery({
    queryKey: ['currentMembers'],
    queryFn: getCurrentMembers,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const sortedMembers = useMemo(() => {
    return [...(currentMembers || [])].sort((a, b) =>
      b.location === 'poulailler' ? -1 : (a.location || '').localeCompare(b.location || ''),
    );
  }, [currentMembers]);

  return (
    <ServiceLayout
      contentStyle={tw`pt-6 pb-12 gap-3`}
      description={t('attendance.description')}
      title={t('attendance.title', { count: currentMembers?.length })}
      onRefresh={refetchCurrentMembers}>
      {currentMembersUpdatedAt && (
        <Animated.Text
          entering={FadeInLeft.duration(300)}
          exiting={FadeOutLeft.duration(300)}
          numberOfLines={1}
          style={tw`ml-6 text-sm font-normal text-slate-500 dark:text-slate-400`}>
          {capitalize(
            dayjs().diff(currentMembersUpdatedAt, 'minutes') > 60
              ? dayjs(currentMembersUpdatedAt).calendar()
              : dayjs(currentMembersUpdatedAt).fromNow(),
          )}
        </Animated.Text>
      )}

      {isLoadingCurrentMembers ? (
        <>
          <MemberCard
            loading
            entering={FadeInLeft.duration(500)}
            exiting={FadeOutLeft.duration(300)}
            style={tw`h-44`}
          />
          <MemberCard
            loading
            entering={FadeInLeft.duration(500).delay(150)}
            exiting={FadeOutLeft.duration(300)}
            style={tw`h-44`}
          />
        </>
      ) : sortedMembers?.length ? (
        sortedMembers.map((member) => (
          <MemberCard
            exiting={FadeOutLeft.duration(300)}
            key={member._id}
            member={member}
            style={tw`grow-0`}>
            {member._id === authStore.user?.id && (
              <View style={tw`mt-3 ml-auto bg-gray-400/25 dark:bg-gray-700/50 py-1 px-2 rounded`}>
                <Text style={tw`text-xs text-slate-900 dark:text-gray-200 font-medium`}>
                  {t('attendance.members.myself').toLocaleUpperCase()}
                </Text>
              </View>
            )}
          </MemberCard>
        ))
      ) : currentMembersError && !isSilentError(currentMembersError) ? (
        <ErrorState error={currentMembersError} title={t('attendance.onFetch.fail')} />
      ) : (
        <View
          style={tw`flex flex-col px-4 gap-2 grow basis-0 justify-start mx-auto w-full max-w-sm`}>
          <TumbleweedRollingAnimation style={tw`h-56 w-full max-w-xs`} />
          <Animated.Text
            entering={FadeInLeft.duration(500)}
            numberOfLines={1}
            style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {t('attendance.empty.title')}
          </Animated.Text>
          <Animated.Text
            entering={FadeInLeft.duration(500).delay(150)}
            numberOfLines={2}
            style={tw`text-base text-center text-slate-500 dark:text-slate-400`}>
            {t('attendance.empty.description')}
          </Animated.Text>
        </View>
      )}
    </ServiceLayout>
  );
};

export default Attendance;
