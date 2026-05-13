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
      style={[tw`flex flex-col w-full p-6`, style]}
      onClose={onClose}>
      <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
        <ToggleSwitchAnimation style={tw`-my-12 h-80 w-99`} />
      </View>
      <AppText
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
        {t('privacy.permissions.ask.title')}
      </AppText>
      <AppText
        style={tw`text-left text-base font-normal text-slate-500 dark:text-neutral-500 w-full mt-4`}>
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
