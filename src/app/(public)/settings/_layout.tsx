import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import tw, { useDeviceContext } from 'twrnc';
import { SectionContext } from '@/components/Layout/NativeHeader';
import SettingsHome from '@/components/Settings/SettingsHome';
import useAppScreen from '@/helpers/screen';

const SECTION = { href: '/settings', rootName: 'index' } as const;

// the section root sits under deep-linked screens (placeholder when wide)
export const unstable_settings = { anchor: SECTION.rootName };

export default function SettingsLayout() {
  useDeviceContext(tw);

  const { isWide } = useAppScreen();
  const reduceMotion = useReducedMotion();

  return (
    <View style={tw`flex grow flex-row`}>
      {isWide && (
        <View
          key="master"
          style={tw`h-full min-w-80 max-w-md shrink grow basis-0 border-r border-r-gray-200 dark:border-r-gray-700`}>
          <SettingsHome from="/home" />
        </View>
      )}
      {/* keyed so the Stack keeps its state when the master column toggles */}
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
            <Stack.Screen name="index" options={{ animationTypeForReplace: 'pop' }} />
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
        </SectionContext>
      </View>
    </View>
  );
}
