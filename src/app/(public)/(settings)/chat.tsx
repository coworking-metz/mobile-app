import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { WebViewError } from 'react-native-webview/lib/WebViewTypes';
import tw, { useDeviceContext } from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppBlurView from '@/components/AppBlurView';
import ErrorState from '@/components/ErrorState';
import { theme } from '@/helpers/colors';
import { useAppPaddingBottom } from '@/helpers/screen';
import { SYSTEM_LANGUAGE } from '@/i18n';
import useAuthStore from '@/stores/auth';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const BREVO_CONVERSATIONS_ID = '65324d6bf96d92531b4091f8';
const BREVO_CONVERSATIONS_WIDGET_URL = `https://conversations-widget.brevo.com/brevo-conversations.js`;

const Chat = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<WebViewError | null>(null);
  const authStore = useAuthStore();
  const router = useRouter();
  const settingsStore = useSettingsStore();
  const paddingBottom = useAppPaddingBottom();

  const language = useMemo(() => {
    if (settingsStore.language === SYSTEM_OPTION) {
      return SYSTEM_LANGUAGE;
    }
    return settingsStore.language;
  }, [settingsStore]);

  const htmlContent = useMemo(
    () => `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Brevo Chat</title>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">

          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
          </style>
          <script>
            window.BrevoConversationsSetup = {
              disableChatOpenHash: true,
              language: '${language}',
              mode: 'frame',
              injectTo: 'conversations-wrapper',
            };
            window.BrevoConversationsID = '${BREVO_CONVERSATIONS_ID}';

            var script = document.createElement('script');
            script.async = true;
            script.src = '${BREVO_CONVERSATIONS_WIDGET_URL}';
            script.addEventListener('load', () => {
                BrevoConversations('updateIntegrationData', {
                  email: '${authStore.user?.email || ''}',
                  name: '${authStore.user?.name || ''}',
                });
                setTimeout(() => {
                  window.ReactNativeWebView.postMessage('ready');
                }, 1000);
            })
            if (document.head) document.head.appendChild(script);
          </script>
        </head>
        <body id="conversations-wrapper"></body>
      </html>
    `,
    [authStore, language],
  );

  return (
    <View
      style={tw.style(`flex flex-col h-full w-full relative bg-white`, {
        paddingTop: Platform.OS === 'ios' ? 0 : insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom,
      })}>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      {Platform.OS !== 'ios' && <StatusBar translucent style="dark" />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'translate-with-padding' : 'height'}
        keyboardVerticalOffset={paddingBottom + 16}
        style={tw`grow w-full`}>
        <WebView
          domStorageEnabled={true}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={tw`h-full w-full`}
          onError={(e) => {
            setError(e.nativeEvent);
            setLoading(false);
          }}
          onLoadStart={() => setLoading(true)}
          onMessage={(event) => {
            if (event.nativeEvent.data === 'ready') {
              setLoading(false);
            }
          }}
        />
      </KeyboardAvoidingView>

      {isLoading ? (
        <Animated.View
          exiting={FadeOut.duration(500)}
          style={tw`absolute z-10 bg-white flex flex-row items-center justify-center h-full w-full`}>
          <HorizontalLoadingAnimation color={tw.color(`slate-900`)} style={tw`h-16 w-16`} />
        </Animated.View>
      ) : error ? (
        <Animated.View
          exiting={FadeOut.duration(500)}
          style={tw`absolute z-10 bg-white flex flex-row items-center justify-center h-full w-full`}>
          <ErrorState error={new Error(error.description)} title={t('chat.onError.title')} />
        </Animated.View>
      ) : null}
      <View
        style={tw.style(
          `absolute z-10 mr-4 rounded-full overflow-hidden`,
          {
            right: insets.right,
          },
          Platform.OS === 'ios' ? tw`mt-3` : { top: insets.top + 4 },
        )}>
        <AppBlurView intensity={64} style={tw`absolute h-full w-full`} tint={'light'} />
        <MaterialCommunityIcons.Button
          aria-label={t('actions.close')}
          backgroundColor="transparent"
          borderRadius={24}
          color={theme.charlestonGreen}
          iconStyle={tw`mr-0`}
          name="close"
          size={32}
          style={tw`p-1 grow-0 shrink-0`}
          underlayColor={tw.color('gray-200')}
          onPress={() => (router.canDismiss() ? router.dismiss() : router.navigate('/home'))}
        />
      </View>
    </View>
  );
};

export default Chat;
