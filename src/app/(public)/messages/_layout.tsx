import InboxScreen from './inbox';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import { SectionContext } from '@/components/Layout/NativeHeader';
import useAppScreen from '@/helpers/screen';

const SECTION = { href: '/messages', rootName: 'root' } as const;

// the section root sits under deep-linked screens (placeholder when wide)
export const unstable_settings = { anchor: SECTION.rootName };

export default function MessagesLayout() {
  useDeviceContext(tw);

  const { isWide } = useAppScreen();
  const reduceMotion = useReducedMotion();

  return (
    <View style={tw`flex grow flex-row`}>
      {isWide && (
        <View
          key="master"
          style={tw`h-full min-w-80 max-w-md shrink grow basis-0 border-r border-r-gray-200 dark:border-r-gray-700`}>
          <InboxScreen from="/home" />
        </View>
      )}
      {/* keyed so the Stack keeps its state when the master column toggles (iPhone Duo fold) */}
      <View
        key="detail"
        style={isWide ? tw`h-full min-w-80 shrink grow basis-0 overflow-hidden` : tw`flex-1`}>
        <SectionContext value={SECTION}>
          <Stack
            screenOptions={{
              headerShown: false,
              ...(reduceMotion && {
                animation: 'fade',
              }),
            }}>
            <Stack.Screen
              name="root"
              options={{
                animation: isWide ? 'none' : undefined,
                animationTypeForReplace: 'pop',
              }}
            />
            <Stack.Screen name="inbox" />
            <Stack.Screen
              name="[messageId]"
              options={{
                animation: isWide ? 'fade' : undefined,
              }}
            />
          </Stack>
        </SectionContext>
      </View>
    </View>
  );
}
