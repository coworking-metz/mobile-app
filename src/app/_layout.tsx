import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { PostHogProvider } from 'posthog-react-native';
import { useEffect, useLayoutEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import NoticeBottomSheet from '@/components/NoticeBottomSheet';
import ToastMessage from '@/components/ToastMessage';
import { AuthProvider } from '@/context/auth';
import { ContactProvider } from '@/context/contact';
import { I18nProvider } from '@/context/i18n';
import { NewDeviceProvider } from '@/context/new-device';
import { PermissionsProvider } from '@/context/permissions';
import { PresenceProvider } from '@/context/presence';
import { ReviewProvider } from '@/context/review';
import { SocialsProvider } from '@/context/socials';
import { ThemeProvider } from '@/context/theme';
import { IS_DEV } from '@/services/environment';
import { HTTP } from '@/services/http';
import createHttpInterceptors from '@/services/interceptors';
import { navigationIntegration } from '@/services/sentry';
import { AppThemeBackground } from '@/services/theme';
import '@/i18n';

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

if (Platform.OS === 'android') {
  // enables edge-to-edge mode
  NavigationBar.setPositionAsync('absolute');
  // transparent backgrounds to see through
  NavigationBar.setBackgroundColorAsync('#ffffff01');
  // to avoid white flash when navigating https://www.reddit.com/r/reactnative/comments/1f7eknt/comment/ll9w39k/
  SystemUI.setBackgroundColorAsync('black');
}

const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  // initialRouteName: 'index',
};

const RootLayout = () => {
  useDeviceContext(tw);

  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef();

  useLayoutEffect(() => {
    createHttpInterceptors(HTTP);
  }, []);

  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <GestureHandlerRootView style={tw`h-screen w-screen flex-1`}>
      <KeyboardProvider navigationBarTranslucent statusBarTranslucent>
        <SafeAreaProvider>
          <PostHogProvider
            autocapture
            apiKey={POSTHOG_API_KEY}
            options={{
              disabled: IS_DEV,
              host: 'https://eu.i.posthog.com',
              // Enable session recording. Requires enabling in your project settings as well.
              // Default is false.
              enableSessionReplay: true,
              sessionReplayConfig: {
                // Whether text and text input fields are masked. Default is true.
                // Password inputs are always masked regardless
                maskAllTextInputs: false,
                // Whether images are masked. Default is true.
                maskAllImages: false,
                // Enable masking of all sandboxed system views like UIImagePickerController, PHPickerViewController and CNContactPickerViewController. Default is true.
                // iOS only
                maskAllSandboxedViews: true,
                // Capture logs automatically. Default is true.
                // Android only (Native Logcat only)
                captureLog: true,
                // Whether network requests are captured in recordings. Default is true
                // Only metric-like data like speed, size, and response code are captured.
                // No data is captured from the request or response body.
                // iOS only
                captureNetworkTelemetry: true,
                // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 1000ms
                // Ps: it was 500ms (0.5s) by default until version 3.3.7
                androidDebouncerDelayMs: 1000,
                // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 1000ms
                iOSdebouncerDelayMs: 1000,
              },
            }}>
            <I18nProvider>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <ContactProvider>
                    <PermissionsProvider>
                      <ReviewProvider>
                        <ThemeProvider>
                          <SocialsProvider>
                            <NewDeviceProvider>
                              <PresenceProvider>
                                <Stack
                                  screenOptions={{
                                    headerShown: false,
                                    contentStyle: {
                                      backgroundColor: 'transparent',
                                    },
                                    navigationBarTranslucent: true,
                                  }}>
                                  <Stack.Screen
                                    name="index"
                                    options={{
                                      animationTypeForReplace: 'pop',
                                      animation: 'fade',
                                      contentStyle: {
                                        backgroundColor: 'transparent',
                                      },
                                    }}
                                  />
                                  <Stack.Screen
                                    name="[...missing]"
                                    options={{
                                      headerShown: false,
                                    }}
                                  />

                                  <Stack.Screen
                                    name="(public)/onboarding"
                                    options={{
                                      headerShown: false,
                                      animation: 'slide_from_bottom',
                                    }}
                                  />

                                  <Stack.Screen
                                    name="(public)/home"
                                    options={{
                                      headerShown: false,
                                      animationTypeForReplace: 'pop',
                                    }}
                                  />

                                  <Stack.Screen
                                    name="(public)/on-premise"
                                    options={{
                                      headerShown: false,
                                    }}
                                  />
                                  <Stack.Screen
                                    name="(public)/attendance"
                                    options={{
                                      headerShown: false,
                                    }}
                                  />

                                  <Stack.Screen
                                    name="(public)/events"
                                    options={{
                                      headerShown: false,
                                    }}
                                  />
                                </Stack>
                              </PresenceProvider>
                            </NewDeviceProvider>
                          </SocialsProvider>
                        </ThemeProvider>

                        <ToastMessage />
                        <NoticeBottomSheet />
                        {Platform.OS === 'android' ? (
                          <AppThemeBackground
                            dark={tw.color('black') as string}
                            light={tw.color('transparent') as string}
                          />
                        ) : null}
                        <StatusBar translucent />
                      </ReviewProvider>
                    </PermissionsProvider>
                  </ContactProvider>
                </AuthProvider>
              </QueryClientProvider>
            </I18nProvider>
          </PostHogProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(RootLayout);
