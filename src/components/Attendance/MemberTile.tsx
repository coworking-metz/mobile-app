import dayjs from 'dayjs';
import { Image } from 'expo-image';
import React from 'react';
import { TouchableHighlight, TouchableHighlightProps, View } from 'react-native';
import { FadeInLeft, FadeOutDown } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import { invertColor } from '@/helpers/colors';
import { getInitials } from '@/helpers/text';
import { ApiMemberProfile } from '@/services/api/members';

// https://uicolors.app/generate/F9B000
const INITIALS_BACKGROUND_COLOR_PALETTE = [
  '#fff385',
  '#ffe646',
  '#ffd51b',
  '#f9b000',
  '#e28a00',
  '#e28a00',
  '#bb6102',
  '#984a08',
];

const getColorFromSeed = (seed: string) => {
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(hash) % INITIALS_BACKGROUND_COLOR_PALETTE.length;
  return INITIALS_BACKGROUND_COLOR_PALETTE[index];
};

type MemberTileProps = TouchableHighlightProps & {
  member: ApiMemberProfile;
  since?: string;
};

const MemberTile = ({ member, since, style, onPress, ...props }: MemberTileProps) => {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ');
  const initials = getInitials(fullName);
  const initialsBackgroundColor = getColorFromSeed(initials || member._id || fullName);
  const initialsTextColor = invertColor(initialsBackgroundColor, true);

  return (
    <TouchableHighlight
      disabled={!onPress}
      style={[tw`rounded-2xl overflow-hidden`, style]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
      onPress={onPress}
      {...props}>
      <View style={tw`flex flex-col items-center justify-start gap-2 min-h-44 relative`}>
        <Image
          cachePolicy="memory"
          contentFit="cover"
          source={{
            uri: member.polaroid,
            cacheKey: `${member.polaroid}-${dayjs().format('YYYY-MM-DD')}`,
          }}
          style={tw`absolute h-full w-full z-10`}
        />
        <View
          style={[
            tw`h-22 w-22 rounded-3xl items-center justify-center`,
            { backgroundColor: initialsBackgroundColor },
          ]}>
          <AppText numberOfLines={1} style={[tw`text-3xl font-bold`, { color: initialsTextColor }]}>
            {initials}
          </AppText>
        </View>

        <View style={tw`flex flex-col items-center self-stretch px-1`}>
          <AppText
            numberOfLines={1}
            style={tw`text-base font-semibold text-gray-900 dark:text-gray-200`}>
            {member.firstName}
          </AppText>
          <AppText
            numberOfLines={1}
            style={tw`text-base font-semibold text-slate-500 dark:text-neutral-400`}>
            {member.lastName}
          </AppText>

          {since && member.lastSeen && dayjs(since).diff(member.lastSeen, 'minute') > 2 && (
            <AppText
              entering={FadeInLeft.duration(1000)}
              exiting={FadeOutDown.duration(1000)}
              numberOfLines={1}
              style={tw`mt-1 text-sm font-normal text-slate-500 dark:text-neutral-500`}>
              {dayjs(member.lastSeen).fromNow()}
            </AppText>
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default MemberTile;
