import SettingsScreen from './settings';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import useAppScreen from '@/helpers/screen';

export default function SettingsLayout() {
  useDeviceContext(tw);

  const { isWide } = useAppScreen();
  const reduceMotion = useReducedMotion();

  return (
    <View style={tw`flex grow flex-row`}>
      {isWide && (
        <View
          key="list"
          style={tw`h-full min-w-80 max-w-md shrink grow basis-0 border-r border-r-gray-200 dark:border-r-gray-700`}>
          <SettingsScreen from="/home" />
        </View>
      )}
      <View
        key="detail"
        style={
          isWide
            ? tw`h-full min-w-80 shrink grow basis-0 overflow-hidden`
            : tw`h-full min-w-80 shrink grow basis-0`
        }>
        <Stack
          initialRouteName="settings"
          screenOptions={{
            headerShown: false,
            ...(reduceMotion && {
              animation: 'fade',
            }),
          }}>
          <Stack.Screen
            name="root"
            options={{
              animation: 'none',
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
