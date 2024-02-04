import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  type StyleProps,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { ToastPresets } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import UnlockDeckDoorBottomSheet from '@/components/Home/UnlockDeckDoorBottomSheet';
import ServiceLayout from '@/components/Settings/ServiceLayout';
import { theme } from '@/helpers/colors';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import {
  turnOffFan,
  turnOffLight,
  turnOnFan,
  turnOnLight,
  unlockDeckDoor,
} from '@/services/api/services';
import useToastStore from '@/stores/toast';

const ActionableIcon = ({
  activeIcon,
  inactiveIcon,
  active = false,
  disabled = false,
  loading,
  onPress,
  style,
  iconStyle,
}: {
  activeIcon: keyof typeof mdiGlyphMap;
  inactiveIcon: keyof typeof mdiGlyphMap;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProps;
  iconStyle?: StyleProps;
}) => {
  return (
    <Animated.View
      style={[
        tw`absolute z-10 h-12 w-12 rounded-full p-2`,
        active ? { backgroundColor: theme.meatBrown } : tw`bg-gray-200 dark:bg-gray-800`,
        style,
      ]}>
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        {loading && (
          <HorizontalLoadingAnimation
            color={!active && tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('gray-700')}
          />
        )}
        <Animated.View style={iconStyle}>
          <MaterialCommunityIcons
            backgroundColor="transparent"
            borderRadius={24}
            color={active ? theme.charlestonGreen : tw.color('gray-500')}
            iconStyle={{ marginRight: 0 }}
            name={active ? activeIcon : inactiveIcon}
            size={32}
            style={[tw`shrink-0`, disabled && tw`opacity-70`, loading && tw`opacity-0`]}
            underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ActionableLight = ({
  id,
  active = false,
  style,
}: {
  id: string;
  active?: boolean;
  style?: StyleProps;
}) => {
  const toastStore = useToastStore();
  const [isActive, setActive] = useState(active);
  const [isLoading, setLoading] = useState(false);

  const xTranslation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xTranslation.value }],
  }));

  const toggle = useCallback(() => {
    setLoading(true);
    toastStore.dismissAll();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    (isActive ? turnOffLight(id) : turnOnLight(id))
      .then(({ state }) => setActive(state === 'on'))
      .catch(handleSilentError)
      .catch(async (error) => {
        const errorMessage = await parseErrorText(error);
        toastStore.add({
          message: errorMessage,
          type: ToastPresets.FAILURE,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        xTranslation.value = withSequence(
          withTiming(-1, { duration: 100 / 2 }),
          withRepeat(withTiming(1, { duration: 100 }), 5, true),
          withTiming(0, { duration: 100 / 2 }),
        );
      })
      .finally(() => setLoading(false));
  }, [id, active, isActive]);

  return (
    <ActionableIcon
      active={isActive}
      activeIcon="ceiling-light"
      iconStyle={animatedStyle}
      inactiveIcon="ceiling-light-outline"
      loading={isLoading}
      style={style}
      onPress={toggle}
    />
  );
};

const ActionableFan = ({
  id,
  active = false,
  style,
}: {
  id: string;
  active?: boolean;
  style?: StyleProps;
}) => {
  const toastStore = useToastStore();
  const [isActive, setActive] = useState(active);
  const [isLoading, setLoading] = useState(false);

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }),
    [rotation],
  );

  useEffect(() => {
    if (isActive) {
      cancelAnimation(rotation);
      rotation.value = 0;
      rotation.value = withSequence(
        withTiming(180, {
          easing: Easing.in(Easing.ease),
          duration: 1200,
        }),
        withRepeat(
          withTiming(360, {
            easing: Easing.linear,
            duration: 600,
          }),
          Infinity,
        ),
      );
    } else if (rotation.value > 0) {
      cancelAnimation(rotation);
      rotation.value = 0;
      rotation.value = withTiming(360, {
        easing: Easing.out(Easing.ease),
        duration: 2000,
      });
    }
  }, [isActive]);

  const toggle = useCallback(() => {
    setLoading(true);
    toastStore.dismissAll();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    (isActive ? turnOffFan(id) : turnOnFan(id))
      .then(({ state }) => setActive(state === 'on'))
      .catch(handleSilentError)
      .catch(async (error) => {
        const errorMessage = await parseErrorText(error);
        toastStore.add({
          message: errorMessage,
          type: ToastPresets.FAILURE,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      })
      .finally(() => setLoading(false));
  }, [id, active, isActive]);

  return (
    <ActionableIcon
      active={isActive}
      activeIcon="fan"
      iconStyle={animatedStyle}
      inactiveIcon="fan"
      loading={isLoading}
      style={style}
      onPress={toggle}
    />
  );
};

const ActionableDeckDoor = ({
  active = false,
  style,
  onUnlock,
}: {
  active?: boolean;
  style?: StyleProps;
  onUnlock?: () => void;
}) => {
  const toastStore = useToastStore();
  const [isUnlocked, setUnlocked] = useState(active);
  const [isLoading, setLoading] = useState(false);

  const unlock = useCallback(() => {
    onUnlock?.();
    // setLoading(true);
    // toastStore.dismissAll();
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // unlockDeckDoor()
    //   .then(() => {
    //     setUnlocked(true);
    //     onUnlock?.();
    //   })
    //   .catch(handleSilentError)
    //   .catch(async (error) => {
    //     const errorMessage = await parseErrorText(error);
    //     toastStore.add({
    //       message: errorMessage,
    //       type: ToastPresets.FAILURE,
    //     });
    //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    //   })
    //   .finally(() => setLoading(false));
  }, []);

  return (
    <ActionableIcon
      active={isUnlocked}
      activeIcon="lock-open"
      inactiveIcon="lock"
      loading={isLoading}
      style={style}
      onPress={unlock}
    />
  );
};

const Controls = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const [hasFloorplanLoaded, setFloorplanLoaded] = useState<boolean>(false);
  const [hasUnlockInsideDoor, setUnlockInsideDoor] = useState<boolean>(false);

  return (
    <>
      <ServiceLayout contentStyle={tw`bg-transparent`} title={t('controls.title')}>
        <View style={[tw`flex flex-col grow items-center justify-center w-full relative`]}>
          <Image
            blurRadius={!hasFloorplanLoaded ? 16 : 0}
            source={
              tw.prefixMatch('dark')
                ? require('@/assets/images/floorplan-night.png')
                : require('@/assets/images/floorplan-day.png')
            }
            style={[tw`w-full`, { aspectRatio: 750 / 1334 }]}
            onLoadEnd={() => setFloorplanLoaded(true)}
          />

          {!hasFloorplanLoaded ? (
            <VerticalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
              style={tw`absolute h-16 z-10 my-auto bg-gray-200 dark:bg-black rounded-full`}
            />
          ) : (
            <>
              {/* Lights */}
              <ActionableLight id="1" style={tw`top-[19%] left-[21%]`} />
              <ActionableLight active id="2" style={tw`top-[19%] left-[49%]`} />
              <ActionableLight id="3" style={tw`top-[19%] left-[67%]`} />
              <ActionableLight id="4" style={tw`top-[36%] left-[49%]`} />
              <ActionableLight id="5" style={tw`top-[36%] left-[67%]`} />
              <ActionableLight id="6" style={tw`top-[31%] left-[21%]`} />
              <ActionableLight id="7" style={tw`top-[42%] left-[21%]`} />
              <ActionableLight active id="8" style={tw`top-[42%] left-[21%]`} />
              <ActionableLight id="9" style={tw`top-[58%] left-[25%]`} />
              <ActionableLight id="10" style={tw`top-[70%] left-[25%]`} />

              {/* Door */}
              <ActionableDeckDoor
                active={false}
                style={tw`top-[46%] left-[78%]`}
                onUnlock={() => setUnlockInsideDoor(true)}
              />

              {/* Fans */}
              <ActionableFan active id="1" style={tw`top-[16%] left-[5%]`} />
              <ActionableFan id="2" style={tw`top-[43%] left-[5%]`} />

              {/* TV */}
              <ActionableIcon
                disabled
                active={false}
                activeIcon="volume-high"
                inactiveIcon="volume-off"
                style={tw`top-[72%] left-[68%]`}
              />
            </>
          )}
        </View>
      </ServiceLayout>

      {hasUnlockInsideDoor ? (
        <UnlockDeckDoorBottomSheet onClose={() => setUnlockInsideDoor(false)} />
      ) : null}
    </>
  );
};

export default Controls;
