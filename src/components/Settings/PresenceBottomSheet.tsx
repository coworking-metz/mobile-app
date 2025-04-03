import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { Easing } from 'react-native-reanimated';
import tw from 'twrnc';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Settings/ServiceRow';
import { theme } from '@/helpers/colors';
import { type ApiMemberActivity } from '@/services/api/members';

const PresenceBottomSheet = ({
  activity,
  nonCompliant,
  style,
  onClose,
}: {
  activity: ApiMemberActivity;
  nonCompliant?: ApiMemberActivity;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col w-full p-6`}>
        <AppText
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {dayjs(activity.date).format('dddd LL')}
        </AppText>
        <View style={tw`flex items-center justify-center mt-4 relative`}>
          <AnimatedProgressWheel
            rounded
            showProgressLabel
            animateFromValue={0}
            backgroundColor={(tw.prefixMatch('dark') ? '#413619' : '#FBF0D2') as string}
            color={theme.meatBrown}
            duration={activity.value === 1 ? 2000 : 1500}
            easing={Easing.inOut(Easing.ease)}
            labelStyle={tw`text-slate-900 dark:text-gray-200 text-center text-3xl font-bold`}
            max={activity.value === 1 ? 1 : 2}
            progress={1}
            rotation={'-90deg'}
            size={144}
            subtitle={
              activity.value === 1
                ? t('settings.profile.presence.selected.unit.full')
                : t('settings.profile.presence.selected.unit.half')
            }
            subtitleStyle={tw`max-w-20 text-center text-xs font-normal text-slate-500 dark:text-slate-400`}
            width={12}
          />
        </View>

        <ServiceRow
          label={t('settings.profile.presence.selected.coverage.label')}
          style={tw`w-full px-0 mt-2`}>
          <AppText
            style={[
              tw`font-normal text-slate-500 dark:text-slate-400 text-right`,
              nonCompliant && nonCompliant.value !== activity.value ? tw`text-sm` : tw`text-base`,
            ]}>
            {activity.type === 'subscription'
              ? t('settings.profile.presence.selected.coverage.value.subscription')
              : t('settings.profile.presence.selected.coverage.value.ticket', {
                count: activity.value,
                suffix: nonCompliant
                  ? t(
                    `settings.profile.presence.selected.debt.${nonCompliant.value !== activity.value ? 'with' : 'unit'}.ticket`,
                    {
                      count: nonCompliant.value,
                    },
                  )
                  : '',
              })}
          </AppText>
        </ServiceRow>

        <AppText style={tw`text-left text-base font-normal text-slate-500 w-full`}>
          {t('settings.profile.presence.selected.description')}
        </AppText>

        {nonCompliant && (
          <View style={tw`flex flex-row items-start flex-gap-2 mt-4 w-full overflow-hidden`}>
            <MaterialCommunityIcons
              color={tw.color('yellow-500')}
              iconStyle={tw`h-6 w-6 mr-0`}
              name="alert"
              size={24}
              style={tw`shrink-0 grow-0`}
            />
            <AppText style={tw`text-left text-base font-normal text-slate-500 shrink grow basis-0`}>
              {t('settings.profile.presence.selected.debt.description')}
            </AppText>
          </View>
        )}
      </View>
    </AppBottomSheet>
  );
};

export default PresenceBottomSheet;
