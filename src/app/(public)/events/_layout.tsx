import CalendarScreen from './calendar';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import useAppScreen from '@/helpers/screen';

export default function EventsLayout() {
  useDeviceContext(tw);

  const { isWide } = useAppScreen();

  if (!isWide) {
    return (
      <Stack
        initialRouteName="calendar"
        screenOptions={{
          headerShown: false,
        }}></Stack>
    );
  }

  return (
    <View style={tw`flex flex-row grow`}>
      <View
        style={tw`grow shrink basis-0 h-full min-w-80 max-w-md border-r-[1px] border-r-gray-200 dark:border-r-gray-700`}>
        <CalendarScreen from="/home" />
      </View>
      <View style={tw`grow shrink basis-0 h-full min-w-80`}>
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
            name="[eventId]"
            options={{
              animation: 'fade',
            }}
          />
        </Stack>
      </View>
    </View>
  );
}
