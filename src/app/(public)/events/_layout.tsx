import { Stack } from 'expo-router';
import tw, { useDeviceContext } from 'twrnc';

export default function EventsLayout() {
  useDeviceContext(tw);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="calendar"
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
