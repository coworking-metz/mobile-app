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
        tw`flex size-full flex-col gap-4 bg-gray-100 dark:bg-black`,
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
      <View style={tw`flex w-full grow basis-0 flex-col items-center justify-end px-4`}>
        <TumbleweedRollingAnimation style={tw`h-56 w-full max-w-xs`} />
      </View>
      <View style={tw`mx-auto flex w-full max-w-sm grow basis-0 flex-col justify-start gap-2 px-4`}>
        <AppText
          entering={FadeInLeft.duration(500)}
          numberOfLines={1}
          style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('notFound.title')}
        </AppText>
        <AppText
          entering={FadeInLeft.duration(500).delay(150)}
          numberOfLines={2}
          style={tw`mb-auto text-center text-base text-slate-500 dark:text-neutral-500`}>
          {t('notFound.description')}
        </AppText>

        <AppRoundedButton
          label={t('notFound.help')}
          style={tw`mx-2 mt-4 w-full max-w-sm self-center`}
          onPress={contact}
        />
      </View>
    </View>
  );
};

export default MissingScreen;
