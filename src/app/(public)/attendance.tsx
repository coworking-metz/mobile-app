import { useIsFocused } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { capitalize, isNil, sample } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeOutLeft,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import EmptyOfficeAnimation from '@/components/Animations/EmptyOfficeAnimation';
import AppShimmerText from '@/components/AppShimmerText';
import AppText from '@/components/AppText';
import MemberBottomSheet from '@/components/Attendance/MemberBottomSheet';
import MemberTile from '@/components/Attendance/MemberTile';
import ErrorBadge from '@/components/ErrorBadge';
import ErrorState from '@/components/ErrorState';
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

const ParallaxColumn = ({
  speed,
  verticalScrollProgress,
  children,
}: {
  speed: number;
  verticalScrollProgress: SharedValue<number>;
  children: React.ReactNode;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: verticalScrollProgress.value * speed }],
    };
  }, [speed, verticalScrollProgress]);

  return (
    <Animated.View style={[tw`flex flex-col gap-2 grow basis-0`, animatedStyle]}>
      {children}
    </Animated.View>
  );
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

  const splitInTwoColumns = (members: ApiMemberProfile[]) => {
    return members.reduce(
      (acc, member, index) => {
        acc[index % 2].push(member);
        return acc;
      },
      [[], []] as [ApiMemberProfile[], ApiMemberProfile[]],
    );
  };

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
      renderContent={({ verticalScrollProgress }) => (
        <>
          {!isNil(durationSinceLastFetch) ? (
            <View style={tw`flex flex-row items-center gap-2 min-h-6 px-6`}>
              <AppShimmerText
                active={isFetchingCurrentMembers}
                entering={FadeInLeft.duration(300)}
                exiting={FadeOutLeft.duration(300)}
                numberOfLines={1}
                style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}>
                {capitalize(
                  durationSinceLastFetch > 3_600
                    ? dayjs(currentMembersUpdatedAt).calendar()
                    : dayjs(currentMembersUpdatedAt).fromNow(),
                )}
              </AppShimmerText>
              {currentMembersError &&
              !isSilentError(currentMembersError) &&
              !isFetchingCurrentMembers ? (
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
              groupedMembersByLocation.map((group) => {
                const [leftColumn, rightColumn] = splitInTwoColumns(group.members);

                return (
                  <View key={group.location} style={tw`flex flex-col gap-2 px-4`}>
                    <View style={tw`flex flex-row gap-2 w-full items-start`}>
                      <ParallaxColumn speed={-0.06} verticalScrollProgress={verticalScrollProgress}>
                        {leftColumn.map((member, index) => (
                          <Animated.View
                            exiting={FadeOutLeft.duration(300)}
                            key={`member-tile-left-${member._id ?? index}`}>
                            <MemberTile
                              member={member}
                              style={isWide ? tw`w-80 self-end` : undefined}
                              onPress={() => setSelectedMember(member)}
                            />
                          </Animated.View>
                        ))}
                      </ParallaxColumn>

                      <ParallaxColumn speed={0.03} verticalScrollProgress={verticalScrollProgress}>
                        {rightColumn.map((member, index) => (
                          <Animated.View
                            exiting={FadeOutLeft.duration(300)}
                            key={`member-tile-right-${member._id ?? index}`}>
                            <MemberTile
                              member={member}
                              style={isWide ? tw`w-80 self-start` : undefined}
                              onPress={() => setSelectedMember(member)}
                            />
                          </Animated.View>
                        ))}
                      </ParallaxColumn>
                    </View>
                  </View>
                );
              })
            ) : isPendingCurrentMembers ? (
              <View style={tw`flex flex-col gap-2 px-4`}>
                <View style={tw`pl-2`}>
                  <LoadingSkeleton height={24} width={128} />
                </View>
                <View style={tw`flex flex-row gap-2 w-full`}>
                  <View style={tw`flex flex-col gap-2 grow basis-0`}>
                    {[0, 1].map((index) => (
                      <Animated.View
                        entering={FadeInLeft.duration(500).delay(150 * index)}
                        exiting={FadeOutLeft.duration(300)}
                        key={`left-skeleton-${index}`}>
                        <View style={tw`rounded-2xl p-3 min-h-44 bg-white dark:bg-zinc-800`}>
                          <LoadingSkeleton height={96} width={`100%`} />
                          <View style={tw`mt-3`}>
                            <LoadingSkeleton height={20} width={`70%`} />
                          </View>
                          <View style={tw`mt-1`}>
                            <LoadingSkeleton height={20} width={`55%`} />
                          </View>
                        </View>
                      </Animated.View>
                    ))}
                  </View>
                  <View style={tw`flex flex-col gap-2 grow basis-0`}>
                    {[2, 3].map((index) => (
                      <Animated.View
                        entering={FadeInLeft.duration(500).delay(150 * index)}
                        exiting={FadeOutLeft.duration(300)}
                        key={`right-skeleton-${index}`}>
                        <View style={tw`rounded-2xl p-3 min-h-44 bg-white dark:bg-zinc-800`}>
                          <LoadingSkeleton height={96} width={`100%`} />
                          <View style={tw`mt-3`}>
                            <LoadingSkeleton height={20} width={`70%`} />
                          </View>
                          <View style={tw`mt-1`}>
                            <LoadingSkeleton height={20} width={`55%`} />
                          </View>
                        </View>
                      </Animated.View>
                    ))}
                  </View>
                </View>
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
        </>
      )}
      title={t('attendance.title', { count: currentMembers?.length ?? 0 })}
      onRefresh={refetchCurrentMembers}
    />
  );
};

export default Attendance;
