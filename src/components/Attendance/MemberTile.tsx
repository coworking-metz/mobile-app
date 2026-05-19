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
  since?: string;
  loading?: boolean;
};

const MemberTile = ({ member, since, style, loading, onPress, ...props }: MemberTileProps) => {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ');

  return (
    <AppPressable
      disabled={!onPress}
      underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
      onPress={onPress}
      {...props}>
      <View style={[tw`flex flex-col w-full pb-5`, style]}>
        <View style={tw`w-full pt-[100%] relative`}>
          <View style={tw`absolute inset-0 rounded-full overflow-hidden`}>
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
              style={[tw`h-full w-full`]}
              url={member.picture}
            />
          </View>
          <View style={[tw`absolute -bottom-3 items-center -inset-x-[40%]`]}>
            <AppText
              numberOfLines={1}
              style={tw`text-base text-center font-semibold text-gray-900 dark:text-gray-200 shadow-black shadow-2xl bg-white dark:bg-zinc-800 px-3 py-1 rounded-full`}
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
