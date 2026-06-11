import { Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import LoveCalendarAnimation from '@/components/Animations/LoveCalendarAnimation';
import AppText from '@/components/AppText';
import useAppScreen from '@/helpers/screen';

export default function RootEvents() {
  useDeviceContext(tw);
  const { isWide } = useAppScreen();
  const { t } = useTranslation();

  if (!isWide) {
    return <Redirect href="/events/calendar" />;
  }

  return (
    <Animated.View
      style={tw`flex size-full grow flex-col items-center justify-center bg-gray-100 dark:bg-black`}>
      <View style={tw`flex w-full grow basis-0 flex-col items-center justify-end px-4`}>
        <LoveCalendarAnimation style={tw`h-56 w-full max-w-xs`} />
      </View>
      <View style={tw`mx-auto flex w-full max-w-sm grow basis-0 flex-col justify-start gap-2 px-4`}>
        <AppText
          entering={FadeInLeft.duration(500)}
          numberOfLines={1}
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('events.root.title')}
        </AppText>
        <AppText
          entering={FadeInLeft.duration(500).delay(150)}
          numberOfLines={2}
          style={tw`text-center text-base text-slate-500 dark:text-neutral-500`}>
          {t('events.root.description')}
        </AppText>
      </View>
    </Animated.View>
  );
}
