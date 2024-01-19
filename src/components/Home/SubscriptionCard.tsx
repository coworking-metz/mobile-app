import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Skeleton } from 'moti/skeleton';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { type ApiMemberSubscription } from '@/services/api/members';

const SubscriptionCard = ({
  subscription,
  loading,
  style,
}: {
  subscription?: ApiMemberSubscription | null;
  loading?: boolean;
  style?: StyleProps;
}) => {
  const { t } = useTranslation();

  const label = useMemo(() => {
    if (!subscription) return t('home.profile.subscription.label.none');
    const now = dayjs();
    if (now.startOf('day').isAfter(subscription.aboEnd))
      return t('home.profile.subscription.label.expired');
    if (now.isBefore(subscription.aboStart)) return t('home.profile.subscription.label.next');
    return t('home.profile.subscription.label.active');
  }, [subscription, t]);

  const value = useMemo(() => {
    if (!subscription) return t('home.profile.subscription.status.none');
    if (dayjs().startOf('day').isBefore(subscription.aboStart))
      return t('home.profile.subscription.date', {
        date: new Date(subscription.aboStart),
        formatParams: {
          date: { month: 'short', day: 'numeric' },
        },
      });
    if (
      dayjs().isSame(subscription.aboEnd, 'day') ||
      dayjs().add(1, 'day').isSame(subscription.aboEnd, 'day')
    )
      return dayjs(subscription.aboEnd).calendar().split(' ')[0];
    if (dayjs().isSame(subscription.aboEnd, 'week'))
      return dayjs(subscription.aboEnd).format('dddd');
    return t('home.profile.subscription.date', {
      date: new Date(subscription.aboEnd),
      formatParams: {
        date: { month: 'short', day: 'numeric' },
      },
    });
  }, [subscription, t]);

  return (
    <View
      style={[
        tw`flex flex-col items-start gap-1 bg-gray-200 dark:bg-gray-900 rounded-2xl w-32 relative overflow-hidden pl-3 pt-2 pb-4`,
        style,
      ]}>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
        name={
          subscription && !dayjs().startOf('day').isAfter(subscription.aboEnd)
            ? 'calendar-month'
            : 'calendar-blank'
        }
        size={40}
      />

      <Text style={tw`text-base font-normal text-slate-500 dark:text-slate-400 grow`}>{label}</Text>
      {loading ? (
        <Skeleton
          backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
          height={26}
          show={loading}
          width={96}
        />
      ) : (
        <Text
          numberOfLines={1}
          style={[
            tw`text-2xl font-normal`,
            subscription
              ? tw`text-slate-900 dark:text-gray-200`
              : tw`text-gray-400 dark:text-slate-600`,
          ]}>
          {value}
        </Text>
      )}

      {subscription &&
        dayjs().isBetween(subscription.aboStart, subscription.aboEnd, 'day', '[]') && (
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('emerald-700') : tw.color('emerald-600')}
            name="check-circle"
            size={20}
            style={tw`absolute top-3 right-3`}
          />
        )}
    </View>
  );
};

export default SubscriptionCard;
