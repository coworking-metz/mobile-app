import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw, { useDeviceContext } from 'twrnc';
import { theme } from '@/helpers/colors';

export default function EventsLayout() {
  useDeviceContext(tw);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={tw`relative h-full w-full bg-gray-100 dark:bg-black`}>
      <View
        style={[
          tw`px-4 mt-3 absolute z-10 top-0`,
          { right: insets.right },
          Platform.OS === 'android' && { top: insets.top, marginTop: 4 },
        ]}>
        <MaterialCommunityIcons.Button
          backgroundColor="transparent"
          borderRadius={24}
          color={tw.prefixMatch('dark') ? tw.color('gray-500') : theme.charlestonGreen}
          iconStyle={{ height: 32, width: 32, marginRight: 0 }}
          name="close"
          size={32}
          style={tw`p-1 shrink-0`}
          underlayColor={tw.prefixMatch('dark') ? tw.color('gray-800') : tw.color('gray-200')}
          onPress={() => router.navigate('/home')}
        />
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          ...(Platform.OS === 'android' && {
            animation: 'ios',
          }),
        }}>
        <Stack.Screen
          name="calendar"
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
        <Stack.Screen name="[id]" />
      </Stack>
    </View>
  );
}
