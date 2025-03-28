import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { capitalize } from 'lodash';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import EmptyOfficeAnimation from '@/components/Animations/EmptyOfficeAnimation';
import AppText from '@/components/AppText';
import MemberCard from '@/components/Attendance/MemberCard';
import ErrorChip from '@/components/ErrorChip';
import ErrorState from '@/components/ErrorState';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import { isSilentError } from '@/helpers/error';
import { ApiLocation, ApiMemberProfile, getCurrentMembers } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

type AttendingLocation = ApiLocation | '';

const LOCATIONS_ORDER: AttendingLocation[] = [
  '',
  'racine',
  'cantina',
  'pti-poulailler',
  'poulailler',
];

type MembersGroupByLocation = {
  location: AttendingLocation;
  members: ApiMemberProfile[];
};

const Attendance = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const authStore = useAuthStore();

  const {
    data: currentMembers,
    isPending: isPendingCurrentMembers,
    isFetching: isFetchingCurrentMembers,
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

  const groupedMembersByLocation = useMemo<MembersGroupByLocation[]>(() => {
    const groups: MembersGroupByLocation[] = (currentMembers ?? []).reduce((acc, member) => {
      const memberLocation = member.location ?? '';
      const locationFound = acc.find(({ location }) => location === memberLocation);
      if (locationFound) {
        return [
          ...acc.filter(({ location }) => location !== memberLocation),
          {
            ...locationFound,
            members: [...locationFound.members, member],
          },
        ];
      }

      return [
        ...acc,
        {
          location: memberLocation,
          members: [member],
        },
      ];
    }, [] as MembersGroupByLocation[]);

    groups.sort((a, b) =>
      LOCATIONS_ORDER.indexOf(a.location ?? '') > LOCATIONS_ORDER.indexOf(b.location ?? '')
        ? 1
        : -1,
    );

    return groups;
  }, [currentMembers]);

  return (
    <ServiceLayout
      contentStyle={tw`pt-6 pb-12 gap-6`}
      description={t('attendance.description')}
      title={t('attendance.title', { count: currentMembers?.length })}
      onRefresh={refetchCurrentMembers}>
      <View style={tw`flex flex-row gap-2 min-h-6 pl-6`}>
        {currentMembersUpdatedAt ? (
          <AppText
            entering={FadeInLeft.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            numberOfLines={1}
            style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
            {capitalize(
              dayjs().diff(currentMembersUpdatedAt, 'minutes') > 60
                ? dayjs(currentMembersUpdatedAt).calendar()
                : dayjs(currentMembersUpdatedAt).fromNow(),
            )}
          </AppText>
        ) : null}
        {currentMembersError && !isSilentError(currentMembersError) ? (
          <ErrorChip error={currentMembersError} label={t('attendance.onFetch.fail')} />
        ) : null}
      </View>

      <View style={tw`flex flex-col gap-12`}>
        {isPendingCurrentMembers ? (
          <View style={tw`flex flex-col gap-2 px-4`}>
            <View style={tw`pl-2`}>
              <Skeleton
                backgroundColor={
                  tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')
                }
                colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
                height={24}
                width={128}
              />
            </View>
            {[0, 1, 2, 3].map((index) => (
              <Animated.View
                entering={FadeInLeft.duration(500).delay(150 * index)}
                exiting={FadeOutLeft.duration(300)}
                key={index}
                style={tw`flex flex-col`}>
                <MemberCard pending />
              </Animated.View>
            ))}
          </View>
        ) : groupedMembersByLocation.length ? (
          groupedMembersByLocation.map((group) => (
            <View key={group.location} style={tw`flex flex-col gap-2 px-4`}>
              <AppText style={tw`text-sm font-normal uppercase text-slate-500 px-2`}>
                {t(`onPremise.location.${group.location || 'unknown'}`)}
              </AppText>
              {group.members.map((member) => (
                <Animated.View
                  exiting={FadeOutLeft.duration(300)}
                  key={member._id}
                  style={tw`flex`}>
                  <Link asChild href={`/members/${member._id}`}>
                    <MemberCard
                      loading={isFetchingCurrentMembers}
                      member={member}
                      style={tw`grow-0`}>
                      <MaterialCommunityIcons
                        color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
                        iconStyle={{ height: 20, width: 20, marginRight: 0 }}
                        name="chevron-right"
                        size={24}
                        style={tw`self-center shrink-0 ml-auto`}
                      />
                    </MemberCard>
                  </Link>
                </Animated.View>
              ))}
            </View>
          ))
        ) : (
          <View
            style={tw`flex flex-col px-4 gap-2 grow basis-0 justify-start mx-auto w-full max-w-sm`}>
            <EmptyOfficeAnimation style={tw`h-80 -my-12 w-80 mx-auto`} />
            <AppText
              entering={FadeInLeft.duration(500)}
              numberOfLines={1}
              style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
              {t('attendance.empty.title')}
            </AppText>
            <AppText
              entering={FadeInLeft.duration(500).delay(150)}
              numberOfLines={2}
              style={tw`text-base text-center text-slate-500 dark:text-slate-400`}>
              {t('attendance.empty.description')}
            </AppText>
          </View>
        )}
      </View>
    </ServiceLayout>
  );
};

export default Attendance;
