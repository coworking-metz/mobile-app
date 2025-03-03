import ToggleSwitchAnimation from '../Animations/ToggleSwitchAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import * as Linking from 'expo-linking';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

const PermissionsBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <View style={tw`flex flex-col w-full px-6 pt-6`}>
        <View style={tw`flex items-center justify-center h-40 overflow-visible`}>
          <ToggleSwitchAnimation style={tw`-my-12 h-80 w-99`} />
        </View>
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200 mt-4`}>
          {t('privacy.permissions.ask.title')}
        </Text>
        <Text style={tw`text-left text-base font-normal text-slate-500 w-full mt-4`}>
          {t('privacy.permissions.ask.description')}
        </Text>
        <AppRoundedButton
          style={tw`self-stretch mt-6`}
          suffixIcon="open-in-new"
          onPress={Linking.openSettings}>
          <Text style={tw`text-base text-black font-medium`}>
            {t('privacy.permissions.ask.review')}
          </Text>
        </AppRoundedButton>
      </View>
    </AppBottomSheet>
  );
};

export default PermissionsBottomSheet;
