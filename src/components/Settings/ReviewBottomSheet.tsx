import { Link } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import React, { forwardRef, ForwardRefRenderFunction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import RateStarsAnimation from '@/components/Animations/RateStarsAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import AppTextButton from '@/components/AppTextButton';
import useNoticeStore from '@/stores/notice';

const ReviewBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const noticeStore = useNoticeStore();

  const onReview = useCallback(() => {
    setLoading(true);
    StoreReview.requestReview()
      .catch((error) => noticeStore.addError(error, { message: t('review.onRequest.fail') }))
      .finally(() => {
        setLoading(false);
      });
  }, [t]);

  return (
    <AppBottomSheet ref={forwardedRef} style={[tw`flex flex-col p-6`, style]} onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <RateStarsAnimation style={tw`h-48 w-full`} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
        {t('settings.review.title')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 w-full mt-4`}>
        {t('settings.review.description')}
      </AppText>
      <AppRoundedButton
        label={t('settings.review.rateOnStore')}
        loading={isLoading}
        style={tw`mt-6 w-full max-w-sm self-center`}
        onPress={onReview}
      />
      <Link asChild href={`https://g.page/r/Cc8iG0WZSUcoEAE/review`}>
        <AppTextButton style={tw`mt-4 w-full max-w-sm self-center`} suffixIcon="open-in-new">
          <AppText style={tw`text-base font-medium text-slate-900 dark:text-gray-200`}>
            {t('settings.review.rateOnGoogleMaps')}
          </AppText>
        </AppTextButton>
      </Link>
    </AppBottomSheet>
  );
};

export default forwardRef(ReviewBottomSheet);
