import DesktopWorkAnimation from '../Animations/DesktopWorkAnimation';
import EmailReceivedAnimation from '../Animations/EmailReceivedAnimation';
import AppTextLink from '../AppTextLink';
import { useOnPremise } from '../OnPremise/OnPremiseContext';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, useReducedMotion } from 'react-native-reanimated';
import tw from 'twrnc';
import StickmanHandshakeAnimation from '@/components/Animations/StickmanHandshakeAnimation';
import { Accordion } from '@/components/AppAccordion';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import useAuthStore from '@/stores/auth';
import useSettingsStore from '@/stores/settings';

const STEPS = ['tour', 'trial', 'enroll'] as const;
type Step = (typeof STEPS)[number];

const OnboardingBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  props,
  forwardedRef,
) => {
  const { t } = useTranslation();
  const authStore = useAuthStore();
  const reduceMotion = useReducedMotion();
  const { selectWifi } = useOnPremise();
  const [selectedStep, setSelectedStep] = useState(new Set<Step>(['tour']));
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  useImperativeHandle(forwardedRef, () => bottomSheetRef.current as AppBottomSheetRef);

  const onPresent = useCallback(() => {
    useSettingsStore.setState({ hasReadOnboardingInstructionsAt: new Date().toISOString() });
  }, []);

  return (
    <AppBottomSheet
      ref={bottomSheetRef}
      detents={['auto', 1]}
      onDidPresent={onPresent}
      {...props}
      style={tw`py-6`}>
      <View style={tw`w-full h-64`}>
        {selectedStep.has('tour') ? (
          <Animated.View
            entering={FadeIn.duration(750)}
            exiting={FadeOut.duration(300)}
            style={tw`w-full h-48 my-auto`}>
            <StickmanHandshakeAnimation
              loop
              autoPlay={!reduceMotion}
              progress={reduceMotion ? 1 : 0.5}
              style={tw`w-full h-full`}
            />
          </Animated.View>
        ) : null}
        {selectedStep.has('trial') ? (
          <Animated.View
            entering={FadeIn.duration(750)}
            exiting={FadeOut.duration(300)}
            style={tw`w-full h-full`}>
            <DesktopWorkAnimation
              loop
              autoPlay={!reduceMotion}
              progress={reduceMotion ? 1 : 0.5}
              style={tw`w-full h-full`}
            />
          </Animated.View>
        ) : null}
        {selectedStep.has('enroll') ? (
          <Animated.View
            entering={FadeInDown.duration(750)}
            exiting={FadeOut.duration(300)}
            style={tw`w-full h-full my-auto`}>
            <EmailReceivedAnimation
              autoPlay={!reduceMotion}
              progress={reduceMotion ? 1 : 0.5}
              style={tw`w-full h-full -scale-x-100`}
            />
          </Animated.View>
        ) : null}
      </View>

      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onboarding.title')}
      </AppText>
      {authStore.user?.onboarding?.date ? (
        <AppText
          style={tw`text-center mt-2 text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {dayjs(authStore.user.onboarding.date).format('LLLL')}
        </AppText>
      ) : null}

      <Accordion<Step>
        keepOpen
        initialOpenItems={selectedStep}
        style={tw`mt-6`}
        type="single"
        onChange={setSelectedStep}>
        <Accordion.Item value="tour">
          <Accordion.Trigger style={tw`px-3 mx-3`}>
            <View style={tw`flex flex-row items-center gap-2 min-h-14`}>
              <AppIcon
                color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
                icon="numeric-1-circle-outline"
                size={24}
              />
              <AppText style={tw`text-xl font-medium text-slate-900 dark:text-neutral-200`}>
                {t('onboarding.tour.title')}
              </AppText>
            </View>
          </Accordion.Trigger>
          <Accordion.Content
            style={tw`ml-9 mr-6 mb-2 pl-5 pb-1 border-l border-gray-300 dark:border-neutral-600`}>
            <Trans
              components={[
                <AppText
                  key="emphasis"
                  style={tw`font-medium text-slate-900 dark:text-gray-200`}
                />,
                <AppTextLink
                  href={`/on-premise?withInformations=true`}
                  key="navigate-to-on-premise-link"
                  style={tw`text-amber-500`}
                  onPress={() => bottomSheetRef.current?.close()}
                />,
              ]}
              defaults={t('onboarding.tour.description')}
              parent={AppText}
              style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
            />
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="trial">
          <Accordion.Trigger style={tw`px-3 mx-3`}>
            <View style={tw`flex flex-row items-center gap-2 min-h-14`}>
              <AppIcon
                color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
                icon="numeric-2-circle-outline"
                size={24}
              />
              <AppText style={tw`text-xl font-medium text-slate-900 dark:text-gray-200`}>
                {t('onboarding.trial.title')}
              </AppText>
            </View>
          </Accordion.Trigger>
          <Accordion.Content
            style={tw`ml-9 mr-6 mb-2 pl-5 pb-1 border-l border-gray-300 dark:border-neutral-600`}>
            <Trans
              components={[
                <AppText
                  key="emphasis"
                  style={tw`font-medium text-slate-900 dark:text-gray-200`}
                />,
                <AppText key="wifi-network" style={tw`text-amber-500`} onPress={selectWifi} />,
              ]}
              defaults={t('onboarding.trial.description')}
              parent={AppText}
              style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
            />
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="enroll">
          <Accordion.Trigger style={tw`px-3 mx-3`}>
            <View style={tw`flex flex-row items-center gap-2 min-h-14`}>
              <AppIcon
                color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
                icon="numeric-3-circle-outline"
                size={24}
              />
              <AppText style={tw`text-xl font-medium text-slate-900 dark:text-gray-200`}>
                {t('onboarding.enroll.title')}
              </AppText>
            </View>
          </Accordion.Trigger>
          <Accordion.Content
            style={tw`ml-9 mr-6 mb-2 pl-5 pb-1 border-l border-gray-300 dark:border-neutral-600`}>
            <Trans
              components={[
                <AppText
                  key="emphasis"
                  style={tw`font-medium text-slate-900 dark:text-gray-200`}
                />,
              ]}
              defaults={t('onboarding.enroll.description')}
              parent={AppText}
              style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500`}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </AppBottomSheet>
  );
};

export default forwardRef(OnboardingBottomSheet);
