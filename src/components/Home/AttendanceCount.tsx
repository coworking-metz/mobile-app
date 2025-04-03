import LoadingSkeleton from '../LoadingSkeleton';
import ReanimatedText from '../ReanimatedText';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View, type ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeInRight,
  FadeOutRight,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import ErrorChip from '@/components/ErrorChip';
import { isSilentError } from '@/helpers/error';
import { type ApiMemberProfile } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const MAX_MEMBERS_PICTURES = 5;

const AttendanceCount = ({
  members = [],
  total = 0,
  loading = false,
  style,
  error,
  children,
}: {
  members?: ApiMemberProfile[];
  total?: number;
  loading?: boolean;
  style?: ViewProps;
  error?: Error | null;
  children?: ReactNode;
}) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const count = useSharedValue<number>(0);

  const memberPictures = useMemo(() => {
    return members
      .filter(({ _id }) => _id !== user?.id)
      .map(({ picture }) => picture)
      .filter(Boolean);
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

  return (
    <View style={[tw`flex flex-col justify-end h-32 w-full`, style]}>
      <View style={tw`flex flex-row w-full items-end`}>
        {loading ? (
          <View style={tw`mb-4`}>
            <LoadingSkeleton height={92} radius={16} width={92} />
          </View>
        ) : (
          <View style={tw`flex flex-col h-24`}>
            <ReanimatedText
              style={[
                tw`text-8xl leading-[6.5rem] font-bold text-slate-900 dark:text-gray-200 min-w-[3rem]`,
                // Platform.OS === 'android' &&
                // tw`text-8xl leading-[6.5rem] tracking-tighter -mb-6 -mt-3`,
              ]}
              text={membersCount}
            />
          </View>
        )}
        <AppText
          style={[
            tw`text-5xl leading-[3.5rem] font-normal text-slate-500 dark:text-slate-400 h-12 mb-5`,
          ]}>
          {t('home.people.capacity', { total: total })}
        </AppText>
      </View>

      <View style={tw`flex flex-row items-center min-h-8 gap-2`}>
        {loading ? (
          <LoadingSkeleton height={24} width={144} />
        ) : (
          <AppText
            numberOfLines={1}
            style={[
              tw`text-xl font-normal text-slate-500 dark:text-slate-400`,
              error ? tw`shrink-0` : tw`shrink grow basis-0`,
            ]}>
            {t('home.people.present', { count: members.length })}
          </AppText>
        )}

        {error && !isSilentError(error) ? (
          <ErrorChip
            error={error}
            label={t('home.people.onFetch.fail')}
            style={tw`ml-2 shrink grow basis-0`}
          />
        ) : memberPictures.length ? (
          <Animated.View style={tw`shrink-0 ml-auto`}>
            <Link asChild href="/attendance">
              <TouchableOpacity>
                <View style={tw`flex flex-row items-center pl-4 grow h-8 overflow-hidden`}>
                  {memberPictures
                    .slice(
                      0,
                      members.length > MAX_MEMBERS_PICTURES
                        ? MAX_MEMBERS_PICTURES - 1
                        : MAX_MEMBERS_PICTURES,
                    )
                    .map((picture, index) => (
                      <Animated.View
                        entering={FadeInRight.duration(750).delay(100 * index)}
                        exiting={FadeOutRight.duration(500).delay(100 * index)}
                        key={`member-${picture}`}
                        style={tw`flex items-center justify-center shrink-0 bg-gray-100 dark:bg-black p-1 rounded-full h-10 w-10 overflow-hidden -ml-4`}>
                        <View
                          style={tw`h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-900`}>
                          <Image
                            cachePolicy="memory-disk"
                            contentFit="cover"
                            contentPosition={'top center'}
                            source={picture}
                            style={tw`size-full`}
                            transition={1000}
                          />
                        </View>
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
              </TouchableOpacity>
            </Link>
          </Animated.View>
        ) : null}

        {children}
      </View>
    </View>
  );
};

export default AttendanceCount;
