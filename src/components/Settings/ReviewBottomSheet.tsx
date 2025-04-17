import { Link } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import RateStarsAnimation from '@/components/Animations/RateStarsAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import { useErrorNotification } from '@/helpers/error';

const ReviewBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
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
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col w-full px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <RateStarsAnimation style={tw`h-48 w-full`} />
        </View>
        <AppText
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('settings.support.review.title')}
        </AppText>
        <AppText style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('settings.support.review.description')}
        </AppText>
        <AppRoundedButton
          loading={isLoading}
          style={tw`mt-6 w-full max-w-md self-center`}
          onPress={onReview}>
          <AppText style={tw`text-base text-black font-medium`}>
            {t('settings.support.review.rateOnStore')}
          </AppText>
        </AppRoundedButton>
        <Link asChild href={`https://g.page/r/Cc8iG0WZSUcoEAE/review`}>
          <AppTextButton style={tw`mt-4 w-full max-w-md self-center`} suffixIcon="open-in-new">
            <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
              {t('settings.support.review.rateOnGoogleMaps')}
            </AppText>
          </AppTextButton>
        </Link>
      </View>
    </AppBottomSheet>
  );
};

export default ReviewBottomSheet;
