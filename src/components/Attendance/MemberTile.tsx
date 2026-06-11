import AppPressable from '../AppPressable';
import ProfilePicture from '../Home/ProfilePicture';
import React from 'react';
import { TouchableHighlightProps, View } from 'react-native';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import {
  ApiMemberProfile,
  isMemberBalanceInsufficient,
  isMembershipNonCompliant,
} from '@/services/api/members';

type MemberTileProps = TouchableHighlightProps & {
  member: ApiMemberProfile;
  loading?: boolean;
};

const MemberTile = ({ member, style, loading, onPress, ...props }: MemberTileProps) => {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ');

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
              ]}
              style={[tw`size-full`]}
              url={member.picture}
            />
          </View>
          <View style={[tw`absolute inset-x-[-40%] -bottom-3 items-center`]}>
            <AppText
              numberOfLines={1}
              style={tw`rounded-full bg-white px-3 py-1 text-center text-base font-semibold text-gray-900 shadow-2xl shadow-black dark:bg-zinc-800 dark:text-gray-200`}
              textBreakStrategy="highQuality">
              {member.firstName}
            </AppText>
          </View>
        </View>
      </View>
    </AppPressable>
  );
};

export default MemberTile;
