import { isNil } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useColorScheme, View } from 'react-native';
import Animated, { FadeInDown, FadeInLeft, useReducedMotion } from 'react-native-reanimated';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import MobileAppAnimation from '@/components/Animations/MobileAppAnimation';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { useAppI18n } from '@/context/i18n';
import { getLanguageLabel, SYSTEM_LANGUAGE } from '@/i18n';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const IntroductionAboutStep = ({
  active,
  containerHeight,
}: {
  active: boolean;
  containerHeight?: number;
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
    <>
      <View
        style={tw.style(
          `flex w-full flex-col items-center justify-end overflow-visible`,
          !isNil(containerHeight) && {
            height: containerHeight / 2,
          },
        )}>
        <MobileAppAnimation
          ref={animation}
          autoPlay={false}
          loop={false}
          style={tw`size-full max-h-80`}
        />
      </View>

      <View style={tw.style(`mt-4 flex flex-col justify-start self-stretch`)}>
        <AppText
          entering={FadeInLeft.duration(750).delay(150)}
          style={tw`mx-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('introduction.about.title')}
        </AppText>
        <AppText
          entering={FadeInLeft.duration(750).delay(300)}
          style={tw`mx-6 text-xl font-medium text-slate-600 dark:text-neutral-400`}>
          {t('introduction.about.headline')}
        </AppText>
        <Trans
          components={[
            <AppText key="emphasis" style={tw`font-medium text-slate-900 dark:text-gray-200`} />,
          ]}
          defaults={t('introduction.about.description')}
          entering={FadeInDown.duration(750).delay(500)}
          parent={AppText}
          style={tw`mx-6 mt-4 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
        />
        <Animated.View entering={FadeInDown.duration(750).delay(500)} style={tw`w-full`}>
          <ServiceRow
            label={t('settings.language.label')}
            prefixIcon="translate"
            style={tw`mx-3 px-3`}
            onPress={selectLanguage}>
            <AppText style={tw`ml-auto text-base font-normal text-amber-500`}>
              {getLanguageLabel(
                !settingsStore.language || settingsStore.language === SYSTEM_OPTION
                  ? SYSTEM_LANGUAGE
                  : settingsStore.language,
              )}
            </AppText>
          </ServiceRow>
        </Animated.View>
      </View>
    </>
  );
};

export default IntroductionAboutStep;
