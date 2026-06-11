import { isNil } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import { Switch } from 'react-native-ui-lib';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import PeopleGatheringAnimation from '@/components/Animations/PeopleGatheringAnimation';
import AppFader from '@/components/AppFader';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { useAppPushNotifications } from '@/context/push-notifications';
import { theme } from '@/helpers/colors';

const IntroductionEventsStep = ({
  active,
  containerHeight,
}: {
  active: boolean;
  containerHeight?: number;
}) => {
  const { t } = useTranslation();
  const { arePushNotificationsEnabled, togglePushNotifications } = useAppPushNotifications();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(
    arePushNotificationsEnabled,
  );
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

  useEffect(() => {
    setPushNotificationsEnabled(arePushNotificationsEnabled);
  }, [arePushNotificationsEnabled]);

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
    <>
      <View
        style={tw.style(
          `relative flex w-[640px] flex-col items-center justify-end self-center overflow-visible `,
          !isNil(containerHeight) && {
            height: containerHeight / 2,
          },
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
          style={tw`-mb-16 size-full max-h-80`}
          onAnimationFinish={onAnimationFinish}
        />
        <AppFader
          position={Fader.position.END}
          size={144}
          style={tw`absolute inset-y-0 right-0 z-10`}
          tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100') || ''}
        />
      </View>

      <View style={tw.style(`mt-4 flex flex-col justify-start self-stretch`)}>
        <AppText
          style={tw`mx-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('introduction.events.title')}
        </AppText>
        <Trans
          components={[
            <AppText key="emphasis" style={tw`font-medium text-slate-900 dark:text-gray-200`} />,
          ]}
          defaults={t('introduction.events.description')}
          parent={AppText}
          style={tw`mx-6 mt-4 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
        />
      </View>

      <ServiceRow
        label={t('introduction.events.enableNotifications')}
        prefixIcon="bell-outline"
        style={tw`mx-3 px-3`}>
        <Switch
          value={pushNotificationsEnabled}
          onColor={theme.meatBrown}
          onValueChange={(willEnablePushNotifications) => {
            setPushNotificationsEnabled(willEnablePushNotifications);
            togglePushNotifications(willEnablePushNotifications);
          }}
        />
      </ServiceRow>
    </>
  );
};

export default IntroductionEventsStep;
