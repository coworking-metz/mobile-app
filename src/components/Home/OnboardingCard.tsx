import dayjs from 'dayjs';
import { useIsFocused } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { AppGlowingBorder } from '@/components/AppGlowingBorder';
import AppIcon from '@/components/AppIcon';
import AppSquircleView from '@/components/AppSquircleView';
import AppText from '@/components/AppText';

const OnboardingCard = ({
  date,
  glowing = false,
  style,
  activeSince,
}: {
  date: string;
  glowing?: boolean;
  style?: StyleProp<ViewStyle>;
  activeSince?: string;
}) => {
  const { t } = useTranslation();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const isFocus = useIsFocused();

  const appointmentDate = useMemo(() => {
    if (dayjs().diff(date, 'day') < 3) {
      const [firstWord] = dayjs(date).calendar().split(' ');
      if (firstWord) return firstWord;
    }

    return dayjs(date).format('LL').replace(/\d{4}/g, ''); // remove year;
  }, [date, t, isFocus, activeSince]);

  const appointmentTime = useMemo(() => {
    return dayjs(date).format('LT');
  }, [date, t, isFocus, activeSince]);

  return (
    <AppSquircleView
      style={[tw`flex flex-row items-stretch rounded-2xl overflow-hidden relative -m-1`]}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => {
        setHeight(nativeEvent.layout.height);
        setWidth(nativeEvent.layout.width);
      }}>
      {glowing && (
        <AppGlowingBorder
          backgroundColor={tw.prefixMatch('dark') ? '#141417' : '#DEE2E5'}
          height={height}
          style={tw`absolute top-0 left-0`}
          width={width}
        />
      )}

      <AppSquircleView
        style={[
          tw`flex flex-col items-start gap-1 bg-[#DEE2E5] dark:bg-[#141417] rounded-2xl px-3 pt-2 pb-4 m-1`,
          style,
        ]}>
        <AppIcon
          color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
          icon="handshake"
          size={40}
        />

        <AppText
          ellipsizeMode={'clip'}
          numberOfLines={1}
          style={tw`text-base font-normal text-slate-500 dark:text-neutral-500 grow`}>
          {t('home.onboarding.title')}
        </AppText>
        <Trans
          components={[
            <AppText key="date" style={tw`text-slate-900 dark:text-gray-200`} />,
            <AppText key="time" style={tw`text-slate-900 dark:text-gray-200`} />,
          ]}
          defaults={t('home.onboarding.appointment', {
            date: appointmentDate,
            time: appointmentTime,
          })}
          parent={AppText}
          style={tw`text-left text-xl font-normal text-slate-500 dark:text-neutral-500`}
        />
      </AppSquircleView>
    </AppSquircleView>
  );
};

export default OnboardingCard;
