import CalendarScreen from './calendar';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import useAppScreen from '@/helpers/screen';

export default function EventsLayout() {
  useDeviceContext(tw);

  const { isWide } = useAppScreen();
  const reduceMotion = useReducedMotion();

  if (!isWide) {
    return (
      <Stack
        initialRouteName="calendar"
        screenOptions={{
          headerShown: false,
          ...(reduceMotion && {
            animation: 'fade',
          }),
        }}
      />
    );
  }

  return (
    <View style={tw`flex grow flex-row`}>
      <View
        style={tw`h-full min-w-80 max-w-md shrink grow basis-0 border-r border-r-gray-200 dark:border-r-gray-700`}>
        <CalendarScreen from="/home" />
      </View>
      <View style={tw`h-full min-w-80 shrink grow basis-0`}>
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
