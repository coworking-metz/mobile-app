import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import DesktopWorkAnimation from '@/components/Animations/DesktopWorkAnimation';

const ActivityStep = ({ containerHeight }: { active: boolean; containerHeight?: number }) => {
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
        <DesktopWorkAnimation
          ref={animation}
          loop
          autoPlay={false}
          progress={0}
          style={tw`w-[375px]`}
        />
      </View>
      <View style={tw`mt-4 flex flex-col self-stretch px-6 justify-start`}>
        <Text style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onboarding.activity.title')}
        </Text>
        <Text style={tw`text-xl text-slate-500 dark:text-slate-400`}>
          {t('onboarding.activity.headline')}
        </Text>
        <Text style={tw`mt-4 text-base text-gray-500`}>{t('onboarding.activity.description')}</Text>
      </View>
    </>
  );
};

export default ActivityStep;
