import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { ProgressBar } from 'react-native-ui-lib';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const getTimeleft = (since: string, expired: string): number => {
  const totalTime = Date.parse(expired) - Date.parse(since);
  const timeleft = Date.parse(expired) - Date.now();
  return totalTime > 0 ? (timeleft > 0 ? timeleft : 0) / totalTime : 0;
};

const SubscriptionCard = ({ expired, since, ...props }: { expired: string; since: string }) => {
  const { t } = useTranslation();

  return (
    <View
      {...props}
      style={tw`flex flex-row items-start justify-between bg-gray-200 dark:bg-gray-900 rounded-2xl min-h-24 self-stretch relative overflow-hidden px-3 py-2`}>
      <View style={tw`flex flex-col shrink-1`}>
        <Text numberOfLines={1} style={tw`text-base text-slate-500 dark:text-slate-400`}>
          {dayjs().isBefore(expired)
            ? t('home.tickets.subscription.status.ongoingUntil')
            : t('home.tickets.subscription.status.expiredSince')}
        </Text>
        <Text style={tw`text-2xl text-slate-900 dark:text-gray-200`}>
          {t('home.tickets.subscription.expiration', {
            expired: new Date(expired),
            formatParams: {
              expired: { weekday: 'long', month: 'long', day: 'numeric' },
            },
          })}
        </Text>
      </View>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
        iconStyle={{ height: 24, width: 24, marginRight: 0 }}
        name={dayjs().isBefore(expired) ? 'calendar-check' : 'calendar-blank'}
        size={36}
        style={tw`self-center shrink-0`}
      />
      <ProgressBar
        progress={getTimeleft(since, expired) * 100}
        progressColor={theme.meatBrown}
        style={tw`h-2 absolute bottom-0 left-0 right-0 bg-neutral-300 dark:bg-gray-800`}
      />
    </View>
  );
};

export default SubscriptionCard;
