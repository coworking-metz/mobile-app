import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type ViewProps } from 'react-native';
import AnimatedNumber from 'react-native-animated-number';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import tw from 'twrnc';
import { buildMemberPictureUrl, type ApiMemberProfile } from '@/services/api/members';

const MAX_MEMBERS_PICTURES = 4;

const PresentMembers = ({
  members = [],
  total = 0,
  loading = false,
  style,
}: {
  members?: ApiMemberProfile[];
  total?: number;
  loading?: boolean;
  style?: ViewProps;
}) => {
  const { t } = useTranslation();

  const memberPictures = useMemo(() => {
    return members
      .filter(({ picture }) => picture)
      .map((member) => buildMemberPictureUrl(member.wpUserId));
  }, [members]);

  // if (!loading) {
  //   return (
  //     <View style={[tw`flex flex-col gap-2 justify-end h-32 overflow-hidden`, style]}>
  //       <View style={tw`flex flex-row items-end gap-3`}>
  //         <Skeleton
  //           backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
  //           colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
  //           height={96}
  //           radius={16}
  //           width={96}
  //         />
  //         <Skeleton
  //           backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
  //           colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
  //           height={40}
  //           width={128}
  //         />
  //       </View>
  //     </View>
  //   );
  // }

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
              style={tw`text-8xl leading-[6.5rem] font-bold text-slate-900 dark:text-gray-200 min-w-[3rem]`}
              time={64} // milliseconds between each step
              value={members.length}
            />
          </View>
        )}
        <Text style={tw`text-5xl font-normal text-slate-500 dark:text-slate-400 h-12 mb-3`}>
          {t('home.people.capacity', { total: total })}
        </Text>
      </View>

      <View style={tw`flex flex-row justify-between items-center`}>
        {loading ? (
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={24}
            width={144}
          />
        ) : (
          <Text style={tw`text-xl font-normal text-slate-500 dark:text-slate-400`}>
            {t('home.people.present', { count: members.length })}
          </Text>
        )}

        {memberPictures.length ? (
          <Animated.View
            entering={FadeInRight.duration(750).delay(150)}
            exiting={FadeOutRight.duration(500)}
            style={tw`grow basis-0 shrink`}>
            <Link asChild href={process.env.EXPO_PUBLIC_PHOTO_BOARD_URL || ''}>
              <TouchableOpacity>
                <View style={tw`flex flex-row-reverse items-center grow h-8 overflow-hidden`}>
                  {members.length > MAX_MEMBERS_PICTURES ? (
                    <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400 ml-1`}>
                      +{members.length - MAX_MEMBERS_PICTURES}
                    </Text>
                  ) : null}
                  {memberPictures.slice(0, MAX_MEMBERS_PICTURES).map((picture) => (
                    <View
                      key={`member-${picture}`}
                      style={tw`flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-black p-1 rounded-full h-10 w-10 overflow-hidden ml-[-1rem]`}>
                      <Image
                        contentFit="cover"
                        contentPosition={'top center'}
                        source={picture}
                        style={tw`h-8 w-8 rounded-full bg-gray-200`}
                        transition={1000}
                      />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
};

export default PresentMembers;
