import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useIsFocused } from 'expo-router';
import { capitalize, compact, isNil, sample } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  FadeOutLeft,
  LinearTransition,
} from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import EmptyOfficeAnimation from '@/components/Animations/EmptyOfficeAnimation';
import { AppBottomSheetRef } from '@/components/AppBottomSheet';
import AppShimmerText from '@/components/AppShimmerText';
import AppText from '@/components/AppText';
import MemberBottomSheet from '@/components/Attendance/MemberBottomSheet';
import MemberTile from '@/components/Attendance/MemberTile';
import ErrorBadge from '@/components/ErrorBadge';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { isSilentError } from '@/helpers/error';
import { ApiMemberProfile, getCurrentMembers } from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';

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
      contentStyle={tw`pt-6 pb-12 gap-6`}
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
      <View style={tw`flex flex-row items-center gap-2 min-h-6 px-6`}>
        <AppShimmerText
          active={isFetchingCurrentMembers}
          numberOfLines={1}
          style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}>
          {!isNil(durationSinceLastFetch)
            ? capitalize(
                durationSinceLastFetch > 3_600
                  ? dayjs(currentMembersUpdatedAt).calendar()
                  : dayjs(currentMembersUpdatedAt).fromNow(),
              )
            : currentMembersError && !isSilentError(currentMembersError)
              ? t('attendance.onFetch.fail')
              : loadingText}
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
        <View style={tw`flex flex-row items-start justify-evenly flex-wrap gap-8 px-6`}>
          {[0, 1, 2, 3, 4].map((index) => (
            <Animated.View
              entering={FadeIn.duration(300).delay(Math.min(index, 10) * 50 + Math.random() * 200)}
              exiting={FadeOut.duration(300)}
              key={`member-skeleton-${index}`}
              layout={LinearTransition}
              style={tw`flex flex-col items-center w-24 h-24 relative`}>
              <View
                style={tw`w-full h-full rounded-full bg-white dark:bg-zinc-800 overflow-hidden`}>
                <LoadingSkeleton height={`100%`} width={`100%`} />
              </View>
              <View
                style={tw`shadow-black shadow-2xl absolute -bottom-0 h-7 w-20 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 `}></View>
            </Animated.View>
          ))}
          <View style={tw`w-24 h-24`} />
        </View>
      ) : currentMembers?.length ? (
        <View style={tw`flex flex-row items-start justify-evenly flex-wrap gap-8 px-6`}>
          {currentMembers?.map((member, index) => (
            <Animated.View
              entering={FadeIn.duration(300).delay(Math.min(index, 10) * 50 + Math.random() * 200)}
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
        </View>
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
    </ServiceLayout>
  );
};

export default Attendance;
