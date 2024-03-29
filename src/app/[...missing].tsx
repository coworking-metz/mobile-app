import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import TumbleweedRollingAnimation from '@/components/Animations/TumbleweedRollingAnimation';
import AppRoundedButton from '@/components/AppRoundedButton';
import ContactBottomSheet from '@/components/Settings/ContactBottomSheet';
import { theme } from '@/helpers/colors';

const MissingScreen = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const [isContacting, setContacting] = useState(false);

  return (
    <View
      style={[
        tw`flex flex-col gap-4 h-full w-full bg-gray-100 dark:bg-black`,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <View style={tw`flex flex-row px-4`}>
        <MaterialCommunityIcons.Button
          backgroundColor="transparent"
          borderRadius={24}
          color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
          iconStyle={{ marginRight: 0 }}
          name="arrow-left"
          size={40}
          style={tw`p-1`}
          underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
      </View>
      <View style={tw`flex flex-col items-center justify-end px-4 grow basis-0`}>
        <TumbleweedRollingAnimation style={tw`h-56 w-full max-w-xs`} />
      </View>
      <View style={tw`flex flex-col justify-start px-4 gap-2 grow basis-0 max-w-sm`}>
        <Animated.Text
          entering={FadeInLeft.duration(500)}
          numberOfLines={1}
          style={tw`text-xl text-center font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
          {t('notFound.title')}
        </Animated.Text>
        <Animated.Text
          entering={FadeInLeft.duration(500).delay(150)}
          numberOfLines={2}
          style={tw`text-base text-center text-slate-500 dark:text-slate-400`}>
          {t('notFound.description')}
        </Animated.Text>

        <AppRoundedButton style={tw`mt-4 mx-2 h-14`} onPress={() => setContacting(true)}>
          <Text style={tw`text-base font-medium`}>{t('notFound.help')}</Text>
        </AppRoundedButton>
      </View>

      {isContacting && <ContactBottomSheet onClose={() => setContacting(false)} />}
    </View>
  );
};

export default MissingScreen;
