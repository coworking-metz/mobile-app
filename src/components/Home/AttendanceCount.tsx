import AppShimmerText from '../AppShimmerText';
import { Link } from 'expo-router';
import { sample } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View, type ViewProps } from 'react-native';
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
import AppText from '@/components/AppText';
import ErrorBadge from '@/components/ErrorBadge';
import ProfilePicture from '@/components/Home/ProfilePicture';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ReanimatedText from '@/components/ReanimatedText';
import { AnyError } from '@/helpers/error';
import { type ApiMemberProfile } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const MAX_MEMBERS_PICTURES = 5;

const AttendanceCount = ({
  lastFetch,
  members = [],
  total = 0,
  loading,
  fetching,
  error,
  onRetry,
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
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const count = useSharedValue<number>(0);

  const otherMembers = useMemo(() => {
    return (
      members
        // have at least a name to render initials
        .filter((member) => member.firstName || member.lastName)
        .filter(({ _id }) => !user?.id || _id !== user?.id)
    );
  }, [members, user]);

  useEffect(() => {
    const newCount = members.length;
    const duration = 64 * Math.abs(count.value - newCount);
    count.value = withTiming(newCount, {
      duration: Math.min(Math.max(duration, 1_000), 4_000),
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [members]);

  const membersCount = useDerivedValue(() => {
    return `${count.value.toFixed(0)}`;
  }, [count]);

  const attendanceText = useMemo(() => {
    const text = t('home.people.present', { count: members.length, returnObjects: true });
    return Array.isArray(text) ? sample(text) : text;
  }, [t, members.length, lastFetch]);

  return (
    <View style={[tw`flex flex-col justify-end h-32 w-full`, style]}>
      <View style={tw`flex flex-row w-full items-end mb-5`}>
        <LoadingSkeleton radius={16} show={loading}>
          <ReanimatedText
            style={[
              tw`text-8xl leading-[6rem] font-bold text-slate-900 dark:text-gray-200 min-w-[3rem] ios:-mb-4.5 android:pr-3 android:h-28 android:-mb-2`,
            ]}
            text={membersCount}
          />
        </LoadingSkeleton>
        <AppText
          style={tw`text-5xl leading-[3.5rem] font-normal text-slate-500 dark:text-slate-400 h-12 android:min-w-28`}>
          {t('home.people.capacity', { total: total })}
        </AppText>
        {error ? (
          <ErrorBadge
            error={error}
            style={tw`ml-3`}
            title={t('home.people.onFetch.fail')}
            onRetry={onRetry}
          />
        ) : null}
      </View>

      <Link asChild href="/attendance">
        <TouchableOpacity>
          <View style={tw`flex flex-row items-center min-h-8 gap-1`}>
            {loading ? (
              <Animated.View exiting={FadeOut.duration(150)}>
                <LoadingSkeleton height={24} width={172} />
              </Animated.View>
            ) : (
              <AppShimmerText
                active={fetching}
                activeColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100')}
                numberOfLines={1}
                style={tw`shrink grow text-xl font-normal text-slate-500 dark:text-slate-400`}>
                {attendanceText}
              </AppShimmerText>
            )}

            {otherMembers.length ? (
              <Animated.View style={tw`shrink-0 ml-auto`}>
                <View style={tw`flex flex-row items-center pl-4 grow h-8 overflow-hidden`}>
                  {otherMembers
                    .slice(
                      0,
                      members.length > MAX_MEMBERS_PICTURES
                        ? MAX_MEMBERS_PICTURES - 1
                        : MAX_MEMBERS_PICTURES,
                    )
                    .map((member, index) => (
                      <Animated.View
                        entering={FadeInRight.duration(750).delay(100 * index)}
                        exiting={FadeOutRight.duration(500).delay(100 * index)}
                        key={`member-${member.picture}-${index}`}
                        style={tw`flex items-center justify-center shrink-0 bg-gray-100 dark:bg-black p-0.5 rounded-full h-10 w-10 overflow-hidden -ml-4`}>
                        <ProfilePicture
                          initialsStyle={tw`text-sm font-semibold`}
                          name={[member.firstName, member.lastName].filter(Boolean).join(' ')}
                          style={tw`h-full w-full`}
                          url={member.picture}
                        />
                      </Animated.View>
                    ))}
                  {members.length > MAX_MEMBERS_PICTURES ? (
                    <Animated.View
                      entering={FadeInRight.duration(750).delay(500)}
                      exiting={FadeOutRight.duration(500).delay(500)}
                      style={tw`flex items-center justify-center shrink-0 bg-gray-100 dark:bg-black p-1 rounded-full h-10 w-10 overflow-hidden -ml-4`}>
                      <View
                        style={tw`h-8 w-8 flex justify-center items-center rounded-full overflow-hidden bg-gray-200 dark:bg-gray-900`}>
                        <AppText style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
                          +{members.length - (MAX_MEMBERS_PICTURES - 1)}
                        </AppText>
                      </View>
                    </Animated.View>
                  ) : null}
                </View>
              </Animated.View>
            ) : null}
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default AttendanceCount;
