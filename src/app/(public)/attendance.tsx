import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { capitalize, isNil, sample } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import EmptyOfficeAnimation from '@/components/Animations/EmptyOfficeAnimation';
import AppText from '@/components/AppText';
import MemberBottomSheet from '@/components/Attendance/MemberBottomSheet';
import MemberCard from '@/components/Attendance/MemberCard';
import ErrorBadge from '@/components/ErrorBadge';
import ErrorState from '@/components/ErrorState';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { isSilentError } from '@/helpers/error';
import useAppScreen from '@/helpers/screen';
import { ApiLocation, ApiMemberProfile, getCurrentMembers } from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';

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
  const { isWide } = useAppScreen();
  const [selectedMember, setSelectedMember] = useState<ApiMemberProfile | null>(null);
  const activeSince = useAppState();
  const isFocus = useIsFocused();

  const {
    data: currentMembers,
    isPending: isPendingCurrentMembers,
    isFetching: isFetchingCurrentMembers,
    refetch: refetchCurrentMembers,
    error: currentMembersError,
    dataUpdatedAt: currentMembersUpdatedAt,
  } = useQuery({
    queryKey: membersQueryKeys.attending(),
    queryFn: getCurrentMembers,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // count duration since last fetch to redraw stale data text
  // every time the screen gets focused or the app gets back to foreground
  const durationSinceLastFetch = useMemo(() => {
    return currentMembersUpdatedAt ? dayjs().diff(currentMembersUpdatedAt, 'second') : null;
  }, [currentMembersUpdatedAt, isFocus, activeSince]);

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

  const emptyTitle = useMemo(() => {
    const i18nEmptyTitle = t('attendance.empty.title', { returnObjects: true });
    return Array.isArray(i18nEmptyTitle) ? sample(i18nEmptyTitle) : i18nEmptyTitle;
  }, [t, currentMembersUpdatedAt]);

  const emptyDescription = useMemo(() => {
    const text = t('attendance.empty.description', { returnObjects: true });
    return Array.isArray(text) ? sample(text) : text;
  }, [t, currentMembersUpdatedAt]);

  return (
    <ServiceLayout
      contentStyle={tw`pt-6 pb-12 gap-6`}
      description={t('attendance.description')}
      footer={
        selectedMember && (
          <MemberBottomSheet
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
            {...(currentMembersUpdatedAt && {
              since: dayjs(currentMembersUpdatedAt).toISOString(),
            })}
          />
        )
      }
      loading={isFetchingCurrentMembers}
      title={t('attendance.title', { count: currentMembers?.length ?? 0 })}
      onRefresh={refetchCurrentMembers}>
      {!isNil(durationSinceLastFetch) ? (
        <View style={tw`flex flex-row items-center gap-2 min-h-6 px-6`}>
          <AppText
            entering={FadeInLeft.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            numberOfLines={1}
            style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}>
            {capitalize(
              durationSinceLastFetch > 3_600
                ? dayjs(currentMembersUpdatedAt).calendar()
                : dayjs(currentMembersUpdatedAt).fromNow(),
            )}
          </AppText>
          {currentMembersError && !isSilentError(currentMembersError) ? (
            <ErrorBadge
              error={currentMembersError}
              title={t('attendance.onFetch.fail')}
              onRetry={refetchCurrentMembers}
            />
          ) : null}
        </View>
      ) : null}

      <View style={tw`flex flex-col gap-12`}>
        {groupedMembersByLocation.length ? (
          groupedMembersByLocation.map((group) => (
            <View key={group.location} style={tw`flex flex-col gap-2 px-4`}>
              <SectionTitle
                count={group.members.length}
                entering={FadeInLeft.duration(500)}
                exiting={FadeOutLeft.duration(500)}
                loading={isFetchingCurrentMembers}
                style={tw`px-2 self-stretch`}
                title={t(`onPremise.location.${group.location || 'unknown'}`)}
              />

              <View style={tw`flex flex-row flex-wrap gap-2 w-full`}>
                {group.members.map((member, index) => (
                  <Animated.View
                    exiting={FadeOutLeft.duration(300)}
                    key={`member-card-${member._id ?? index}`}
                    style={tw`flex`}>
                    <MemberCard
                      loading={isFetchingCurrentMembers}
                      member={member}
                      style={[tw`grow-0`, isWide ? tw`w-80` : tw`w-full`]}
                      onPress={() => setSelectedMember(member)}
                      {...(currentMembersUpdatedAt && {
                        since: dayjs(currentMembersUpdatedAt).toISOString(),
                      })}>
                      {!isWide && (
                        <MaterialCommunityIcons
                          color={
                            tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')
                          }
                          iconStyle={{ height: 20, width: 20, marginRight: 0 }}
                          name="chevron-right"
                          size={24}
                          style={tw`self-center shrink-0 ml-auto`}
                        />
                      )}
                    </MemberCard>
                  </Animated.View>
                ))}
              </View>
            </View>
          ))
        ) : isPendingCurrentMembers ? (
          <View style={tw`flex flex-col gap-2 px-4`}>
            <View style={tw`pl-2`}>
              <LoadingSkeleton height={24} width={128} />
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
        ) : currentMembersError && !isSilentError(currentMembersError) ? (
          <ErrorState error={currentMembersError} title={t('attendance.onFetch.fail')} />
        ) : (
          <View
            style={tw`flex flex-col px-4 gap-2 grow basis-0 justify-start mx-auto w-full max-w-sm`}>
            <View style={tw`overflow-hidden`}>
              <EmptyOfficeAnimation style={tw`h-80 -my-12 w-80 mx-auto`} />
            </View>
            <AppText
              entering={FadeInLeft.duration(500)}
              numberOfLines={1}
              style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
              {emptyTitle}
            </AppText>
            <AppText
              entering={FadeInLeft.duration(500).delay(150)}
              numberOfLines={2}
              style={tw`text-base text-center text-slate-500 dark:text-neutral-500`}>
              {emptyDescription}
            </AppText>
          </View>
        )}
      </View>
    </ServiceLayout>
  );
};

export default Attendance;
