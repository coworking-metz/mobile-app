import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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

createHttpInterceptors(HTTP);

export const unstable_settings = {
  // Ensure any route can link back to `/`
  // initialRouteName: 'index',
};

const RootLayout = () => {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent />
      <I18nProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
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
                name="(public)/onboarding"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="(private)/presence"
                options={{
                  presentation: 'modal',
                  // animation: 'fade',
                }}
              />
              <Stack.Screen
                name="(private)/home"
                options={{
                  headerShown: false,
                  animation: 'fade',
                }}
              />
            </Stack>

            <ToastMessage
              style={[
                ...(Platform.OS === 'android'
                  ? [
                      !!insets.top && { marginTop: insets.top },
                      !!insets.left && { marginLeft: insets.left },
                      !!insets.bottom && { marginBottom: insets.bottom },
                      !!insets.right && { marginRight: insets.right },
                    ]
                  : []),
              ]}
            />
            <NoticeBottomSheet />
          </SafeAreaProvider>
        </AuthProvider>
      </I18nProvider>
    </View>
  );
};

export default RootLayout;