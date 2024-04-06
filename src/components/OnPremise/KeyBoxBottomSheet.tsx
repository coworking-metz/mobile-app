import KeysPairAnimation from '../Animations/KeysPairAnimation';
import AppBottomSheet from '../AppBottomSheet';
import AppRoundedButton from '../AppRoundedButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import Animated, { FadeIn, FadeOutDown, type StyleProps } from 'react-native-reanimated';
import { RandomReveal } from 'react-random-reveal';
import tw from 'twrnc';
import type LottieView from 'lottie-react-native';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { getKeyBoxCode } from '@/services/api/services';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';

const KeyBoxBottomSheet = ({ style, onClose }: { style?: StyleProps; onClose?: () => void }) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const noticeStore = useNoticeStore();
  const [code, setCode] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);

  const onFetchCode = useCallback(() => {
    setLoading(true);
    getKeyBoxCode()
      .then(({ code: fetchedCode }) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCode(fetchedCode);
      })
      .catch(handleSilentError)
      .catch(async (error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('onPremise.keyBox.onFetch.fail'),
          description,
          type: 'error',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      })
      .finally(() => setLoading(false));
  }, [noticeStore]);

  return (
    <AppBottomSheet
      contentContainerStyle={tw`flex flex-col items-stretch gap-4 px-6 py-4`}
      style={style}
      onClose={onClose}
      {...(Platform.OS === 'android' && { animationConfigs: { duration: 300 } })}>
      <KeysPairAnimation loop={false} style={tw`w-full h-[144px]`} />
      <Text
        style={tw`text-center text-xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {t('onPremise.keyBox.label')}
      </Text>
      <ReadMore
        numberOfLines={2}
        renderRevealedFooter={(handlePress) => (
          <Text style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
            {t('actions.hide')}
          </Text>
        )}
        renderTruncatedFooter={(handlePress) => (
          <Text style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
            {t('actions.readMore')}
          </Text>
        )}>
        <Text style={tw`text-left text-base font-normal text-slate-500`}>
          {t('onPremise.keyBox.description')}
        </Text>
      </ReadMore>

      {code ? (
        <Animated.Text
          entering={FadeIn.delay(100)}
          style={tw`h-14 mt-2 text-center text-slate-900 dark:text-gray-200 text-5xl font-bold tracking-widest leading-[3.5rem]`}>
          <RandomReveal
            isPlaying
            characters={`${code}`}
            characterSet={Array.from({ length: 10 }, (_, index) => index.toString())}
            duration={2}
          />
        </Animated.Text>
      ) : (
        <Animated.View exiting={FadeOutDown} style={tw`w-full`}>
          <AppRoundedButton
            disabled={!user?.capabilities.includes('KEYS_ACCESS')}
            loading={isLoading}
            style={tw`mt-2`}
            onPress={onFetchCode}>
            <Text style={tw`text-base font-medium`}>{t('onPremise.keyBox.fetch')}</Text>
          </AppRoundedButton>
        </Animated.View>
      )}
      {!user?.capabilities.includes('KEYS_ACCESS') && (
        <View style={tw`flex flex-row items-start flex-gap-2 mt-3 overflow-hidden`}>
          <MaterialCommunityIcons
            color={tw.color('yellow-500')}
            iconStyle={tw`h-6 w-6 mr-0`}
            name="alert"
            size={24}
            style={tw`shrink-0 grow-0`}
          />
          <Text style={tw`text-base font-normal text-slate-500 shrink grow basis-0`}>
            {t('onPremise.keyBox.missingCapability')}
          </Text>
        </View>
      )}
    </AppBottomSheet>
  );
};

export default KeyBoxBottomSheet;
