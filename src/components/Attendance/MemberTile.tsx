import AppPressable from '../AppPressable';
import ProfilePicture from '../Home/ProfilePicture';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { TouchableHighlightProps, View } from 'react-native';
import { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import {
  ApiMemberProfile,
  isMemberBalanceInsufficient,
  isMembershipNonCompliant,
  LAST_SEEN_DELAY_UNTIL_LEAVING_IN_MIN,
  LAST_SEEN_DELAY_UNTIL_NON_ATTENDING_IN_MIN,
} from '@/services/api/members';

type MemberTileProps = TouchableHighlightProps & {
  member: ApiMemberProfile;
  since?: string;
  loading?: boolean;
};

const MemberTile = ({ member, since, style, loading, onPress, ...props }: MemberTileProps) => {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ');

  const lastSeenSinceInMinutes = useMemo(
    () => (since && member.lastSeen ? dayjs(since).diff(member.lastSeen, 'minute') : 0),
    [since, member.lastSeen],
  );

  return (
    <AppPressable
      disabled={!onPress}
      underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
      onPress={onPress}
      {...props}>
      <View style={[tw`flex w-full flex-col pb-5`, style]}>
        <View style={tw`relative w-full pt-[100%]`}>
          <View style={tw`absolute inset-0 overflow-hidden rounded-full`}>
            <ProfilePicture
              initialsStyle={tw`text-3xl`}
              loading={loading}
              name={fullName}
              pictureStyle={[
                tw`rounded-full`,
                isMemberBalanceInsufficient(member) || isMembershipNonCompliant(member)
                  ? tw`border-4 border-red-600 dark:border-red-700`
                  : null,
                ,
              ]}
              style={[
                tw`size-full`,
                {
                  opacity: Math.max(
                    (LAST_SEEN_DELAY_UNTIL_NON_ATTENDING_IN_MIN - lastSeenSinceInMinutes) /
                      LAST_SEEN_DELAY_UNTIL_NON_ATTENDING_IN_MIN,
                    0.3,
                  ),
                },
              ]}
              url={member.picture}
            />
          </View>
          <View style={[tw`absolute inset-x-[-40%] top-[4.5rem] flex flex-col items-center`]}>
            <AppText
              numberOfLines={1}
              style={tw`rounded-full bg-white px-3 py-1 text-center text-base font-semibold text-gray-900 shadow-2xl shadow-black dark:bg-zinc-800 dark:text-gray-200`}
              textBreakStrategy="highQuality">
              {member.firstName}
            </AppText>
            {lastSeenSinceInMinutes >= LAST_SEEN_DELAY_UNTIL_LEAVING_IN_MIN && (
              <AppText
                entering={FadeInDown.duration(1000)}
                exiting={FadeOutUp.duration(1000)}
                numberOfLines={1}
                style={tw`mt-1 text-sm font-normal text-slate-500 dark:text-neutral-500`}>
                {dayjs(member.lastSeen).fromNow()}
              </AppText>
            )}
          </View>
        </View>
      </View>
    </AppPressable>
  );
};

export default MemberTile;
