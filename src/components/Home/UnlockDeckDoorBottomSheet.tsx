import UnlockAnimation from '../Animations/UnlockAnimation';
import AppBottomSheet from '../AppBottomSheet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';

const UnlockDeckDoorBottomSheet = ({
  style,
  onClose,
}: {
  style?: StyleProps;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AppBottomSheet style={style} onClose={onClose}>
      <View style={tw`flex flex-col items-center justify-between gap-4 p-6`}>
        <UnlockAnimation style={tw`w-full max-h-[144px]`} />
        <Text
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('controls.door.onUnlocked.label')}
        </Text>
        <Text style={tw`text-center text-base text-slate-500 dark:text-slate-400 w-full`}>
          {t('controls.door.onUnlocked.description')}
        </Text>
      </View>
    </AppBottomSheet>
  );
};

export default UnlockDeckDoorBottomSheet;
