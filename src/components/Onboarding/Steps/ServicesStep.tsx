import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import WorkOnTheGoAnimation from '@/components/Animations/WorkOnTheGoAnimation';
import AppText from '@/components/AppText';
import ThemePicker from '@/components/Settings/ThemePicker';
import { useAppTheme } from '@/context/theme';

const ServicesStep = ({ containerHeight }: { active: boolean; containerHeight?: number }) => {
  const { t } = useTranslation();
  const { selectTheme } = useAppTheme();
  const animation = useRef<LottieView>(null);
  // as there is no way to know whether the animation is playing
  // https://github.com/lottie-react-native/lottie-react-native/issues/752
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (animation.current && !isPlaying) {
      requestAnimationFrame(() => animation.current?.play());
      setPlaying(true);
    }
  }, [animation, isPlaying]);

  return (
    <>
      <View
        style={[
          tw`flex flex-col justify-end items-center overflow-visible`,
          {
            ...(containerHeight && { height: containerHeight / 2 }),
          },
        ]}>
        <WorkOnTheGoAnimation
          ref={animation}
          loop
          autoPlay={false}
          progress={0.5}
          style={tw`w-[320px] max-h-80 h-full`}
        />
      </View>
      <View
        style={[
          tw`mt-4 flex flex-col self-stretch justify-start`,
          { ...(containerHeight && { minHeight: containerHeight / 2 - 60 }) },
        ]}>
        <AppText
          style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mx-6`}>
          {t('onboarding.services.title')}
        </AppText>
        <AppText style={tw`mt-4 text-base font-normal text-gray-500 mx-6`}>
          {t('onboarding.services.description')}
        </AppText>
        <View style={tw`w-full `}>
          <ThemePicker style={tw`px-3 mx-3`} onPress={selectTheme} />
        </View>
      </View>
    </>
  );
};

export default ServicesStep;
