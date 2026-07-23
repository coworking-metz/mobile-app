import AppIcon from '../AppIcon';
import LottieView from 'lottie-react-native';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import tw from 'twrnc';
import SwitchLanguageAnimation from '@/components/Animations/SwitchLanguageAnimation';
import AppBottomSheet, {
  AppBottomSheetRef,
  type AppBottomSheetProps,
} from '@/components/AppBottomSheet';
import AppText from '@/components/AppText';
import ServiceRow from '@/components/Layout/ServiceRow';
import { APP_LANGUAGES, getLanguageLabel, SYSTEM_LANGUAGE } from '@/i18n';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const LanguageBottomSheet: ForwardRefRenderFunction<
  AppBottomSheetRef,
  Omit<AppBottomSheetProps, 'children'>
> = ({ style, ...props }, forwardedRef) => {
  const { t } = useTranslation();
  const supportedLanguages = [
    { label: t('settings.language.system.label'), code: SYSTEM_OPTION },
    ...APP_LANGUAGES,
  ];
  const settingsStore = useSettingsStore();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);
  const animation = useRef<LottieView>(null);
  const reduceMotion = useReducedMotion();

  useImperativeHandle(forwardedRef, () => bottomSheetRef.current as AppBottomSheetRef);

  const onBottomSheetDidPresent = useCallback(() => {
    if (!reduceMotion) {
      animation.current?.play();
    }
  }, [animation, reduceMotion]);

  const onLanguagePicked = useCallback(
    (newLanguage: string) => {
      useSettingsStore.setState({ language: newLanguage });
      bottomSheetRef.current?.close();
    },
    [settingsStore, bottomSheetRef],
  );

  return (
    <AppBottomSheet
      ref={bottomSheetRef}
      style={[tw`flex flex-col gap-0.5 py-6`, style]}
      onDidPresent={onBottomSheetDidPresent}
      {...props}>
      <View style={tw`flex h-40 items-center justify-center overflow-visible`}>
        <SwitchLanguageAnimation ref={animation} style={tw`h-60 w-full`} />
      </View>
      <AppText style={tw`mb-5 text-center text-xl font-medium text-slate-900 dark:text-gray-200`}>
        {t('settings.language.label')}
      </AppText>
      {supportedLanguages.map((language) => (
        <ServiceRow
          description={
            language.code === SYSTEM_OPTION
              ? getLanguageLabel(SYSTEM_LANGUAGE) ||
                `${SYSTEM_LANGUAGE} - ${t('settings.language.system.unsupported')}`
              : ''
          }
          key={`language-option-${language.code}`}
          label={language.label}
          selected={settingsStore.language === language.code}
          style={tw`mx-3 px-3`}
          suffixIcon={settingsStore.language === language.code ? 'check' : null}
          onPress={() => onLanguagePicked(language.code)}>
          {!getLanguageLabel(SYSTEM_LANGUAGE) && language.code === SYSTEM_OPTION ? (
            <AppIcon color={tw.color('yellow-500')} icon="alert" size={24} style={tw`shrink-0`} />
          ) : null}
        </ServiceRow>
      ))}
    </AppBottomSheet>
  );
};

export default forwardRef(LanguageBottomSheet);
