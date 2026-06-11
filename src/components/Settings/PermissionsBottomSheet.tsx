import * as Linking from 'expo-linking';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import tw from 'twrnc';
import ToggleSwitchAnimation from '@/components/Animations/ToggleSwitchAnimation';
import AppBottomSheet, {
  AppBottomSheetProps,
  AppBottomSheetRef,
} from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';

const PermissionsBottomSheet: ForwardRefRenderFunction<AppBottomSheetRef, AppBottomSheetProps> = (
  { style, onClose },
  forwardedRef,
) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      ref={forwardedRef}
      style={[tw`flex w-full flex-col p-6`, style]}
      onClose={onClose}>
      <View style={tw`flex h-40 items-center justify-center overflow-visible`}>
        <ToggleSwitchAnimation style={tw`-my-12 h-80 w-96`} />
      </View>
      <AppText
        style={tw`mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('privacy.permissions.ask.title')}
      </AppText>
      <AppText
        style={tw`mt-4 w-full text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
        {t('privacy.permissions.ask.description')}
      </AppText>
      <AppRoundedButton
        label={t('privacy.permissions.ask.review')}
        style={tw`mt-6 w-full max-w-sm self-center`}
        suffixIcon="open-in-new"
        onPress={Linking.openSettings}
      />
    </AppBottomSheet>
  );
};

export default forwardRef(PermissionsBottomSheet);
