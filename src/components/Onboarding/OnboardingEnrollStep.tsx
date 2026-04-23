import { isNil } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import PeopleGatheringAnimation from '@/components/Animations/PeopleGatheringAnimation';
import AppFader from '@/components/AppFader';
import AppText from '@/components/AppText';

const OnboardingEnrollStep = ({
  active = false,
  style,
}: {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const animation = useRef<LottieView>(null);
  const [speed, setSpeed] = useState(1);
  // as there is no way to know whether the animation is playing
  // https://github.com/lottie-react-native/lottie-react-native/issues/752
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (animation.current && active && !isPlaying && !reduceMotion) {
      requestAnimationFrame(() => animation.current?.play());
      setPlaying(true);
    }
  }, [animation, active, isPlaying, reduceMotion]);

  // trick to fake a loop by reversing the speed when the animation finishes
  const onAnimationFinish = useCallback(() => {
    if (animation.current) {
      if (!isNil(animation.current.props.speed) && animation.current.props.speed >= 0) {
        setSpeed(-1);
        requestAnimationFrame(() => {
          animation.current?.play();
        });
      } else {
        setSpeed(1);
        requestAnimationFrame(() => {
          animation.current?.reset();
          animation.current?.play();
        });
      }
    }
  }, [animation]);

  return (
    <View style={[tw`flex flex-col`, style]}>
      <View
        style={tw.style(
          `flex flex-col justify-end items-center self-center overflow-visible relative w-[640px] `,
        )}>
        <AppFader
          position={Fader.position.START}
          size={144}
          style={tw`absolute inset-y-0 left-0 z-10`}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
        <PeopleGatheringAnimation
          ref={animation}
          autoPlay={false}
          loop={false}
          progress={reduceMotion ? 1 : 0}
          speed={speed}
          style={tw`w-full max-h-80 h-full -mb-16`}
          onAnimationFinish={onAnimationFinish}
        />
        <AppFader
          position={Fader.position.END}
          size={144}
          style={tw`absolute inset-y-0 right-0 z-10`}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
      </View>

      <View style={tw.style(`mt-4 flex flex-col self-stretch justify-start`)}>
        <AppText
          style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mx-6`}>
          {t('onboarding.enrollment.title')}
        </AppText>
        <AppText style={tw`mt-4 text-base font-normal text-slate-500 dark:text-neutral-500 mx-6`}>
          {t('onboarding.enrollment.description')}
        </AppText>
      </View>
    </View>
  );
};

export default OnboardingEnrollStep;
