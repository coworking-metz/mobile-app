import OnboardingEnrollStep from './OnboardingEnrollStep';
import OnboardingTourStep from './OnboardingTourStep';
import OnboardingTrialStep from './OnboardingTrialStep';
import PaginationDot from '../Introduction/PaginationDot';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import tw from 'twrnc';
import AppBottomSheet from '@/components/AppBottomSheet';
import CarouselPaginationDots from '@/components/CarouselPaginationDots';
import useAppState from '@/helpers/app-state';
import { type ApiMemberSubscription } from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const OnboardingBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const isMounted = useRef(false);
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const offset = useSharedValue(0);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  const onHorizontalScroll = useAnimatedScrollHandler(
    {
      onScroll: ({ contentOffset }) => {
        if (carouselWidth) {
          // Normalize to page index so pagination dots interpolate between items.
          offset.value = contentOffset.x / carouselWidth;
        } else {
          offset.value = 0;
        }
      },
    },
    [carouselWidth],
  );

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View
        style={[tw`w-full overflow-hidden`]}
        onLayout={({ nativeEvent }: LayoutChangeEvent) =>
          setCarouselWidth(nativeEvent.layout.width)
        }>
        <View pointerEvents={'none'} style={tw`flex flex-row mx-auto`}>
          {[1, 2, 3].map((_, index) => (
            <PaginationDot
              animationValue={offset}
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

export default OnboardingBottomSheet;
