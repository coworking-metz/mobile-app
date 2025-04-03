import ServiceRow from '../Settings/ServiceRow';
import ZoomableImage from '../ZoomableImage';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import { ApiMemberProfile } from '@/services/api/members';

const MemberBottomSheet = ({
  member,
  style,
  onClose,
}: {
  member?: ApiMemberProfile;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet contentContainerStyle={tw`pt-6`} style={style} onClose={onClose}>
      {member && (
        <>
          <View style={[tw`flex flex-row gap-4 items-center h-32 mx-6`]}>
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
                style={tw`text-left text-xl font-bold tracking-tight text-slate-500 dark:text-slate-400`}>
                {member.lastName}
              </AppText>
            </View>
          </View>

          <View style={tw`flex flex-row gap-2 min-h-6 mt-6 px-6`}>
            <AppText style={tw`text-sm font-normal uppercase text-slate-500`}>
              {t('members.profile.title')}
            </AppText>
          </View>

          <ServiceRow
            withBottomDivider
            label={t('members.profile.since.label')}
            style={tw`px-3 mx-3`}>
            <AppText
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 text-right`}>
              {dayjs(member.created).format('YYYY')}
            </AppText>
          </ServiceRow>
          <ServiceRow label={t('members.profile.location.label')} style={tw`px-3 mx-3`}>
            <Link href={`/on-premise${member.location ? `?location=${member.location}` : ''}`}>
              <AppText style={tw`text-base font-normal text-amber-500 text-right`}>
                {t(`onPremise.location.${member.location || 'unknown'}`)}
              </AppText>
            </Link>
          </ServiceRow>
        </>
      )}
    </AppBottomSheet>
  );
};

export default MemberBottomSheet;
