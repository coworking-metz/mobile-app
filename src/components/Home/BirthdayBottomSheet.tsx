import BirthdayCakeAnimation from '../Animations/BirthdayCakeAnimation';
import AppBottomSheet, { MIN_PADDING_BOTTOM } from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import { isNil } from 'lodash';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import { Confetti } from 'react-native-fast-confetti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ApiMemberProfile } from '@/services/api/members';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const BirthdayBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();
  const settingsStore = useSettingsStore();

  const { data: memberProfile, refetch: refetchProfile } = useQuery<ApiMemberProfile>({
    queryKey: ['members', user?.id],
    enabled: false,
  });

  const onConfettiStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    if (isNil(settingsStore.hasSeenBirthdayPresentAt)) {
      useSettingsStore.setState({ hasSeenBirthdayPresentAt: dayjs().toISOString() });
    }
  }, [settingsStore]);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`pb-0`}
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <Confetti autoplay isInfinite={false} onAnimationStart={onConfettiStart} />
      <View style={tw`mt-6 flex items-center justify-center h-40 overflow-visible`}>
        <BirthdayCakeAnimation style={tw`h-72 -mb-6 w-full`} />
      </View>
      <View
        style={[
          tw`flex flex-col px-6`,
          { paddingBottom: Math.max(insets.bottom, MIN_PADDING_BOTTOM) },
        ]}>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('home.profile.birthday.label')}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('home.profile.birthday.description')}
        </Text>
        <AppRoundedButton disabled style={tw`mt-6 h-14 self-stretch`}>
          <Text style={tw`text-base text-black font-medium`}>
            {t('home.profile.birthday.claim')}
          </Text>
        </AppRoundedButton>
      </View>
    </AppBottomSheet>
  );
};

export default BirthdayBottomSheet;
