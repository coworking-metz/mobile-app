import SettingsScreen from './settings';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import useAppScreen from '@/helpers/screen';

export default function SettingsLayout() {
  useDeviceContext(tw);

  const { isWide } = useAppScreen();

  if (!isWide) {
    return (
      <Stack
        initialRouteName="settings"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="changes"
          options={{
            presentation: 'modal',
            ...(Platform.OS === 'android' && {
              animation: 'slide_from_bottom',
            }),
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            presentation: 'modal',
            ...(Platform.OS === 'android' && {
              animation: 'slide_from_bottom',
            }),
          }}
        />
      </Stack>
    );
  }

  return (
    <View style={tw`flex flex-row grow`}>
      <View
        style={tw`grow shrink basis-0 h-full min-w-80 max-w-md border-r-[1px] border-r-gray-200 dark:border-r-gray-700`}>
        <SettingsScreen from="/home" />
      </View>
      <View style={tw`grow shrink basis-0 h-full min-w-80 overflow-hidden`}>
        <Stack
          initialRouteName="root"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="root"
            options={{
              animation: 'none',
            }}
          />
          <Stack.Screen
            initialParams={{
              _root: 'true',
            }}
            name="account"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen
            initialParams={{
              _root: 'true',
            }}
            name="advanced"
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <Stack.Screen
            initialParams={{
              _root: 'true',
            }}
            name="privacy"
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <Stack.Screen
            initialParams={{
              _root: 'true',
            }}
            name="devices"
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <Stack.Screen
            initialParams={{
              _root: 'true',
            }}
            name="about"
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          {/* <Stack.Screen name="devices/[deviceId]" options={{}} />
          <Stack.Screen name="devices/new" options={{}} /> */}

          <Stack.Screen
            name="changes"
            options={{
              presentation: 'modal',
              ...(Platform.OS === 'android' && {
                animation: 'slide_from_bottom',
              }),
            }}
          />
        </Stack>
      </View>
    </View>
  );
}
