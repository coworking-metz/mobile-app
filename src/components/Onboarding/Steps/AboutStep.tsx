import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import MobileAppAnimation from '@/components/Animations/MobileAppAnimation';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Settings/ServiceRow';
import { getLanguageLabel, SYSTEM_LANGUAGE } from '@/i18n';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const AboutStep = ({
  active,
  containerHeight,
  onPickingLanguage,
}: {
  active: boolean;
  containerHeight?: number;
  onPickingLanguage: () => void;
}) => {
  const { t } = useTranslation();
  const settingsStore = useSettingsStore();
  const animation = useRef<LottieView>(null);
  // as there is no way to know whether the animation is playing
  // https://github.com/lottie-react-native/lottie-react-native/issues/752
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (animation.current && active && !isPlaying) {
      requestAnimationFrame(() => animation.current?.play());
      setPlaying(true);
    }
  }, [animation, active, isPlaying]);

  return (
    <>
      <View
        style={[
          tw`flex flex-col w-full justify-end items-center overflow-visible`,
          {
            ...(containerHeight && { height: containerHeight / 2 }),
          },
        ]}>
        <MobileAppAnimation
          ref={animation}
          autoPlay={false}
          loop={false}
          progress={0}
          style={tw`w-full h-full`}
        />
      </View>

      {containerHeight ? (
        <View
          style={[
            tw`mt-4 flex flex-col self-stretch px-6 justify-start`,
            { minHeight: containerHeight / 2 - 60 },
          ]}>
          <AppText
            entering={FadeInLeft.duration(750).delay(150)}
            style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
            {t('onboarding.about.title')}
          </AppText>
          <AppText
            entering={FadeInLeft.duration(750).delay(300)}
            style={tw`text-xl font-normal text-slate-500 dark:text-slate-400`}>
            {t('onboarding.about.headline')}
          </AppText>
          <AppText
            entering={FadeInDown.duration(750).delay(500)}
            style={tw`mt-4 text-base font-normal text-gray-500`}>
            {t('onboarding.about.description')}
          </AppText>
          <Animated.View entering={FadeInDown.duration(750).delay(500)} style={tw`mt-auto w-full`}>
            <ServiceRow
              label={t('settings.general.language.label')}
              prefixIcon="web"
              onPress={onPickingLanguage}>
              <AppText style={tw`text-base font-normal text-amber-500 ml-auto`}>
                {getLanguageLabel(
                  !settingsStore.language || settingsStore.language === SYSTEM_OPTION
                    ? SYSTEM_LANGUAGE
                    : settingsStore.language,
                )}
              </AppText>
            </ServiceRow>
          </Animated.View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default AboutStep;
