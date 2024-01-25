import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import NoticeBottomSheet from '@/components/NoticeBottomSheet';
import ToastMessage from '@/components/ToastMessage';
import { AuthProvider } from '@/context/auth';
import { I18nProvider } from '@/context/i18n';
import '@/i18n';
import { HTTP } from '@/services/http';
import createHttpInterceptors from '@/services/interceptors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

if (Platform.OS === 'android') {
  // https://stackoverflow.com/a/76988309
  NavigationBar.setPositionAsync('absolute');
  NavigationBar.setBackgroundColorAsync('#ffffff01');
}

createHttpInterceptors(HTTP);

const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  // initialRouteName: 'index',
};

const RootLayout = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: 'transparent',
                  },
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
                  name="(public)/login"
                  options={{
                    headerShown: false,
                    animation: 'fade',
                    animationTypeForReplace: 'pop',
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
                    presentation: 'modal',
                    ...(Platform.OS === 'android' && {
                      animation: 'fade_from_bottom',
                    }),
                  }}
                />

                <Stack.Screen
                  name="(private)/home"
                  options={{
                    animation: 'fade',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(private)/settings"
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="(private)/events"
                  options={{
                    headerShown: false,
                    presentation: 'modal',
                    ...(Platform.OS === 'android' && {
                      animation: 'fade_from_bottom',
                    }),
                  }}
                />
              </Stack>

              <ToastMessage
                style={[
                  ...(Platform.OS === 'android'
                    ? [
                        { marginTop: (insets.top || 0) + 8 },
                        !!insets.left && { marginLeft: insets.left },
                        !!insets.bottom && { marginBottom: insets.bottom },
                        !!insets.right && { marginRight: insets.right },
                      ]
                    : []),
                ]}
              />
              <NoticeBottomSheet />
            </QueryClientProvider>
          </AuthProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </View>
  );
};

export default RootLayout;
