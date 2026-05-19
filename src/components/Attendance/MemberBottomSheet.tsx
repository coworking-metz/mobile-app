import dayjs from 'dayjs';
import { Link, useRouter } from 'expo-router';
import { includes } from 'lodash';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import ZoomableImage from '@/components/ZoomableImage';
import {
  ApiMemberProfile,
  isMemberBalanceInsufficient,
  isMembershipNonCompliant,
} from '@/services/api/members';
import { MANAGER_BASE_URL } from '@/services/environment';
import useAuthStore from '@/stores/auth';

const MemberBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & { member?: ApiMemberProfile | null; since?: string }
> = ({ member, since, style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const router = useRouter();

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`py-6`, style]} onClose={onClose}>
      {member && (
        <>
          <View style={tw`flex flex-row gap-4 items-end justify-between h-32 mx-6`}>
            <View style={tw`flex flex-col items-start`}>
              <AppText
                style={tw`text-left text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {member.firstName}
              </AppText>
              <AppText
                style={tw`text-left text-3xl font-normal text-slate-500 dark:text-neutral-500`}>
                {member.lastName}
              </AppText>
            </View>

            <ZoomableImage
              contentFit="cover"
              source={member.polaroid}
              style={[
                tw`h-full bg-gray-200 dark:bg-zinc-800 rounded-xl overflow-hidden`,
                { aspectRatio: 506 / 619 },
              ]}
            />
          </View>

          <SectionTitle style={tw`mt-6 mx-6`} title={t('members.profile.title')}>
            {includes(authStore.user?.roles, 'admin') && (
              <Link asChild href={`${MANAGER_BASE_URL}/members/${member._id}`}>
                <AppText
                  style={tw`ml-auto text-base font-normal leading-5 text-right text-amber-500 min-w-5`}>
                  {t('members.profile.navigateToManager')} <AppIcon icon="open-in-new" size={16} />
                </AppText>
              </Link>
            )}
          </SectionTitle>

          {member.created && (
            <ServiceRow
              withBottomDivider
              label={t('members.profile.since.label')}
              prefixIcon="medal-outline"
              style={tw`px-3 mx-3`}>
              <AppText
                style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
                {dayjs(member.created).format('YYYY')}
              </AppText>
            </ServiceRow>
          )}
          {isMembershipNonCompliant(member) && (
            <ServiceRow
              withBottomDivider
              label={t('members.profile.membership.label')}
              prefix={
                <View style={tw`flex flex-row items-center shrink-0 min-h-10 relative`}>
                  <AppIcon
                    color={tw.prefixMatch('dark') ? tw.color('stone-400') : tw.color('gray-700')}
                    icon="badge-account-horizontal-outline"
                    size={24}
                    style={tw`shrink-0`}
                  />

                  <Animated.View
                    entering={BounceIn.duration(1000)}
                    exiting={BounceOut.duration(1000)}
                    style={tw`z-20 h-3.5 w-3.5 bg-gray-50 dark:bg-zinc-900 rounded-full absolute flex items-center justify-center -bottom-0 -right-1`}>
                    <View style={tw`h-2.5 w-2.5 bg-red-600 dark:bg-red-700 rounded-full`} />
                  </Animated.View>
                </View>
              }
              style={tw`px-3 mx-3`}>
              <Trans
                components={[
                  <AppText
                    key="emphasis"
                    style={tw`font-semibold text-slate-900 dark:text-gray-200`}
                  />,
                ]}
                defaults={
                  member.lastMembership
                    ? t(`members.profile.membership.last`, { year: member.lastMembership })
                    : t(`members.profile.membership.none`)
                }
                parent={AppText}
                style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}
              />
            </ServiceRow>
          )}
          {isMemberBalanceInsufficient(member) && (
            <ServiceRow
              withBottomDivider
              label={t('members.profile.balance.label')}
              prefix={
                <View style={tw`flex flex-row items-center shrink-0 min-h-10 relative`}>
                  <AppIcon
                    color={tw.prefixMatch('dark') ? tw.color('stone-400') : tw.color('gray-700')}
                    icon="ticket"
                    size={24}
                    style={tw`shrink-0`}
                  />

                  <Animated.View
                    entering={BounceIn.duration(1000)}
                    exiting={BounceOut.duration(1000)}
                    style={tw`z-20 h-3.5 w-3.5 bg-gray-50 dark:bg-zinc-900 rounded-full absolute flex items-center justify-center -bottom-0 -right-1`}>
                    <View style={tw`h-2.5 w-2.5 bg-red-600 dark:bg-red-700 rounded-full`} />
                  </Animated.View>
                </View>
              }
              style={tw`px-3 mx-3`}>
              <Trans
                components={[
                  <AppText
                    key="emphasis"
                    style={tw`font-semibold text-slate-900 dark:text-gray-200`}
                  />,
                ]}
                defaults={t('members.profile.balance.debt', {
                  count: Math.abs(member.balance),
                })}
                parent={AppText}
                style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}
              />
            </ServiceRow>
          )}
          <ServiceRow
            description={
              since && member.lastSeen && dayjs(since).diff(member.lastSeen, 'minute') > 2
                ? dayjs(member.lastSeen).fromNow()
                : ''
            }
            label={t('members.profile.location.label')}
            prefix={
              <View style={tw`flex flex-row items-center shrink-0 min-h-10 relative`}>
                <AppIcon
                  color={tw.prefixMatch('dark') ? tw.color('stone-400') : tw.color('gray-700')}
                  icon="map-marker-outline"
                  size={24}
                  style={tw`shrink-0`}
                />

                {member?.attending && (
                  <Animated.View
                    entering={BounceIn.duration(1000)}
                    exiting={BounceOut.duration(1000)}
                    style={tw`z-20 h-3.5 w-3.5 bg-gray-50 dark:bg-zinc-900 rounded-full absolute flex items-center justify-center -bottom-0 -right-1`}>
                    <View style={tw`h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-700 rounded-full`} />
                  </Animated.View>
                )}
              </View>
            }
            style={tw`px-3 mx-3`}
            onPress={() =>
              member?.location
                ? router.push({ pathname: '/on-premise', params: { location: member.location } })
                : null
            }>
            {member?.location ? (
              <AppText style={tw`text-base font-normal text-amber-500 text-right`}>
                {t(`onPremise.location.${member.location}`)}
              </AppText>
            ) : (
              <AppText
                style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 text-right`}>
                {t('members.profile.location.unknown')}
              </AppText>
            )}
          </ServiceRow>

          {!member?._id && (
            <View style={tw`flex flex-row items-start gap-3 my-3 mx-6`}>
              <AppIcon
                color={tw.color('blue-600')}
                icon="information"
                size={24}
                style={tw`shrink-0 grow-0`}
              />

              <AppText
                style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 shrink grow basis-0`}>
                {t('members.profile.anonymous.description')}
              </AppText>
            </View>
          )}
        </>
      )}
    </AppBottomSheet>
  );
};

export default forwardRef(MemberBottomSheet);
