import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableNativeFeedback, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  FadeInLeft,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastPresets } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import ProfilePicture from '@/components/Home/ProfilePicture';
import AppFooter from '@/components/Settings/AppFooter';
import LanguageBottomSheet from '@/components/Settings/LanguageBottomSheet';
import PresenceGraph from '@/components/Settings/PresenceGraph';
import ServiceRow from '@/components/Settings/ServiceRow';
import ThemeBottomSheet from '@/components/Settings/ThemeBottomSheet';
import ThemePicker from '@/components/Settings/ThemePicker';
import { theme } from '@/helpers/colors';
import { handleSilentError, parseErrorText } from '@/helpers/error';
import { getLanguageLabel, SYSTEM_LANGUAGE } from '@/i18n';
import useAuthStore from '@/stores/auth';
import useNoticeStore from '@/stores/notice';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';
import useToastStore from '@/stores/toast';
import useUserStore from '@/stores/user';

const NAVIGATION_HEIGHT = 48;
const HEADER_HEIGHT = 192;
const INTERPOLATE_INPUT = [-1, 0, HEADER_HEIGHT, HEADER_HEIGHT];
const IS_PROD = Constants.releaseChannel === 'production';

const Settings = () => {
  useDeviceContext(tw);
  const toastStore = useToastStore();
  const noticeStore = useNoticeStore();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const chosenLanguage = useSettingsStore((state) => state.language);
  const verticalScrollProgress = useSharedValue(0);
  const [isPickingLanguage, setPickingLanguage] = useState(false);
  const [isPickingTheme, setPickingTheme] = useState(false);
  const [isContactingTeam, setContactingTeam] = useState(false);

  /* this is a hell of a hack */
  const [footerHeight, setFooterHeight] = useState(0);
  const [footerWidth, setFooterWidth] = useState(0);

  const onContactTeam = useCallback(() => {
    setContactingTeam(true);
    Linking.openURL('mailto:contact@coworking-metz.fr')
      .catch(async (error) => {
        const description = await parseErrorText(error);
        noticeStore.add({
          message: t('settings.support.contact.onFail.message'),
          description,
          type: 'error',
        });
      })
      .finally(() => setContactingTeam(false));
  }, []);

  const onVerticalScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      verticalScrollProgress.value = contentOffset.y;
    },
  });

  const navigationBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      verticalScrollProgress.value,
      [-1, 0, HEADER_HEIGHT - 16, HEADER_HEIGHT],
      [0, 0, 0, 1],
    );

    return {
      opacity,
    };
  }, [verticalScrollProgress, insets]);

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT, [1, 1, 0, 0]);
    const scale = interpolate(verticalScrollProgress.value, INTERPOLATE_INPUT, [1, 1, 0.9]);

    return {
      opacity,
      transform: [{ scale }],
    };
  }, [verticalScrollProgress]);

  useEffect(() => {
    if (!userStore.presenceTimeline.length) {
      userStore
        .fetchPresenceTimeline()
        .catch(handleSilentError)
        .catch(async (error) => {
          const errorMessage = await parseErrorText(error);
          const toast = toastStore.add({
            message: t('settings.profile.presence.onFail.message'),
            type: ToastPresets.FAILURE,
            action: {
              label: t('actions.more'),
              onPress: () => {
                noticeStore.add({
                  message: t('settings.profile.presence.onFail.message'),
                  description: errorMessage,
                  type: 'error',
                });
                toastStore.dismiss(toast.id);
              },
            },
          });
        });
    }
  }, []);

  return (
    <View style={[{ flex: 1 }, tw`bg-gray-100 dark:bg-black`]}>
      <View style={tw`flex flex-col grow relative`}>
        <Animated.View
          style={[
            tw`absolute flex flex-col items-start gap-4 pb-6`,
            {
              top: NAVIGATION_HEIGHT + insets.top,
              left: insets.left,
              right: insets.right,
            },
            headerStyle,
          ]}>
          <View style={tw`flex flex-col items-start gap-4 px-4`}>
            <ProfilePicture style={tw`h-24 w-24`} />

            <View style={tw`flex flex-col ml-2`}>
              <Animated.Text
                entering={FadeInLeft.duration(500)}
                numberOfLines={1}
                style={tw`text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
                {authStore.user?.name}
              </Animated.Text>
              <Animated.Text
                entering={FadeInLeft.duration(500).delay(150)}
                style={tw`text-xl text-slate-500 dark:text-slate-400`}>
                {authStore.user?.email}
              </Animated.Text>
            </View>
          </View>
        </Animated.View>

        {/* this is the footer below the scrollview */}
        <AppFooter
          style={[tw`absolute bottom-0 self-center py-6 px-3`, { marginBottom: insets.bottom }]}
          onLayout={({ nativeEvent }: LayoutChangeEvent) => {
            setFooterHeight(nativeEvent.layout.height);
            setFooterWidth(nativeEvent.layout.width);
          }}
        />

        <Animated.ScrollView
          contentContainerStyle={[
            tw`flex flex-col relative`,
            {
              paddingTop: NAVIGATION_HEIGHT + HEADER_HEIGHT + insets.top,
              paddingBottom: insets.bottom,
            },
          ]}
          horizontal={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={[{ flex: 1 }, tw`z-10 grow shrink`]}
          onScroll={onVerticalScroll}>
          <View
            style={[
              tw`flex flex-col w-full grow py-6 bg-gray-50 dark:bg-zinc-900`,
              {
                paddingLeft: insets.left,
                paddingRight: insets.right,
              },
            ]}>
            <Animated.Text
              entering={FadeInLeft.duration(300)}
              style={tw`text-sm uppercase text-slate-500 mx-6`}>
              {t('settings.profile.presence.title')}
            </Animated.Text>
            <PresenceGraph
              loading={userStore.isFetchingPresenceTimeline}
              timeline={userStore.presenceTimeline}
            />

            <Animated.Text
              entering={FadeInLeft.duration(300)}
              style={tw`text-sm uppercase text-slate-500 mx-6 mt-6`}>
              {t('settings.general.title')}
            </Animated.Text>
            {!IS_PROD ? (
              <Link asChild href="/advanced/">
                <ServiceRow
                  withBottomDivider
                  label={t('advanced.title')}
                  prefixIcon="cog-outline"
                  style={tw`px-3 mx-3`}
                  suffixIcon="chevron-right">
                  <View style={tw`bg-gray-300 dark:bg-gray-700 py-1 px-2 rounded`}>
                    <Text style={tw`text-xs text-slate-900 dark:text-gray-200 font-medium`}>
                      DEV
                    </Text>
                  </View>
                </ServiceRow>
              </Link>
            ) : (
              <></>
            )}
            <Link asChild href="/onboarding">
              <ServiceRow
                withBottomDivider
                label={t('settings.general.onboarding.label')}
                prefixIcon="handshake-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="chevron-right"
              />
            </Link>
            <ServiceRow
              withBottomDivider
              label={t('settings.general.language.label')}
              prefixIcon="web"
              style={tw`px-3 mx-3`}
              onPress={() => setPickingLanguage(true)}>
              <Text style={tw`text-base text-amber-500 grow text-right`}>
                {getLanguageLabel(
                  !chosenLanguage || chosenLanguage === SYSTEM_OPTION
                    ? SYSTEM_LANGUAGE
                    : chosenLanguage,
                )}
              </Text>
            </ServiceRow>
            <ThemePicker style={tw`px-3 mx-3`} onPress={() => setPickingTheme(true)} />

            <Animated.Text
              entering={FadeInLeft.duration(300)}
              style={tw`text-sm uppercase text-slate-500 mx-6 mt-6`}>
              {t('settings.support.title')}
            </Animated.Text>
            {/* <Link asChild href="/help">
              <ServiceRow
                withBottomDivider
                label={t('settings.support.help.label')}
                prefixIcon="help-circle-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="chevron-right"
              />
            </Link> */}
            <Link asChild href="https://www.coworking-metz.fr/mon-compte/">
              <ServiceRow
                withBottomDivider
                label={t('settings.support.account.label')}
                prefixIcon="account-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="open-in-new"
              />
            </Link>
            <Link asChild href="https://www.coworking-metz.fr/la-boutique/">
              <ServiceRow
                withBottomDivider
                label={t('settings.support.store.label')}
                prefixIcon="cart-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="open-in-new"
              />
            </Link>
            <Link
              asChild
              href="https://signal.group/#CjQKICGvCmD9n9SJSW6z_g5FmRg5rRUj4hWpC1X5XxOexGwrEhDxUfX0r6UQ_blpMGz938M9">
              <ServiceRow
                withBottomDivider
                label={t('settings.support.signal.label')}
                prefixIcon="chat-outline"
                style={tw`px-3 mx-3`}
                suffixIcon="open-in-new"
              />
            </Link>
            <ServiceRow
              label={t('settings.support.contact.label')}
              loading={isContactingTeam}
              prefixIcon="email-outline"
              style={tw`px-3 mx-3`}
              suffixIcon={null}
              onPress={onContactTeam}
            />

            <ServiceRow
              label={t('actions.logout')}
              prefixIcon="logout"
              style={tw`px-3 mx-3 mt-6`}
              onPress={() =>
                authStore.logout().then(() => {
                  toastStore.add({
                    message: t('auth.logout.onSuccess.message'),
                    type: ToastPresets.SUCCESS,
                    timeout: 3000,
                  });
                })
              }
            />
          </View>

          {/* transparent view to fake a touch on the footer link, should mimic as much as possible the footer */}
          <Link asChild href="/about">
            <TouchableNativeFeedback>
              <View style={[tw`self-center`, { height: footerHeight, width: footerWidth }]} />
            </TouchableNativeFeedback>
          </Link>
        </Animated.ScrollView>

        <Animated.View
          style={[
            tw`absolute top-0 left-0 right-0 z-10 flex flex-row pb-2`,
            {
              paddingTop: insets.top,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}>
          <Animated.View
            style={[
              tw`absolute top-0 left-0 bottom-0 right-0 border-b-gray-300 dark:border-b-gray-700 border-b-[0.5px]`,
              navigationBackgroundStyle,
            ]}>
            <BlurView
              intensity={64}
              style={tw`h-full w-full`}
              tint={tw.prefixMatch('dark') ? 'dark' : 'default'}
            />
          </Animated.View>
          <View style={tw`ml-4`}>
            <MaterialCommunityIcons.Button
              backgroundColor="transparent"
              borderRadius={24}
              color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
              iconStyle={{ marginRight: 0 }}
              name="arrow-left"
              size={32}
              style={tw`p-1 shrink-0`}
              underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            />
          </View>
        </Animated.View>
      </View>

      {isPickingLanguage && <LanguageBottomSheet onClose={() => setPickingLanguage(false)} />}
      {isPickingTheme && <ThemeBottomSheet onClose={() => setPickingTheme(false)} />}
    </View>
  );
};

export default Settings;
