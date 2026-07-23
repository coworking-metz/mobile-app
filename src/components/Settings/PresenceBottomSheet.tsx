import AppIcon from '../AppIcon';
import dayjs from 'dayjs';
import React, { forwardRef, ForwardRefRenderFunction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, useColorScheme, View, ViewStyle } from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { Easing } from 'react-native-reanimated';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { theme } from '@/helpers/colors';
import { type ApiMemberActivity } from '@/services/api/members';

const PresenceBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  AppBottomSheetProps & { selectedActivity?: ApiMemberActivity | null }
> = ({ selectedActivity, style, onClose }, forwardedRef) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`p-6`, style]} onClose={onClose}>
      {selectedActivity && <ActivityItem activity={selectedActivity} />}

      <AppText style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('settings.profile.presence.selected.description')}
      </AppText>
    </AppBottomSheet>
  );
};

const ActivityItem = ({
  activity,
  style,
}: {
  activity: ApiMemberActivity;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const ringBackgroundColor = useMemo(() => {
    return colorScheme === 'dark' ? tw.color('stone-800') : tw.color('gray-100');
  }, [activity, colorScheme]);

  const ringColor = useMemo(() => {
    if (activity?.coverage?.debt) {
      return colorScheme === 'dark' ? tw.color('red-700') : tw.color('red-600');
    }
    return activity?.type === 'subscription' ? theme.meatBrown : theme.blueCrayola;
  }, [activity, colorScheme]);

  const coverageText = useMemo(() => {
    if (!activity.coverage) {
      return null;
    }

    if (activity.type === 'subscription') {
      return t('settings.profile.presence.selected.coverage.value.subscription');
    }

    return t('settings.profile.presence.selected.coverage.value.ticket', {
      count: activity.value,
      suffix: activity.coverage.debt
        ? t(
            `settings.profile.presence.selected.debt.${activity.coverage.debt.value !== activity.value ? 'with' : 'unit'}.ticket`,
            { count: activity.coverage.debt.value },
          )
        : '',
    });
  }, [activity, t]);

  return (
    <View style={[tw`flex flex-col`, style]}>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {dayjs(activity.date).format('dddd LL')}
      </AppText>
      <View style={tw`relative mt-4 flex items-center justify-center`}>
        <AnimatedProgressWheel
          rounded
          showProgressLabel
          animateFromValue={0}
          backgroundColor={ringBackgroundColor as string}
          color={ringColor as string}
          duration={activity.value === 1 ? 2000 : 1500}
          easing={Easing.inOut(Easing.ease)}
          labelStyle={tw`text-center text-3xl font-bold text-slate-900 dark:text-gray-200`}
          max={activity.value === 1 ? 1 : 2}
          progress={1}
          rotation={'-90deg'}
          size={144}
          subtitle={
            activity.value === 1
              ? t('settings.profile.presence.selected.unit.full')
              : t('settings.profile.presence.selected.unit.half')
          }
          subtitleStyle={tw`max-w-20 text-center text-xs font-normal text-slate-500 dark:text-neutral-500`}
          width={12}
        />
      </View>

      <ServiceRow
        label={t('settings.profile.presence.selected.coverage.label')}
        style={tw`mt-2 w-full px-0`}>
        <AppText
          style={[
            tw`text-right font-normal text-slate-500 dark:text-neutral-500`,
            activity.coverage?.debt && activity.coverage?.debt.value !== activity.value
              ? tw`text-sm`
              : tw`text-base`,
          ]}>
          {coverageText}
        </AppText>
      </ServiceRow>

      {activity.coverage?.debt && (
        <View style={tw`mb-3 flex w-full flex-row items-start gap-3 overflow-hidden`}>
          <AppIcon
            color={tw.color('yellow-500')}
            icon="alert"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <AppText
            style={tw`shrink grow basis-0 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
            {t('settings.profile.presence.selected.debt.description')}
          </AppText>
        </View>
      )}
    </View>
  );
};

export default forwardRef(PresenceBottomSheet);
