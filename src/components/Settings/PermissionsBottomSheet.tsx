import * as Linking from 'expo-linking';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import ToggleSwitchAnimation from '@/components/Animations/ToggleSwitchAnimation';
import AppBottomSheet from '@/components/AppBottomSheet';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';

const PermissionsBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col w-full px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <ToggleSwitchAnimation style={tw`-my-12 h-80 w-99`} />
        </View>
        <AppText
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('privacy.permissions.ask.title')}
        </AppText>
        <AppText style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('privacy.permissions.ask.description')}
        </AppText>
        <AppRoundedButton
          style={tw`self-stretch mt-6`}
          suffixIcon="open-in-new"
          onPress={Linking.openSettings}>
          <AppText style={tw`text-base text-black font-medium`}>
            {t('privacy.permissions.ask.review')}
          </AppText>
        </AppRoundedButton>
      </View>
    </AppBottomSheet>
  );
};

export default PermissionsBottomSheet;
