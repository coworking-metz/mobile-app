import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import SectionTitle from '@/components/Layout/SectionTitle';
import ServiceRow from '@/components/Layout/ServiceRow';
import ZoomableImage from '@/components/ZoomableImage';
import { ApiMemberProfile } from '@/services/api/members';

const MemberBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & { member?: ApiMemberProfile | null; since?: string }
> = ({ member, since, style, onClose }, forwardedRef) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`pt-6`, style]} onClose={onClose}>
      {member && (
        <>
          <View style={tw`flex flex-row gap-4 items-center h-32 mx-6`}>
            <ZoomableImage
              contentFit="cover"
              source={member.polaroid}
              style={[
                tw`h-full bg-gray-200 dark:bg-zinc-800 rounded-xl overflow-hidden`,
                {
                  aspectRatio: 506 / 619,
                },
              ]}
            />
            <View style={tw`flex flex-col items-start`}>
              <AppText
                style={tw`text-left text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {member.firstName}
              </AppText>
              <AppText
                style={tw`text-left text-xl font-bold tracking-tight text-slate-500 dark:text-neutral-400`}>
                {member.lastName}
              </AppText>
            </View>
          </View>

          <SectionTitle style={tw`mt-6 mx-6`} title={t('members.profile.title')} />

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
          <ServiceRow
            description={
              since && member.lastSeen && dayjs(since).diff(member.lastSeen, 'minute') > 2
                ? dayjs(member.lastSeen).fromNow()
                : ''
            }
            label={t('members.profile.location.label')}
            prefixIcon="map-marker-outline"
            style={tw`px-3 mx-3`}
            onPress={() =>
              member?.location
                ? router.push({ pathname: '/on-premise', params: { location: member.location } })
                : null
            }>
            {member?.location && (
              <AppText style={tw`text-base font-normal text-amber-500 text-right`}>
                {t(`onPremise.location.${member.location}`)}
              </AppText>
            )}
          </ServiceRow>

          {!member?._id && (
            <View style={tw`flex flex-row items-start gap-3 my-3 mx-6`}>
              <MaterialCommunityIcons
                color={tw.color('blue-600')}
                iconStyle={tw`h-6 w-6 mr-0`}
                name="information"
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
