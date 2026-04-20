import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { FadeInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import AppIconButton from '@/components/AppIconButton';
import AppRoundedButton from '@/components/AppRoundedButton';
import AppText from '@/components/AppText';
import { useAppContact } from '@/context/contact';
import { useAppPaddingBottom } from '@/helpers/screen';

const MissingScreen = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const contact = useAppContact();
  const paddingBottom = useAppPaddingBottom();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View
      style={[
        tw`flex flex-col gap-4 h-full w-full bg-gray-100 dark:bg-black`,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom,
        },
      ]}>
      <View style={tw`flex flex-row px-4`}>
        <AppIconButton
          icon="arrow-left"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/settings'))}
        />
      </View>
      <View style={tw`flex flex-col items-center justify-end w-full px-4 grow basis-0`}>
        <TumbleweedRollingAnimation style={tw`h-56 w-full max-w-xs`} />
      </View>
      <View style={tw`flex flex-col px-4 gap-2 grow basis-0 justify-start mx-auto w-full max-w-sm`}>
        <AppText
          entering={FadeInLeft.duration(500)}
          numberOfLines={1}
          style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('notFound.title')}
        </AppText>
        <AppText
          entering={FadeInLeft.duration(500).delay(150)}
          numberOfLines={2}
          style={tw`text-base text-center text-slate-500 dark:text-neutral-500 mb-auto`}>
          {t('notFound.description')}
        </AppText>

        <AppRoundedButton style={tw`mt-4 mx-2 w-full max-w-sm self-center`} onPress={contact}>
          <AppText style={tw`text-base font-medium text-black`}>{t('notFound.help')}</AppText>
        </AppRoundedButton>
      </View>
    </View>
  );
};

export default MissingScreen;
