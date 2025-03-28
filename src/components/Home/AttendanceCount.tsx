import AppText from '../AppText';
import ErrorChip from '../ErrorChip';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, type ViewProps } from 'react-native';
import AnimatedNumber from 'react-native-animated-number';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import tw from 'twrnc';
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

  const memberPictures = useMemo(() => {
    return members
      .filter(({ _id }) => _id !== user?.id)
      .map(({ picture }) => picture)
      .filter(Boolean);
  }, [members, user]);

  return (
    <View style={[tw`flex flex-col justify-end h-32 w-full`, style]}>
      <View style={tw`flex flex-row w-full items-end`}>
        {loading ? (
          <View style={tw`mb-4`}>
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={92}
              radius={16}
              width={92}
            />
          </View>
        ) : (
          <View style={tw`flex flex-col h-24`}>
            <AnimatedNumber
              style={[
                tw`text-8xl leading-[6.5rem] font-bold text-slate-900 dark:text-gray-200 min-w-[3rem]`,
                Platform.OS === 'android' && tw`text-8xl tracking-tighter -mb-6 -mt-3`,
              ]}
              time={64} // milliseconds between each step
              value={members.length}
            />
          </View>
        )}
        <AppText
          style={[
            tw`text-5xl font-normal text-slate-500 dark:text-slate-400 h-12 mb-3`,
            Platform.OS === 'android' && tw`text-5xl tracking-tight`,
          ]}>
          {t('home.people.capacity', { total: members.length })}
        </AppText>
      </View>

      <View style={tw`flex flex-row items-center min-h-8 gap-2`}>
        {loading ? (
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={24}
            width={144}
          />
        ) : (
          <AppText
            numberOfLines={1}
            style={tw`text-xl font-normal text-slate-500 dark:text-slate-400 grow basis-0 shrink`}>
            {t('home.people.present', { count: members.length })}
          </AppText>
        )}

        {error && !isSilentError(error) ? (
          <ErrorChip error={error} label={t('home.people.onFetch.fail')} style={tw`ml-2 `} />
        ) : memberPictures.length ? (
          <Animated.View
            entering={FadeInRight.duration(750).delay(150)}
            exiting={FadeOutRight.duration(500)}
            style={tw`shrink-0 ml-auto`}>
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
                    .map((picture) => (
                      <View
                        key={`member-${picture}`}
                        style={tw`flex items-center justify-center shrink-0 bg-gray-100 dark:bg-black p-1 rounded-full h-10 w-10 overflow-hidden -ml-4`}>
                        <View
                          style={tw`h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-900`}>
                          <Image
                            contentFit="cover"
                            contentPosition={'top center'}
                            source={picture}
                            style={tw`size-full`}
                            transition={1000}
                          />
                        </View>
                      </View>
                    ))}
                  {members.length > MAX_MEMBERS_PICTURES ? (
                    <View
                      style={tw`flex items-center justify-center shrink-0 bg-gray-100 dark:bg-black p-1 rounded-full h-10 w-10 overflow-hidden -ml-4`}>
                      <View
                        style={tw`h-8 w-8 flex justify-center items-center rounded-full overflow-hidden bg-gray-200 dark:bg-gray-900`}>
                        <AppText style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
                          +{members.length - (MAX_MEMBERS_PICTURES - 1)}
                        </AppText>
                      </View>
                    </View>
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
