import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import PeopleMeetingAnimation from '@/components/Animations/PeopleMeetingAnimation';

const MeetPeopleStep = ({
  active,
  containerHeight,
}: {
  active: boolean;
  containerHeight?: number;
}) => {
  const { t } = useTranslation();
  const animation = useRef<LottieView>(null);
  const [speed, setSpeed] = useState(1);
  // as there is no way to know whether the animation is playing
  // https://github.com/lottie-react-native/lottie-react-native/issues/752
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (animation.current && active && !isPlaying) {
      requestAnimationFrame(() => animation.current?.play());
      setPlaying(true);
    }
  }, [animation, active, isPlaying]);

  // trick to fake a loop by reversing the speed when the animation finishes
  const onAnimationFinish = useCallback(() => {
    if (animation.current) {
      if (speed >= 0) {
        setSpeed(-1);
      } else {
        setSpeed(1);
      }
      animation.current.play();
    }
  }, [animation, speed]);

  return (
    <>
      <View
        style={[
          tw`flex flex-col justify-end items-center overflow-visible`,
          {
            ...(containerHeight && { height: containerHeight / 2 }),
          },
        ]}>
        <PeopleMeetingAnimation
          ref={animation}
          autoPlay={false}
          loop={false}
          speed={speed}
          style={{
            width: 640,
            marginBottom: -64,
          }}
          onAnimationFinish={onAnimationFinish}
        />
      </View>
      <View style={tw`mt-4 flex flex-col self-stretch px-6 justify-start items-start`}>
        <Text style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('onboarding.meetPeople.title')}
        </Text>
        <Text style={tw`mt-4 text-base text-gray-500`}>
          {t('onboarding.meetPeople.description')}
        </Text>
      </View>
    </>
  );
};

export default MeetPeopleStep;
