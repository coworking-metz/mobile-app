import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useIsFocused } from 'expo-router';
import { capitalize, compact, isNil, sample } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeOut, LinearTransition } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import EmptyOfficeAnimation from '@/components/Animations/EmptyOfficeAnimation';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import AppShimmerText from '@/components/AppShimmerText';
import AppText from '@/components/AppText';
import MemberBottomSheet from '@/components/Attendance/MemberBottomSheet';
import MemberTile from '@/components/Attendance/MemberTile';
import ErrorBadge from '@/components/ErrorBadge';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { isSilentError } from '@/helpers/error';
import { ApiLocation, ApiMemberProfile, getCurrentMembers } from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';

const LOCATION_SORT_ORDER: (ApiLocation | null)[] = [
  null,
  'cantina',
  'racine',
  'pti-poulailler',
  'poulailler',
];

const Attendance = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const memberBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [selectedMember, setSelectedMember] = useState<ApiMemberProfile | null>(null);
  const activeSince = useAppState();
  const isFocus = useIsFocused();

  const {
    isPending: isPendingCurrentMembers,
    isFetching: isFetchingCurrentMembers,
    data: currentMembers,
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

  const loadingText = useMemo(() => {
    const i18nLoading = t('home.refresh.loading', { returnObjects: true });
    return Array.isArray(i18nLoading) ? sample(i18nLoading) : i18nLoading;
  }, [t, durationSinceLastFetch]);

  const emptyTitle = useMemo(() => {
    const i18nEmptyTitle = t('attendance.empty.title', { returnObjects: true });
    return Array.isArray(i18nEmptyTitle) ? sample(i18nEmptyTitle) : i18nEmptyTitle;
  }, [t, currentMembersUpdatedAt]);

  const emptyDescription = useMemo(() => {
    const text = t('attendance.empty.description', { returnObjects: true });
    return Array.isArray(text) ? sample(text) : text;
  }, [t, currentMembersUpdatedAt]);

  const currentMembersPerLocation = useMemo(() => {
    return currentMembers
      ?.reduce(
        (acc, member) => {
          const location = member.location;
          const group = acc.find(
            (g) => g.location === location || (isNil(g.location) && isNil(location)),
          );
          if (group) {
            group.members.push(member);
          } else {
            acc.push({ location: location ?? null, members: [member] });
          }
          return acc;
        },
        [] as { location: ApiLocation | null; members: ApiMemberProfile[] }[],
      )
      .sort((a, b) => {
        const aIndex = LOCATION_SORT_ORDER.findIndex((loc) => loc === a.location);
        const bIndex = LOCATION_SORT_ORDER.findIndex((loc) => loc === b.location);
        return aIndex - bIndex;
      });
  }, [currentMembers]);

  const onSelect = useCallback(
    (member: ApiMemberProfile | null) => {
      setSelectedMember(member);
      if (member) {
        memberBottomSheetRef.current?.open();
      }
    },
    [memberBottomSheetRef.current],
  );

  return (
    <ServiceLayout
      contentStyle={tw`pb-12`}
      description={t('attendance.description')}
      footer={
        <MemberBottomSheet
          ref={memberBottomSheetRef}
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          {...(currentMembersUpdatedAt && {
            since: dayjs(currentMembersUpdatedAt).toISOString(),
          })}
        />
      }
      loading={isFetchingCurrentMembers}
      title={t('attendance.title', { count: currentMembers?.length ?? 0 })}
      onRefresh={refetchCurrentMembers}>
      <View style={tw`mt-4 flex min-h-6 flex-row items-center gap-2 px-6`}>
        <AppShimmerText
          active={isFetchingCurrentMembers}
          numberOfLines={1}
          style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}>
          {isFetchingCurrentMembers
            ? loadingText
            : !isNil(durationSinceLastFetch)
              ? capitalize(
                  durationSinceLastFetch > 3_600
                    ? dayjs(currentMembersUpdatedAt).calendar()
                    : dayjs(currentMembersUpdatedAt).fromNow(),
                )
              : currentMembersError && !isSilentError(currentMembersError)
                ? t('attendance.onFetch.fail')
                : null}
        </AppShimmerText>
        {currentMembersError && !isSilentError(currentMembersError) ? (
          <ErrorBadge
            error={currentMembersError}
            title={t('attendance.onFetch.fail')}
            onRetry={refetchCurrentMembers}
          />
        ) : null}
      </View>

      {isPendingCurrentMembers ? (
        <View style={tw`my-4 flex w-full flex-col items-start`}>
          <View
            style={tw`mx-6 mb-6 h-6 w-32 overflow-hidden rounded-full bg-white dark:bg-zinc-800`}>
            <LoadingSkeleton height={`100%`} width={`100%`} />
          </View>
          <View style={tw`flex flex-row flex-wrap items-start justify-evenly gap-8 px-6`}>
            {[0, 1, 2, 3, 4].map((index) => (
              <Animated.View
                entering={FadeIn.duration(300).delay(
                  Math.min(index, 10) * 50 + Math.random() * 200,
                )}
                exiting={FadeOut.duration(300)}
                key={`member-skeleton-${index}`}
                layout={LinearTransition}
                style={tw`relative flex size-24 flex-col items-center`}>
                <View style={tw`size-full overflow-hidden rounded-full bg-white dark:bg-zinc-800`}>
                  <LoadingSkeleton height={`100%`} width={`100%`} />
                </View>
                <View
                  style={tw`absolute -bottom-0 h-7 w-20 rounded-full bg-white px-3 py-1 shadow-2xl shadow-black dark:bg-zinc-800 `}></View>
              </Animated.View>
            ))}
            <View style={tw`w-24`} />
            <View style={tw`w-24`} />
          </View>
        </View>
      ) : currentMembersPerLocation?.length ? (
        currentMembersPerLocation?.map(({ location, members }) => (
          <View
            key={`location-group-${location ?? 'unknown'}`}
            style={tw`my-4 flex w-full flex-col items-start`}>
            <SectionTitle
              count={members.length > 1 ? members.length : undefined}
              loading={isFetchingCurrentMembers}
              style={tw`mb-6 w-full px-6`}
              title={
                location ? t(`onPremise.location.${location}`) : t('onPremise.location.unknown')
              }
            />
            <View style={tw`flex flex-row flex-wrap items-start justify-evenly gap-8 px-6`}>
              {members?.map((member, index) => (
                <Animated.View
                  entering={FadeIn.duration(300).delay(
                    Math.min(index, 10) * 50 + Math.random() * 200,
                  )}
                  exiting={FadeOut.duration(300)}
                  key={`member-tile-${compact([member._id, member.firstName, member.lastName]).join('-')}`}
                  layout={LinearTransition}
                  style={tw`w-24`}>
                  <MemberTile
                    member={member}
                    onPress={() => {
                      onSelect(member);
                    }}
                  />
                </Animated.View>
              ))}
              <View style={tw`w-24`} />
              <View style={tw`w-24`} />
            </View>
          </View>
        ))
      ) : (
        <View
          style={tw`mx-auto flex w-full max-w-sm grow basis-0 flex-col justify-start gap-2 px-4`}>
          <View style={tw`overflow-hidden`}>
            <EmptyOfficeAnimation style={tw`-my-12 mx-auto size-80`} />
          </View>
          <AppText
            entering={FadeInLeft.duration(500)}
            numberOfLines={1}
            style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {emptyTitle}
          </AppText>
          <AppText
            entering={FadeInLeft.duration(500).delay(150)}
            numberOfLines={2}
            style={tw`text-center text-base text-slate-500 dark:text-neutral-500`}>
            {emptyDescription}
          </AppText>
        </View>
      )}
    </ServiceLayout>
  );
};

export default Attendance;
