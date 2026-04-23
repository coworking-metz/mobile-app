import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, useColorScheme, View, ViewStyle } from 'react-native';
import { FadeInDown, FadeInLeft, useReducedMotion } from 'react-native-reanimated';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import MobileAppAnimation from '@/components/Animations/MobileAppAnimation';
import AppText from '@/components/AppText';
import { useAppI18n } from '@/context/i18n';
import useSettingsStore from '@/stores/settings';

const OnboardingTourStep = ({
  active = false,
  style,
}: {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const { selectLanguage } = useAppI18n();
  const settingsStore = useSettingsStore();
  const colorScheme = useColorScheme();
  const reduceMotion = useReducedMotion();
  const animation = useRef<LottieView>(null);
  // as there is no way to know whether the animation is playing
  // https://github.com/lottie-react-native/lottie-react-native/issues/752
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (animation.current && active && !isPlaying && !reduceMotion) {
      requestAnimationFrame(() => animation.current?.play());
      setPlaying(true);
    }
  }, [animation, colorScheme, active, isPlaying, reduceMotion]);

  return (
    <View style={[tw`flex flex-col`, style]}>
      <MobileAppAnimation ref={animation} autoPlay={false} loop={false} style={tw`w-full h-80`} />

      <View style={tw.style(`mt-4 flex flex-col self-stretch justify-start`)}>
        <AppText
          entering={FadeInLeft.duration(750).delay(150)}
          style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mx-6`}>
          {t('onboarding.tour.title')}
        </AppText>
        <AppText
          entering={FadeInLeft.duration(750).delay(300)}
          style={tw`text-xl font-medium text-slate-600 dark:text-neutral-400 mx-6`}>
          {t('onboarding.tour.headline')}
        </AppText>
        <AppText
          entering={FadeInDown.duration(750).delay(500)}
          style={tw`mt-4 text-base font-normal text-slate-500 dark:text-neutral-500 mx-6`}>
          {t('onboarding.tour.description')}
        </AppText>
      </View>
    </View>
  );
};

export default OnboardingTourStep;
