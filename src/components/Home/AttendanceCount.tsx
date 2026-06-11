import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { sample } from 'lodash';
import { NumberFlow } from 'number-flow-react-native';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, type ViewProps } from 'react-native';
import Animated, {
  Easing,
  FadeInRight,
  FadeOut,
  FadeOutRight,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import AppPressable from '@/components/AppPressable';
import AppShimmerText from '@/components/AppShimmerText';
import AppText from '@/components/AppText';
import ErrorBadge from '@/components/ErrorBadge';
import ProfilePicture from '@/components/Home/ProfilePicture';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ReanimatedText from '@/components/ReanimatedText';
import { AnyError, isSilentError } from '@/helpers/error';
import { getCurrentMembers, type ApiMemberProfile } from '@/services/api/members';
import { membersQueryKeys } from '@/services/query';
import useAuthStore from '@/stores/auth';

const MAX_MEMBERS_PICTURES = 5;
const TOTAL_CAPACITY = 40;

const AttendanceCount = ({
  style,
}: {
  lastFetch?: number;
  members?: ApiMemberProfile[];
  total?: number;
  loading?: boolean;
  fetching?: boolean;
  error?: AnyError | null;
  onRetry?: () => void;
  style?: ViewProps;
}) => {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const count = useSharedValue<number>(0);

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
  });

  const otherMembers = useMemo(() => {
    return (
      (currentMembers ?? [])
        // have at least a name to render initials
        .filter((member) => member.firstName || member.lastName)
        .filter(({ _id }) => !user?.id || _id !== user?.id)
    );
  }, [currentMembers, user]);

  useEffect(() => {
    const newCount = currentMembers?.length ?? 0;
    const duration = 64 * Math.abs(count.value - newCount);
    count.value = withTiming(newCount, {
      duration: Math.min(Math.max(duration, 1_000), 4_000),
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [currentMembers]);

  const remainingMembersCount = useDerivedValue(() => {
    return `+${(count.value - (MAX_MEMBERS_PICTURES - 1)).toFixed(0)}`;
  }, [count]);

  const attendanceText = useMemo(() => {
    const text = t('home.people.present', {
      count: currentMembers?.length ?? 0,
      returnObjects: true,
    });
    return Array.isArray(text) ? sample(text) : text;
  }, [t, currentMembers?.length, currentMembersUpdatedAt]);

  return (
    <View style={[tw`flex h-32 w-full flex-col justify-end`, style]}>
      <View style={tw`flex w-full flex-row items-end`}>
        <View style={tw`relative`}>
          <NumberFlow
            format={{ style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }}
            locales={[i18n.language]}
            style={tw`android:leading-[7.5rem] text-8xl font-bold leading-[7rem] text-slate-900 dark:text-gray-200`}
            value={currentMembers?.length ?? 0}
          />

          <View style={tw`absolute inset-x-0 inset-y-4 z-10`}>
            <LoadingSkeleton radius={16} show={isPendingCurrentMembers}>
              <View style={tw`size-full`} />
            </LoadingSkeleton>
          </View>
        </View>
        <AppText
          style={tw`android:mb-6 android:min-w-28 mb-4 text-5xl font-normal leading-[3.5rem] text-slate-500 dark:text-neutral-500`}>
          {t('home.people.capacity', { total: TOTAL_CAPACITY })}
        </AppText>
        {currentMembersError && !isSilentError(currentMembersError) && !isFetchingCurrentMembers ? (
          <ErrorBadge
            error={currentMembersError}
            style={tw`ios:mb-6 android:mb-8 ml-3`}
            title={t('home.people.onFetch.fail')}
            onRetry={refetchCurrentMembers}
          />
        ) : null}
      </View>

      <Link asChild href="/attendance">
        <AppPressable>
          <View style={tw`flex min-h-8 flex-row items-center gap-1`}>
            {isPendingCurrentMembers ? (
              <Animated.View exiting={FadeOut.duration(150)}>
                <LoadingSkeleton height={24} width={172} />
              </Animated.View>
            ) : (
              <View style={tw`shrink grow overflow-hidden`}>
                <AppShimmerText
                  active={isFetchingCurrentMembers}
                  activeColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100')}
                  numberOfLines={1}
                  style={tw`text-xl font-normal text-slate-500 dark:text-neutral-500`}>
                  {attendanceText}
                </AppShimmerText>
              </View>
            )}

            {otherMembers.length ? (
              <Animated.View style={tw`ml-auto shrink-0`}>
                <View style={tw`flex h-8 grow flex-row items-center pl-4`}>
                  {otherMembers
                    .slice(
                      0,
                      (currentMembers?.length ?? 0) > MAX_MEMBERS_PICTURES
                        ? MAX_MEMBERS_PICTURES - 1
                        : MAX_MEMBERS_PICTURES,
                    )
                    .map((member, index) => (
                      <Animated.View
                        entering={FadeInRight.duration(750).delay(100 * index)}
                        exiting={FadeOutRight.duration(500).delay(100 * index)}
                        key={`member-${member.picture}-${index}`}
                        style={tw`-ml-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 p-0.5 dark:bg-black`}>
                        <ProfilePicture
                          initialsStyle={tw`text-sm font-semibold`}
                          name={[member.firstName, member.lastName].filter(Boolean).join(' ')}
                          pictureStyle={tw`rounded-full`}
                          style={tw`size-full`}
                          url={member.picture}
                        />
                      </Animated.View>
                    ))}
                  {(currentMembers?.length ?? 0) > MAX_MEMBERS_PICTURES ? (
                    <Animated.View
                      entering={FadeInRight.duration(750).delay(500)}
                      exiting={FadeOutRight.duration(500).delay(500)}
                      style={tw`-ml-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 p-1 dark:bg-black`}>
                      <View
                        style={tw`flex size-8 items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-900`}>
                        <ReanimatedText
                          numberOfLines={1}
                          style={tw`text-sm font-normal text-slate-500 dark:text-neutral-500`}
                          text={remainingMembersCount}
                        />
                      </View>
                    </Animated.View>
                  ) : null}
                </View>
              </Animated.View>
            ) : null}
          </View>
        </AppPressable>
      </Link>
    </View>
  );
};

export default AttendanceCount;
