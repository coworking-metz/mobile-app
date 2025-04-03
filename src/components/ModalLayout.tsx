import AppBlurView from './AppBlurView';
import AppText from './AppText';
import LoadingSkeleton from './LoadingSkeleton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useMemo, type ReactNode } from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { theme } from '@/helpers/colors';

const MAX_HEADER_HEIGHT = 144;
const MIN_HEADER_HEIGHT = Platform.OS === 'ios' ? 64 : 56;
const INTERPOLATE_INPUT_RANGE = [
  -1,
  0,
  MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT,
  MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT,
];

const TITLE_LEFT_ORIGIN = 24;
const TITLE_LEFT_DESTINATION = 64;
const TITLE_RIGHT_ORIGIN = 24;
const TITLE_RIGHT_DESTINATION = 56;

const ModalLayout = ({
  title,
  from,
  loading = false,
  children,
  footer,
  contentStyle,
}: {
  title?: string;
  from?: string;
  loading?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const verticalScrollProgress = useSharedValue(0);

  const onVerticalScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      verticalScrollProgress.value = contentOffset.y;
    },
  });

  const maxHeaderHeight = useMemo(() => {
    return MAX_HEADER_HEIGHT + (Platform.OS === 'android' ? insets.top : 0);
  }, [insets]);

  const minHeaderHeight = useMemo(() => {
    return MIN_HEADER_HEIGHT + (Platform.OS === 'android' ? insets.top : 0);
  }, [insets]);

  const canGoBack = useMemo(() => {
    return !!navigation.getState()?.index && Number(navigation.getState()?.index) > 0;
  }, [navigation]);

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT_RANGE, [
      maxHeaderHeight + 1,
      maxHeaderHeight,
      minHeaderHeight,
      minHeaderHeight,
    ]);

    return {
      height,
    };
  }, [verticalScrollProgress, insets]);

  const headerBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      verticalScrollProgress.value,
      INTERPOLATE_INPUT_RANGE,
      [0, 0, 1, 1],
    );

    return {
      opacity,
    };
  }, [verticalScrollProgress, insets]);

  const titleStyle = useAnimatedStyle(() => {
    const marginLeft = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT_RANGE, [
      TITLE_LEFT_ORIGIN,
      TITLE_LEFT_ORIGIN,
      from ? TITLE_LEFT_DESTINATION : TITLE_LEFT_ORIGIN,
      from ? TITLE_LEFT_DESTINATION : TITLE_LEFT_ORIGIN,
    ]);

    const marginRight = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT_RANGE, [
      TITLE_RIGHT_ORIGIN,
      TITLE_RIGHT_ORIGIN,
      TITLE_RIGHT_DESTINATION,
      TITLE_RIGHT_DESTINATION,
    ]);

    return {
      marginLeft,
      marginRight,
    };
  }, [verticalScrollProgress, insets, from]);

  const titleTextStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      verticalScrollProgress.value,
      INTERPOLATE_INPUT_RANGE,
      [24, 24, 16, 16],
      Extrapolation.CLAMP,
    );

    return {
      fontSize,
    };
  }, [verticalScrollProgress, insets, from]);

  return (
    <Animated.View style={tw`bg-gray-100 dark:bg-black`}>
      <Animated.ScrollView
        contentContainerStyle={[
          tw`flex flex-col grow`,
          {
            paddingTop: maxHeaderHeight,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom + 16,
          },
          contentStyle,
        ]}
        horizontal={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={tw`w-full h-full`}
        onScroll={onVerticalScroll}>
        {children}
      </Animated.ScrollView>

      <Animated.View
        style={[
          tw`absolute flex flex-row justify-between items-start w-full pt-3`,
          {
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
          headerStyle,
        ]}>
        <Animated.View
          style={[
            tw`absolute top-0 left-0 bottom-0 right-0 border-b-gray-300 dark:border-b-gray-700 border-b-[0.5px]`,
            headerBackgroundStyle,
          ]}>
          <AppBlurView
            intensity={64}
            style={tw`h-full w-full`}
            tint={tw.prefixMatch('dark') ? 'dark' : 'default'}
          />
        </Animated.View>

        <View
          style={[
            tw`ml-4 mt-3 absolute z-10`,
            { left: insets.left },
            Platform.OS === 'android' && { top: insets.top, marginTop: 4 },
          ]}>
          {from ? (
            <MaterialCommunityIcons.Button
              backgroundColor="transparent"
              borderRadius={24}
              color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
              iconStyle={{ height: 32, width: 32, marginRight: 0 }}
              name="arrow-left"
              size={32}
              style={tw`p-1 shrink-0`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
              onPress={() => (canGoBack ? router.back() : router.replace(from))}
            />
          ) : (
            <></>
          )}
        </View>
        <Animated.View
          entering={FadeInDown.duration(300).delay(150)}
          style={[tw`grow basis-0 mb-4 self-end`, !from && tw`ml-6`, titleStyle]}>
          {loading ? (
            <LoadingSkeleton height={28} width={144} />
          ) : (
            <AppText
              numberOfLines={1}
              style={[
                tw`text-2xl font-semibold tracking-tight text-slate-900 dark:text-gray-200 `,
                titleTextStyle,
              ]}>
              {title}
            </AppText>
          )}
        </Animated.View>
        <Animated.View
          entering={FadeInDown.duration(300).delay(150)}
          style={[tw`grow-0 shrink-0 mr-4`]}>
          <MaterialCommunityIcons.Button
            backgroundColor="transparent"
            borderRadius={24}
            color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
            iconStyle={{ height: 32, width: 32, marginRight: 0 }}
            name="close"
            size={32}
            style={tw`p-1`}
            underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
            onPress={() => (router.canDismiss() ? router.dismiss() : router.navigate('/home'))}
          />
        </Animated.View>
      </Animated.View>

      {footer}
    </Animated.View>
  );
};

export default ModalLayout;
