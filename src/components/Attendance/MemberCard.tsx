import LoadingSkeleton from '../LoadingSkeleton';
import React, { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import ProfilePicture from '@/components/Home/ProfilePicture';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  ApiMemberProfile,
  isMemberBalanceInsufficient,
  isMembershipNonCompliant,
} from '@/services/api/members';

export type MemberCardProps = TouchableHighlightProps & {
  member?: ApiMemberProfile;
  loading?: boolean;
  pending?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const MemberCard: ForwardRefRenderFunction<typeof TouchableHighlight, MemberCardProps> = (
  { member, loading = false, pending = false, disabled = false, onPress, style, children },
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
          <View style={tw`relative h-13 w-13 flex flex-col items-center justify-center`}>
            {loading && (
              <LoadingSpinner
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                style={tw`absolute h-13 w-13`}
              />
            )}
            <ProfilePicture
              attending
              loading={pending}
              style={tw`h-12 w-12`}
              url={member.picture}
            />
          </View>

          <View
            style={tw`flex flex-col gap-1 items-start justify-center min-h-12 self-stretch shrink grow basis-0`}>
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
            {isMembershipNonCompliant(member) && (
              <AppText
                numberOfLines={1}
                style={tw`text-sm font-medium text-gray-800 dark:text-gray-900 rounded-md overflow-hidden bg-gray-200/50 dark:bg-gray-100/80 px-2.5 py-0.5`}>
                {member.lastMembership
                  ? t(`attendance.members.membership.last`, { year: member.lastMembership })
                  : t(`attendance.members.membership.none`)}
              </AppText>
            )}
            {isMemberBalanceInsufficient(member) && (
              <AppText
                numberOfLines={1}
                style={tw`text-sm font-medium text-red-800 rounded-md overflow-hidden bg-red-100 dark:bg-red-200/75 px-2.5 py-0.5`}>
                {t('attendance.members.debt.ticket', {
                  count: Math.abs(member.balance),
                })}
              </AppText>
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
