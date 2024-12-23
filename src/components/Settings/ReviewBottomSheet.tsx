import RateStarsAnimation from '../Animations/RateStarsAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import AppTextButton from '../AppTextButton';
import { Link } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { useErrorNotification } from '@/helpers/error';

const ReviewBottomSheet = ({ style, onClose }: { style?: StyleProps; onClose?: () => void }) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);

  const notifyError = useErrorNotification();

  const onReview = useCallback(() => {
    setLoading(true);
    StoreReview.requestReview().finally(() => {
      setLoading(false);
    });
  }, [notifyError, t]);

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <RateStarsAnimation style={tw`h-48 w-full`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('settings.support.review.title')}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('settings.support.review.description')}
        </Text>
        <AppRoundedButton loading={isLoading} style={tw`self-stretch mt-6`} onPress={onReview}>
          <Text style={tw`text-base text-black font-medium`}>
            {t('settings.support.review.rateOnStore')}
          </Text>
        </AppRoundedButton>
        <Link asChild href={`https://g.page/r/Cc8iG0WZSUcoEAE/review`}>
          <AppTextButton style={tw`mt-4`} suffixIcon="open-in-new">
            <Text style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
              {t('settings.support.review.rateOnGoogleMaps')}
            </Text>
          </AppTextButton>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default ReviewBottomSheet;
