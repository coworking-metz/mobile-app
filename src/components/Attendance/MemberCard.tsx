import ProfilePicture from '../Home/ProfilePicture';
import { Skeleton } from 'moti/skeleton';
import React, { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { ApiMemberProfile, isMembershipNonCompliant } from '@/services/api/members';

const MemberCard = ({
  member,
  loading = false,
  style,
  children,
  ...props
}: AnimatedProps<ViewProps> & {
  member?: ApiMemberProfile;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) => {
  const { t } = useTranslation();

  const fullname = useMemo(() => {
    return [member?.firstName, member?.lastName].filter(Boolean).join(' ');
  }, [member]);

  return (
    <Animated.View style={[tw`flex flex-row items-start gap-3 px-6 py-2`, style]} {...props}>
      {member ? (
        <>
          <ProfilePicture attending loading={loading} style={tw`h-12 w-12`} url={member.picture} />
          <View style={tw`flex flex-col gap-0.5 items-start min-h-12 self-stretch`}>
            {fullname && (
              <Text
                numberOfLines={1}
                style={tw`text-base font-semibold text-gray-900 dark:text-gray-200`}>
                {fullname}
              </Text>
            )}
            {member.location && (
              <Text
                numberOfLines={1}
                style={tw`text-sm font-normal text-slate-500 dark:text-slate-400`}>
                {t(`onPremise.location.${member.location}`)}
              </Text>
            )}
            {isMembershipNonCompliant(member) && (
              <Text
                numberOfLines={1}
                style={tw`mt-2 text-sm font-medium text-gray-800 dark:text-gray-900 rounded-md overflow-hidden bg-gray-200/50 dark:bg-gray-100/80 px-2.5 py-0.5`}>
                {member.lastMembership
                  ? t(`attendance.members.membership.last`, { year: member.lastMembership })
                  : t(`attendance.members.membership.none`)}
              </Text>
            )}
            {member.balance < 0 && (
              <Text
                numberOfLines={1}
                style={tw`mt-2 text-sm font-medium text-red-800 rounded-md overflow-hidden bg-red-100 dark:bg-red-200/75 px-2.5 py-0.5`}>
                {t('attendance.members.debt.ticket', {
                  count: Math.abs(member.balance),
                })}
              </Text>
            )}
          </View>
          {children}
        </>
      ) : (
        loading && (
          <>
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={`100%`}
              width={`100%`}
            />
          </>
        )
      )}
    </Animated.View>
  );
};

export default MemberCard;
