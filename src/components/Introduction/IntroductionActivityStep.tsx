import ThemePicker from '../Settings/ThemePicker';
import { isNil } from 'lodash';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import tw from 'twrnc';
import WorkingGirlOnComputerAnimation from '@/components/Animations/WorkingGirlOnComputerAnimation';
import AppText from '@/components/AppText';
import { useAppTheme } from '@/context/theme';

const IntroductionActivityStep = ({
  containerHeight,
}: {
  active: boolean;
  containerHeight?: number;
}) => {
  const { t } = useTranslation();
  const { selectTheme } = useAppTheme();
  const reduceMotion = useReducedMotion();

  return (
    <>
      <View
        style={tw.style(
          `flex flex-col justify-end items-center self-center overflow-visible relative w-[375px]`,
          !isNil(containerHeight) && {
            height: containerHeight / 2,
          },
        )}>
        <WorkingGirlOnComputerAnimation
          loop
          autoPlay={!reduceMotion}
          progress={reduceMotion ? 1 : 0}
          style={tw`w-full max-h-60 h-full mb-6`}
        />
      </View>

      <View style={tw.style(`mt-4 flex flex-col self-stretch justify-start`)}>
        <AppText
          style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mx-6`}>
          {t('introduction.activity.title')}
        </AppText>
        <Trans
          components={[
            <AppText key="emphasis" style={tw`font-medium text-slate-900 dark:text-gray-200`} />,
          ]}
          defaults={t('introduction.activity.description')}
          parent={AppText}
          style={tw`mt-4 mx-6 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
        />
        <View style={tw`w-full`}>
          <ThemePicker style={tw`px-3 mx-3`} onPress={selectTheme} />
        </View>
      </View>
    </>
  );
};

export default IntroductionActivityStep;
