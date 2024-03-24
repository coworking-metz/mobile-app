import MembershipFormAnimation from '../Animations/MembershipFormAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import ServiceRow from '../Settings/ServiceRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const MembershipBottomSheet = ({
  lastMembershipYear,
  valid,
  active,
  activityOverLast6Months,
  loading = false,
  style,
  onClose,
}: {
  lastMembershipYear?: number;
  valid?: boolean;
  active?: boolean;
  loading?: boolean;
  activityOverLast6Months?: number;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full p-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <MembershipFormAnimation active={active && valid} style={tw`h-56 w-full`} valid={valid} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('home.profile.membership.label')}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('home.profile.membership.description')}
        </Text>

        <ServiceRow
          withBottomDivider
          label={t('home.profile.membership.status.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={24}
              width={128}
            />
          ) : (
            <Text
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
              {valid
                ? t('home.profile.membership.status.valid', { year: lastMembershipYear })
                : lastMembershipYear
                  ? t('home.profile.membership.status.invalid', { year: lastMembershipYear })
                  : t('home.profile.membership.status.none')}
            </Text>
          )}
        </ServiceRow>

        <ServiceRow
          withBottomDivider
          description={t('home.profile.membership.activity.description')}
          label={t('home.profile.membership.activity.label')}
          style={tw`w-full px-0`}>
          {loading ? (
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={24}
              width={128}
            />
          ) : (
            <Text
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
              {t('home.profile.membership.activity.days', { count: activityOverLast6Months || 0 })}
            </Text>
          )}
        </ServiceRow>

        <ServiceRow label={t('home.profile.membership.grade.label')} style={tw`w-full px-0`}>
          {loading ? (
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={24}
              width={128}
            />
          ) : (
            <Text
              style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
              {active && valid
                ? t('home.profile.membership.grade.active.label')
                : valid
                  ? t('home.profile.membership.grade.standard.label')
                  : t('home.profile.membership.grade.none.label')}
            </Text>
          )}
        </ServiceRow>

        {valid ? (
          <View style={tw`flex flex-row items-start flex-gap-2 mb-4 w-full overflow-hidden`}>
            <MaterialCommunityIcons
              color={
                active
                  ? theme.meatBrown
                  : tw.prefixMatch('dark')
                    ? tw.color('gray-400')
                    : tw.color('gray-700')
              }
              iconStyle={tw`h-6 w-6 mr-0`}
              name="star-circle-outline"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <Text style={tw`text-base font-normal text-slate-500 shrink grow basis-0`}>
              {active
                ? t('home.profile.membership.grade.active.description')
                : t('home.profile.membership.grade.standard.description')}
            </Text>
          </View>
        ) : (
          <View style={tw`flex flex-row items-start flex-gap-2 mb-4 w-full overflow-hidden`}>
            <MaterialCommunityIcons
              color={tw.color('yellow-500')}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="alert"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <Text style={tw`text-base font-normal text-slate-500 shrink grow basis-0`}>
              {t('home.profile.membership.required')}
            </Text>
          </View>
        )}

        {!valid && (
          <Link
            asChild
            href="https://www.coworking-metz.fr/boutique/carte-adherent/"
            style={tw`mt-2`}>
            <AppRoundedButton style={tw`h-14 self-stretch`} suffixIcon="open-in-new">
              <Text style={tw`text-base font-medium text-black`}>
                {lastMembershipYear
                  ? t('home.profile.membership.renew', { year: dayjs().year() })
                  : t('home.profile.membership.get', { year: dayjs().year() })}
              </Text>
            </AppRoundedButton>
          </Link>
        )}
      </View>
    </AppBottomSheet>
  );
};

export default MembershipBottomSheet;
