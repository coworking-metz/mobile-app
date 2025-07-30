import { isNil } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import DesktopWorkAnimation from '@/components/Animations/DesktopWorkAnimation';
import AppFader from '@/components/AppFader';
import AppText from '@/components/AppText';

const ActivityStep = ({ containerHeight }: { active: boolean; containerHeight?: number }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const animation = useRef<LottieView>(null);
  // as there is no way to know whether the animation is playing
  // https://github.com/lottie-react-native/lottie-react-native/issues/752
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (animation.current && !isPlaying && !reduceMotion) {
      requestAnimationFrame(() => animation.current?.play());
      setPlaying(true);
    }
  }, [animation, isPlaying, reduceMotion]);

  return (
    <>
      <View
        style={tw.style(
          `flex flex-col justify-end items-center self-center overflow-visible relative w-[375px]`,
          !isNil(containerHeight) && {
            height: containerHeight / 2,
          },
        )}>
        <AppFader
          position={Fader.position.START}
          size={96}
          style={tw`absolute inset-y-0 left-0 z-10`}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
        <DesktopWorkAnimation
          ref={animation}
          loop
          autoPlay={false}
          progress={reduceMotion ? 1 : 0}
          style={tw`w-full max-h-80 h-full -mb-6`}
        />
        <AppFader
          position={Fader.position.END}
          size={96}
          style={tw`absolute inset-y-0 right-0 z-10`}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
      </View>

      <View style={tw.style(`mt-4 flex flex-col self-stretch justify-start`)}>
        <AppText
          style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mx-6`}>
          {t('onboarding.activity.title')}
        </AppText>
        <AppText style={tw`text-xl font-normal text-slate-500 dark:text-slate-400 mx-6`}>
          {t('onboarding.activity.headline')}
        </AppText>
        <AppText style={tw`mt-4 text-base font-normal text-gray-500 mx-6`}>
          {t('onboarding.activity.description')}
        </AppText>
      </View>
    </>
  );
};

export default ActivityStep;
