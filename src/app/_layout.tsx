import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useLayoutEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import NoticeBottomSheet from '@/components/NoticeBottomSheet';
import ToastMessage from '@/components/ToastMessage';
import { AuthProvider } from '@/context/auth';
import { I18nProvider } from '@/context/i18n';
import { HTTP } from '@/services/http';
import createHttpInterceptors from '@/services/interceptors';
import { navigationIntegration } from '@/services/sentry';
import { AppThemeBackground } from '@/services/theme';
import '@/i18n';

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
      <SafeAreaProvider>
        <I18nProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
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
                    headerShown: false,
                    animationTypeForReplace: 'pop',
                  }}
                />
                <Stack.Screen
                  name="[...missing]"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(public)/advanced"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(public)/about"
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
                  name="(public)/settings"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(public)/on-premise"
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="(public)/events"
                  options={{
                    headerShown: false,
                    presentation: 'modal',
                    ...(Platform.OS === 'android' && {
                      animation: 'fade_from_bottom',
                    }),
                  }}
                />
              </Stack>

              <ToastMessage />
              <NoticeBottomSheet />
              {Platform.OS === 'android' ? (
                <AppThemeBackground
                  dark={tw.color('black') as string}
                  light={tw.color('transparent') as string}
                />
              ) : null}
              <StatusBar translucent />
            </AuthProvider>
          </QueryClientProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(RootLayout);
