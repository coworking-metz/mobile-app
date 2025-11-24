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
import AppIconButton from '@/components/AppIconButton';
import ErrorState from '@/components/ErrorState';
import { theme } from '@/helpers/colors';
import { useAppPaddingBottom } from '@/helpers/screen';
import { SYSTEM_LANGUAGE } from '@/i18n';
import { SUPPORT_EMAIL } from '@/services/environment';
import useAuthStore from '@/stores/auth';
import useSettingsStore, { SYSTEM_OPTION } from '@/stores/settings';

const BREVO_CONVERSATIONS_ID = '65324d6bf96d92531b4091f8';
const BREVO_CONVERSATIONS_WIDGET_URL = `https://conversations-widget.brevo.com/brevo-conversations.js`;
const BREVO_READY_MESSAGE = 'brevo_conversations_ready';

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
          <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;">

          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
          </style>
          <script defer>
            window.BrevoConversationsSetup = {
              disableChatOpenHash: true,
              language: '${language}',
              mode: 'frame',
              injectTo: 'conversations-wrapper',
            };
            window.BrevoConversationsID = '${BREVO_CONVERSATIONS_ID}';

            var script = document.createElement('script');
            script.async = true;
            script.type = 'text/javascript';
            script.defer = true;
            script.crossorigin = 'anonymous';
            script.src = '${BREVO_CONVERSATIONS_WIDGET_URL}';
            script.onload = function () {
              BrevoConversations('updateIntegrationData', {
                email: '${authStore.user?.email || ''}',
                name: '${authStore.user?.name || ''}',
              });
              setTimeout(() => {
                window.ReactNativeWebView?.postMessage('${BREVO_READY_MESSAGE}');
              }, 1000);
            };
            document.head.appendChild(script);
          </script>
        </head>
        <body id="conversations-wrapper">
          <div style="width: 100%; height: 100%; display: flex;">
            <p style="text-align: center; white-space: pre-line; max-width: 320px; margin: auto;">
              ${t('settings.support.contact.conversations.onFetchBrevoWidget.fail', { email: `<a href="mailto:${SUPPORT_EMAIL}" style="display: block; text-decoration: none; color: ${theme.miramonYellow};"><strong>${SUPPORT_EMAIL}</strong></a>` })}
            </p>
          </div>
        </body>
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
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          androidLayerType="hardware"
          domStorageEnabled={true}
          javaScriptEnabled={true}
          mixedContentMode="always"
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={tw`h-full w-full`}
          onError={(e) => {
            setError(e.nativeEvent);
            setLoading(false);
          }}
          onLoadStart={() => setLoading(true)}
          onMessage={(event) => {
            if (event.nativeEvent.data === BREVO_READY_MESSAGE) {
              setLoading(false);
            } else {
              console.log('WebView message:', event.nativeEvent.data);
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

      <AppIconButton
        colorScheme="light"
        icon="window-close"
        style={tw.style(
          `absolute z-20 mr-4`,
          { right: insets.right },
          Platform.OS === 'ios' ? tw`mt-3` : { top: insets.top + 4 },
        )}
        onPress={() => (router.canDismiss() ? router.dismiss() : router.navigate('/home'))}
      />
    </View>
  );
};

export default Chat;
