import BikingIsCoolAnimation from '../Animations/BikingIsCoolAnimation';
import RollingCarAnimation from '../Animations/RollingCarAnimation';
import WalkingChickenAnimation from '../Animations/WalkingChickenAnimation';
import AppSegmentedControl from '../AppSegmentedControl';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isNil } from 'lodash';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, useReducedMotion } from 'react-native-reanimated';
import tw from 'twrnc';
import AppText from '@/components/AppText';
import { COMMUTING_MODES, CommutingMode, getCommuteModeIcon } from '@/helpers/commute';
import useSettingsStore from '@/stores/settings';

const IntroductionServicesStep = ({
  containerHeight,
}: {
  active: boolean;
  containerHeight?: number;
}) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const settingsStore = useSettingsStore();

  return (
    <>
      <View
        style={tw.style(
          `flex flex-col justify-end items-center self-center overflow-visible relative w-full`,
          !isNil(containerHeight) && {
            height: containerHeight / 2,
          },
        )}>
        {settingsStore.commutingMode === CommutingMode.ON_FOOT ? (
          <Animated.View
            entering={FadeInRight.duration(750)}
            exiting={FadeOutLeft.duration(300)}
            style={tw`w-full h-64 -mb-8`}>
            <WalkingChickenAnimation
              loop
              autoPlay={!reduceMotion}
              progress={reduceMotion ? 1 : 0.5}
              style={tw`w-full h-full`}
            />
          </Animated.View>
        ) : null}
        {settingsStore.commutingMode === CommutingMode.CYCLING ? (
          <Animated.View
            entering={FadeInRight.duration(750)}
            exiting={FadeOutLeft.duration(300)}
            style={tw`w-full h-full max-h-58`}>
            <BikingIsCoolAnimation
              loop
              autoPlay={!reduceMotion}
              progress={reduceMotion ? 1 : 0.5}
              style={tw`w-full h-full`}
            />
          </Animated.View>
        ) : null}
        {settingsStore.commutingMode === CommutingMode.DRIVING ? (
          <Animated.View
            entering={FadeInRight.duration(750)}
            exiting={FadeOutLeft.duration(300)}
            style={tw`w-full -mb-32 h-96`}>
            <RollingCarAnimation
              loop
              autoPlay={!reduceMotion}
              progress={reduceMotion ? 1 : 0.5}
              style={tw`w-full h-full -scale-x-100`}
            />
          </Animated.View>
        ) : null}
      </View>

      <View style={tw.style(`mt-4 flex flex-col self-stretch justify-start`)}>
        <AppText
          style={tw`mx-6 text-left text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('introduction.services.title')}
        </AppText>
        <AppText
          style={tw`mt-4 mx-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {t('introduction.services.description')}
        </AppText>
        <View style={tw`mt-4 mx-6`}>
          <AppSegmentedControl
            activeTabColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('white')}
            style={tw`w-full bg-gray-200 dark:bg-zinc-800`}
            tabs={COMMUTING_MODES.map((commutingMode) => (
              <View
                key={`commuting-mode-${commutingMode}`}
                style={tw`flex flex-col items-center gap-1 grow shrink basis-0`}>
                <MaterialCommunityIcons
                  color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
                  iconStyle={{ height: 12, width: 12, marginRight: 0 }}
                  name={getCommuteModeIcon(commutingMode)}
                  size={20}
                />
                <AppText
                  numberOfLines={1}
                  style={tw`text-center text-base font-normal text-slate-600 dark:text-neutral-400`}>
                  {t(`introduction.services.commute.byCommutingMode.${commutingMode}.label`)}
                </AppText>
              </View>
            ))}
            value={COMMUTING_MODES.findIndex((mode) => mode === settingsStore.commutingMode)}
            onChange={(index) =>
              useSettingsStore.setState({ commutingMode: COMMUTING_MODES[index] })
            }
          />
        </View>

        <View style={tw`mt-4 mx-6 flex flex-row items-start gap-3`}>
          <MaterialCommunityIcons
            color={tw.color('blue-600')}
            iconStyle={tw`h-6 w-6 mr-0`}
            name="information"
            size={24}
            style={tw`shrink-0 grow-0`}
          />

          <Trans
            components={[
              <AppText key="emphasis" style={tw`font-medium text-slate-900 dark:text-gray-200`} />,
            ]}
            defaults={t(
              `introduction.services.commute.byCommutingMode.${settingsStore.commutingMode}.description`,
            )}
            parent={AppText}
            style={tw`min-h-20 text-left text-base font-normal text-slate-500 dark:text-neutral-500 shrink grow basis-0`}
          />
        </View>
      </View>
    </>
  );
};

export default IntroductionServicesStep;
