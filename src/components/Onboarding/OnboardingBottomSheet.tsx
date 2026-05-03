import OnboardingEnrollStep from './OnboardingEnrollStep';
import OnboardingTourStep from './OnboardingTourStep';
import OnboardingTrialStep from './OnboardingTrialStep';
import AppSquircleView from '../AppSquircleView';
import PaginationDot from '../Introduction/PaginationDot';
import { FlashList } from '@shopify/flash-list';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import tw from 'twrnc';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import useAppState from '@/helpers/app-state';
import { type ApiMemberSubscription } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const OnboardingBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  props,
  forwardedRef,
) => {
  const { t } = useTranslation();
  const isMounted = useRef(false);
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const scrollPosition = useSharedValue(0);
  const onHorizontalScroll = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        scrollPosition.value = event.contentOffset.y;
      },
    },
    [],
  );

  useEffect(() => {
    isMounted.current = true;
  }, []);

  return (
    <AppBottomSheet ref={forwardedRef} {...props}>
      <View
        style={[tw`w-full rounded-3xl overflow-hidden`]}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setCarouselWidth(nativeEvent.layout.width)
        }>
        <View pointerEvents={'none'} style={tw`flex flex-row mx-auto my-6`}>
          {[0, 1, 2].map((_, index) => (
            <PaginationDot
              animationValue={scrollPosition}
              containerWidth={carouselWidth}
              index={index}
              key={`pagination-dot-${index}`}
            />
          ))}
        </View>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          contentContainerStyle={tw`flex flex-row`}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          onScroll={onHorizontalScroll}>
          <OnboardingTourStep active style={{ width: carouselWidth }} />
          <OnboardingTrialStep style={{ width: carouselWidth }} />
          <OnboardingEnrollStep style={{ width: carouselWidth }} />
        </Animated.ScrollView>
      </View>
    </AppBottomSheet>
  );
};

export default forwardRef(OnboardingBottomSheet);
