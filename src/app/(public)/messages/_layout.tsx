import InboxScreen from './inbox';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import { MasterColumnNativeHeader } from '@/components/Layout/NativeHeader';
import useAppScreen from '@/helpers/screen';

// the section root sits under deep-linked screens (placeholder when wide)
export const unstable_settings = { anchor: 'root' };

export default function MessagesLayout() {
  useDeviceContext(tw);

  const { isWide } = useAppScreen();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  if (!isWide) {
    return (
      <Stack
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
        style={tw`h-full min-w-80 max-w-lg shrink grow basis-0 border-r border-r-gray-200 dark:border-r-zinc-950`}>
        <MasterColumnNativeHeader onBack={() => router.dismissTo('/home')}>
          <InboxScreen from="/home" />
        </MasterColumnNativeHeader>
      </View>
      <View style={tw`h-full min-w-80 shrink grow basis-0`}>
        <Stack
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
            name="[messageId]"
            options={{
              animation: 'fade',
            }}
          />
        </Stack>
      </View>
    </View>
  );
}
