import LoadingSkeleton from '../LoadingSkeleton';
import dayjs from 'dayjs';
import React, { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { BounceOut, FadeInLeft, FadeOutDown } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import ProfilePicture from '@/components/Home/ProfilePicture';
import {
  ApiMemberProfile,
  isMemberBalanceInsufficient,
  isMembershipNonCompliant,
} from '@/services/api/members';

export type MemberCardProps = TouchableHighlightProps & {
  member?: ApiMemberProfile;
  since?: string;
  loading?: boolean;
  pending?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const MemberCard: ForwardRefRenderFunction<typeof TouchableHighlight, MemberCardProps> = (
  { member, since, loading = false, pending = false, disabled = false, onPress, style, children },
  ref,
) => {
  const { t } = useTranslation();

  return (
    <TouchableHighlight
      ref={ref as never}
      disabled={disabled || pending || !onPress}
      style={[tw`flex flex-row items-start gap-3 p-2 rounded-xl`, style]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
      onPress={onPress}>
      {member ? (
        <>
          <ProfilePicture
            loading={loading}
            name={[member.firstName, member.lastName].join(' ')}
            pending={pending}
            style={tw`h-12 w-12`}
            url={member.picture}>
            {member.attending && (
              <Animated.View
                exiting={BounceOut.duration(1000)}
                style={tw`z-10 h-5 w-5 bg-gray-50 dark:bg-zinc-900 rounded-full absolute flex items-center justify-center -bottom-0.5 -right-0.5`}>
                <View style={tw`h-3 w-3 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
              </Animated.View>
            )}
          </ProfilePicture>

          <View
            style={tw`flex flex-col items-start justify-center min-h-12 self-stretch shrink grow basis-0`}>
            <View style={tw`flex flex-row flex-wrap gap-x-1 items-center`}>
              <AppText
                numberOfLines={1}
                style={tw`text-base font-semibold text-gray-900 dark:text-gray-200`}>
                {member.firstName}
              </AppText>
              <AppText
                numberOfLines={1}
                style={tw`text-base font-semibold text-slate-500 dark:text-slate-400`}>
                {member.lastName}
              </AppText>
            </View>
            {since && member.lastSeen && dayjs(since).diff(member.lastSeen, 'minute') > 2 && (
              <AppText
                entering={FadeInLeft.duration(1000)}
                exiting={FadeOutDown.duration(1000)}
                numberOfLines={1}
                style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
                {dayjs(member.lastSeen).fromNow()}
              </AppText>
            )}
            {isMembershipNonCompliant(member) && (
              <View style={tw`mt-1 flex flex-row items-center justify-end gap-1.5`}>
                <View style={tw`h-2 w-2 bg-red-600 dark:bg-red-700 rounded-full`} />
                <AppText
                  numberOfLines={1}
                  style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
                  {member.lastMembership
                    ? t(`attendance.members.membership.last`, { year: member.lastMembership })
                    : t(`attendance.members.membership.none`)}
                </AppText>
              </View>
            )}
            {isMemberBalanceInsufficient(member) && (
              <View style={tw`mt-1 flex flex-row items-center justify-end gap-1.5`}>
                <View style={tw`h-2 w-2 bg-red-600 dark:bg-red-700 rounded-full`} />
                <AppText
                  numberOfLines={1}
                  style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
                  {t('attendance.members.debt.ticket', {
                    count: Math.abs(member.balance),
                  })}
                </AppText>
              </View>
            )}
          </View>
          {children}
        </>
      ) : (
        pending && (
          <>
            <View style={tw`h-12 w-12 rounded-full overflow-hidden`}>
              <LoadingSkeleton height={`100%`} width={`100%`} />
            </View>
            <View style={tw`flex flex-col items-start justify-center min-h-12 self-stretch`}>
              <LoadingSkeleton height={24} width={128} />
            </View>
          </>
        )
      )}
    </TouchableHighlight>
  );
};

export default forwardRef(MemberCard);
