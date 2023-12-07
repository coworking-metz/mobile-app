import HorizontalLoadingAnimation from '../Animations/HorizontalLoadingAnimation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, useState, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { parseErrorText } from '@/helpers/error';
import { unlockOpenSpaceDoor } from '@/services/api/services';
import useNoticeStore from '@/stores/notice';
import useToastStore from '@/stores/toast';

const WARN_ON_SUCCESSIVE_TAPS_COUNT = 3;
const WARN_ON_SUCCESSIVE_TAPS_PERIOD_IN_MS = 20_000;
const WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS = 60_000; // wait for 60 seconds before warning again

const UnlockCard: ForwardRefRenderFunction<
  TouchableOpacity,
  {
    children?: ReactNode;
    disabled?: boolean;
    style?: StyleProps;
    onUnlocked: (locked: string) => void;
  }
> = ({ children, disabled = false, style, onUnlocked }, ref) => {
  const { t } = useTranslation();
  const noticeStore = useNoticeStore();
  const toastStore = useToastStore();
  const [isLoading, setLoading] = useState(false);
  const [tapHistory, setTapHistory] = useState<string[]>([]);
  const [lastWarning, setLastWarning] = useState<string | null>(null);

  const onUnlock = () => {
    if (isLoading) return;
    if (
      !lastWarning ||
      Date.now() - Date.parse(lastWarning) > WARN_ON_SUCCESSIVE_TAPS_INTEVAL_IN_MS
    ) {
      setTapHistory([...tapHistory, new Date().toISOString()]);
    }
    setLoading(true);
    unlockOpenSpaceDoor()
      .then(({ locked }) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onUnlocked(locked);
      })
      .catch(async (error) => {
        const description = await parseErrorText(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        noticeStore.add({
          message: t('home.openSpace.door.onFail.message'),
          description,
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // TODO: enable the following code once Help section is ready
  /*
  useEffect(() => {
    const recentTaps = [...tapHistory]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, WARN_ON_SUCCESSIVE_TAPS_COUNT);
    if (recentTaps.length === WARN_ON_SUCCESSIVE_TAPS_COUNT) {
      const [mostRecentTap] = recentTaps;
      const oldestTap = recentTaps.pop() || mostRecentTap;
      const isTappingSuccessively =
        new Date(mostRecentTap).getTime() - new Date(oldestTap).getTime() <
        WARN_ON_SUCCESSIVE_TAPS_PERIOD_IN_MS;

      if (isTappingSuccessively) {
        const toast = toastStore.add({
          message: t('home.intercom.onSuccessiveTaps.message'),
          type: ToastPresets.GENERAL,
          action: {
            label: t('home.intercom.onSuccessiveTaps.action'),
            onPress: () => {
              router.push('/help/gate');
              toastStore.dismiss(toast.id);
            },
          },
        });
        setLastWarning(new Date().toISOString());
      }
    }
  }, [tapHistory]);
  */

  return (
    <TouchableOpacity
      ref={ref}
      disabled={disabled}
      style={[
        tw`flex flex-row items-center gap-3 px-3 rounded-2xl min-h-18 overflow-hidden relative bg-gray-200 dark:bg-gray-900`,
        style,
      ]}
      onPress={onUnlock}>
      <Animated.View style={tw`bg-gray-300 dark:bg-gray-700 rounded-full p-2 z-20`}>
        <View style={[tw`relative h-8 w-8 shrink-0`]}>
          {isLoading && (
            <HorizontalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
            />
          )}
          <MaterialCommunityIcons
            color={tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
            iconStyle={{ height: 32, width: 32, marginRight: 0 }}
            name="door"
            size={32}
            style={[tw`shrink-0`, disabled && tw`opacity-40`, isLoading && { opacity: 0 }]}
          />
        </View>
      </Animated.View>
      <Animated.View style={tw`flex flex-col z-20 w-full`}>
        <Text
          style={[
            tw`text-xl font-medium text-slate-900 dark:text-gray-200`,
            disabled && tw`opacity-30`,
          ]}>
          {t('home.openSpace.door.label')}
        </Text>
        <View style={[tw`flex flex-row items-center gap-1`]}>
          {isLoading ? (
            <Text
              style={[
                tw`flex flex-row items-center text-base text-slate-500 dark:text-slate-400 grow`,
                disabled && tw`opacity-30`,
              ]}>
              {t('home.openSpace.door.loading')}
            </Text>
          ) : (
            <Text
              style={[
                tw`flex flex-row items-center text-base text-slate-500 dark:text-slate-400 grow`,
                disabled && tw`opacity-30`,
              ]}>
              {t('home.openSpace.door.description')}
            </Text>
          )}
        </View>
      </Animated.View>

      <>{children}</>
    </TouchableOpacity>
  );
};

export default forwardRef(UnlockCard);
