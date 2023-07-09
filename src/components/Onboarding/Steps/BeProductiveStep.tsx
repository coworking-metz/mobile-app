import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import StandingWorkAnimation from '@/components/Animations/StandingWorkAnimation';

const BeProductiveStep = ({ containerHeight }: { active: boolean; containerHeight?: number }) => {
  const { t } = useTranslation();
  const animation = useRef<LottieView>(null);
  // as there is no way to know whether the animation is playing
  // https://github.com/lottie-react-native/lottie-react-native/issues/752
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (animation.current && !isPlaying) {
      animation.current.play();
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
        <StandingWorkAnimation
          ref={animation}
          loop
          autoPlay={false}
          progress={0.5}
          style={tw`w-full max-w-[256px] mb-[-92px]`}
        />
      </View>
      <View style={tw`mt-4 flex flex-col self-stretch px-6 justify-start items-start`}>
        <Text style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onboarding.beProductive.title')}
        </Text>
        <Text style={tw`mt-4 text-base text-gray-500`}>
          {t('onboarding.beProductive.description')}
        </Text>
      </View>
    </>
  );
};

export default BeProductiveStep;
