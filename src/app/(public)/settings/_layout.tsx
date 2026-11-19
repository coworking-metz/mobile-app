import { Stack, usePathname } from 'expo-router';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import SettingsHome from '@/components/Settings/SettingsHome';
import useAppScreen from '@/helpers/screen';

export default function SettingsLayout() {
  useDeviceContext(tw);

  const { isWide } = useAppScreen();
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isIndexRoute = pathname === '/settings';

  return (
    <View style={tw`relative flex grow flex-row`}>
      <View
        key="master"
        style={
          isWide
            ? tw`h-full min-w-80 max-w-md shrink grow basis-0 border-r border-r-gray-200 dark:border-r-gray-700`
            : tw`absolute inset-0`
        }>
        <SettingsHome from="/home" />
      </View>
      <View
        key="detail"
        pointerEvents={!isWide && isIndexRoute ? 'none' : 'auto'}
        style={
          isWide
            ? tw`h-full min-w-80 shrink grow basis-0 overflow-hidden`
            : tw`absolute inset-0 z-10 bg-green-300`
        }>
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
            ...(reduceMotion && {
              animation: 'fade',
            }),
            contentStyle: {
              backgroundColor: 'transparent',
            },
          }}>
          <Stack.Screen
            name="index"
            options={{
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
          />
          <Stack.Screen
            name="account"
            options={{
              animation: isWide ? 'fade' : undefined,
            }}
          />
          <Stack.Screen
            name="advanced"
            options={{
              animation: isWide ? 'fade_from_bottom' : undefined,
            }}
          />
          <Stack.Screen
            name="privacy"
            options={{
              animation: isWide ? 'fade_from_bottom' : undefined,
            }}
          />
          <Stack.Screen
            name="devices"
            options={{
              animation: isWide ? 'fade_from_bottom' : undefined,
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              animation: isWide ? 'fade_from_bottom' : undefined,
            }}
          />
        </Stack>
      </View>
    </View>
  );
}
