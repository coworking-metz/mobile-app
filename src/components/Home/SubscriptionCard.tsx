import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import useAppState from '@/helpers/app-state';
import { type ApiMemberSubscription } from '@/services/api/members';

const SubscriptionCard = ({
  subscription,
  loading,
  style,
}: {
  subscription?: ApiMemberSubscription | null;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const isFocus = useIsFocused();
  const activeSince = useAppState();

  const label = useMemo(() => {
    if (!subscription) return t('home.profile.subscription.label.none');
    const now = dayjs();
    if (now.startOf('day').isAfter(subscription.ended))
      return t('home.profile.subscription.label.expired');
    if (now.isBefore(subscription.started)) return t('home.profile.subscription.label.next');
    if (dayjs().isSame(subscription.ended, 'week'))
      return t('home.profile.subscription.label.expireSoon');
    return t('home.profile.subscription.label.activeUntil');
  }, [subscription, t, isFocus, activeSince]);

  const expirationDate = useMemo(() => {
    if (!subscription) return t('home.profile.subscription.status.none');

    const today = dayjs().startOf('day');
    if (today.isBefore(subscription.started)) {
      return t('home.profile.subscription.date', {
        date: new Date(subscription.started),
        formatParams: {
          date: { month: 'short', day: 'numeric' },
        },
      });
    }

    const yesterday = today.subtract(1, 'day');
    const tomorrow = today.add(1, 'day');
    if (dayjs(subscription.ended).isBetween(yesterday, tomorrow, 'minute', '[]')) {
      const [firstWord] = dayjs(subscription.ended).calendar().split(' ');
      if (firstWord) return firstWord;
    }

    if (today.isSame(subscription.ended, 'week')) {
      return dayjs(subscription.ended).format('dddd');
    }

    return t('home.profile.subscription.date', {
      date: new Date(subscription.ended),
      formatParams: {
        date: { month: 'short', day: 'numeric' },
      },
    });
  }, [subscription, t, isFocus, activeSince]);

  return (
    <AppSquircleView
      style={[
        tw`flex flex-col items-start gap-1 bg-gray-300/60 dark:bg-zinc-900/85 rounded-2xl relative overflow-hidden px-3 pt-2 pb-4`,
        style,
      ]}>
      <MaterialCommunityIcons
        color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
        name={
          subscription && !dayjs().startOf('day').isAfter(subscription.ended)
            ? 'calendar-month'
            : 'calendar-blank'
        }
        size={40}
      />

      <AppText
        ellipsizeMode={'clip'}
        numberOfLines={2}
        style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 grow`}>
        {label}
      </AppText>
      {loading ? (
        <LoadingSkeleton height={26} show={loading} width={96} />
      ) : (
        <AppText
          ellipsizeMode={'clip'}
          numberOfLines={1}
          style={[
            tw`text-2xl font-normal w-full`,
            subscription
              ? tw`text-slate-900 dark:text-gray-200`
              : tw`text-gray-400 dark:text-slate-600`,
          ]}>
          {expirationDate}
        </AppText>
      )}

      {subscription && dayjs().isBetween(subscription.started, subscription.ended, 'day', '[]') && (
        <MaterialCommunityIcons
          color={tw.prefixMatch('dark') ? tw.color('emerald-700') : tw.color('emerald-600')}
          name="check-circle"
          size={20}
          style={tw`absolute top-3 right-3 z-10`}
        />
      )}
    </AppSquircleView>
  );
};

export default SubscriptionCard;
