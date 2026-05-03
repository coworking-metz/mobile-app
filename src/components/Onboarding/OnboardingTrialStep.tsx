import DesktopWorkAnimation from '../Animations/DesktopWorkAnimation';
import { isNil } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import WorkOnTheGoAnimation from '@/components/Animations/WorkOnTheGoAnimation';
import AppFader from '@/components/AppFader';
import AppText from '@/components/AppText';
import ThemePicker from '@/components/Settings/ThemePicker';
import { useAppTheme } from '@/context/theme';

const OnboardingTrialStep = ({
  active = false,
  style,
}: {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const { selectTheme } = useAppTheme();
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
    <View style={[tw`flex flex-col`, style]}>
      <View
        style={tw.style(
          `flex flex-col justify-end items-center self-center overflow-hidden relative w-full`,
        )}>
        <DesktopWorkAnimation
          ref={animation}
          loop
          autoPlay={false}
          progress={reduceMotion ? 1 : 0}
          style={tw`w-full h-80 -mb-6`}
        />
      </View>

      <View style={tw.style(`mt-4 flex flex-col self-stretch justify-start`)}>
        <AppText
          style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mx-6`}>
          {t('introduction.services.title')}
        </AppText>
        <AppText style={tw`mt-4 text-base font-normal text-slate-500 dark:text-neutral-500 mx-6`}>
          {t('introduction.services.description')}
        </AppText>
        <View style={tw`w-full`}>
          <ThemePicker style={tw`px-3 mx-3`} onPress={selectTheme} />
        </View>
      </View>
    </View>
  );
};

export default OnboardingTrialStep;
