import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import StandingWorkAnimation from '@/components/Animations/StandingWorkAnimation';
import WorkOnTheGoAnimation from '@/components/Animations/WorkOnTheGoAnimation';
import ThemePicker from '@/components/Settings/ThemePicker';

const ServicesStep = ({
  containerHeight,
  onPickingTheme,
}: {
  active: boolean;
  containerHeight?: number;
  onPickingTheme: () => void;
}) => {
  const { t } = useTranslation();
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
          style={tw`w-[320px]`}
        />
      </View>
      <View
        style={[
          tw`mt-4 flex flex-col self-stretch px-6 justify-start items-start`,
          { ...(containerHeight && { minHeight: containerHeight / 2 - 60 }) },
        ]}>
        <Text style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onboarding.services.title')}
        </Text>
        <Text style={tw`mt-4 text-base text-gray-500`}>{t('onboarding.services.description')}</Text>
        <View style={tw`mt-auto w-full`}>
          <ThemePicker onPress={onPickingTheme} />
        </View>
      </View>
    </>
  );
};

export default ServicesStep;
