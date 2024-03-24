import AppBottomSheet from '../AppBottomSheet';
import ServiceRow from '../Settings/ServiceRow';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import ReadMore from 'react-native-read-more-text';
import { Easing, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { type ApiMemberActivity } from '@/services/api/members';

const PresenceBottomSheet = ({
  activity,
  nonCompliant,
  style,
  onClose,
}: {
  activity: ApiMemberActivity;
  nonCompliant?: boolean;
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  const ringColor = useMemo(() => {
    if (activity.value === 1) return nonCompliant ? tw.color('red-700') : theme.meatBrown;
    return nonCompliant ? tw.color('red-300') : theme.peachYellow;
  }, [activity, nonCompliant]);

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full p-6`}>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {dayjs(activity.date).format('dddd LL')}
        </Text>
        <View style={tw`flex items-center justify-center mt-4`}>
          <AnimatedProgressWheel
            rounded
            showProgressLabel
            animateFromValue={0}
            backgroundColor={
              (tw.prefixMatch('dark') ? tw.color('gray-700') : tw.color('gray-100')) as string
            }
            color={ringColor as string}
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
            subtitleStyle={tw`max-w-24 text-center text-sm font-normal text-slate-500 dark:text-slate-400`}
            width={12}
          />
        </View>

        <ServiceRow
          label={t('settings.profile.presence.selected.type.label')}
          style={tw`w-full px-0 mt-2`}>
          <Text
            style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow text-right`}>
            {activity.type === 'subscription'
              ? t(`settings.profile.presence.selected.type.value.subscription`)
              : activity.value > 0.5
                ? t(
                    `settings.profile.presence.selected.${
                      nonCompliant ? 'overconsumed' : 'type'
                    }.value.ticketFull`,
                  )
                : t(
                    `settings.profile.presence.selected.${
                      nonCompliant ? 'overconsumed' : 'type'
                    }.value.ticketHalf`,
                  )}
          </Text>
        </ServiceRow>

        <ReadMore
          numberOfLines={3}
          renderRevealedFooter={(handlePress) => (
            <Text
              style={tw`text-base font-normal text-amber-500 grow text-left`}
              onPress={handlePress}>
              {t('actions.hide')}
            </Text>
          )}
          renderTruncatedFooter={(handlePress) => (
            <Text
              style={tw`text-base font-normal text-amber-500 grow text-left`}
              onPress={handlePress}>
              {t('actions.readMore')}
            </Text>
          )}>
          <Text
            style={tw`text-left text-base font-normal text-slate-500 dark:text-slate-400 w-full mb-2`}>
            {t('settings.profile.presence.selected.description')}
          </Text>
        </ReadMore>
      </View>
    </AppBottomSheet>
  );
};

export default PresenceBottomSheet;
