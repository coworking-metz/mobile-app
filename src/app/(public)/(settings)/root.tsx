import { Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import MagicWandAnimation from '@/components/Animations/MagicWandAnimation';
import AppText from '@/components/AppText';
import useAppScreen from '@/helpers/screen';

export default function RootSettings() {
  useDeviceContext(tw);
  const { isWide } = useAppScreen();
  const { t } = useTranslation();

  if (!isWide) {
    return <Redirect href="/settings" />;
  }

  return (
    <Animated.View
      style={tw`flex flex-col grow justify-center items-center h-full w-full bg-gray-100 dark:bg-black`}>
      <View style={tw`flex flex-col items-center justify-end px-4 grow w-full basis-0`}>
        <MagicWandAnimation style={tw`h-56 w-full max-w-xs`} />
      </View>
      <View style={tw`flex flex-col px-4 gap-2 grow basis-0 justify-start mx-auto w-full max-w-sm`}>
        <AppText
          entering={FadeInLeft.duration(500)}
          numberOfLines={1}
          style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('settings.root.title')}
        </AppText>
        <AppText
          entering={FadeInLeft.duration(500).delay(150)}
          numberOfLines={2}
          style={tw`text-base text-center text-slate-500 dark:text-slate-400`}>
          {t('settings.root.description')}
        </AppText>
      </View>
    </Animated.View>
  );
}
