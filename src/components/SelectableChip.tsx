import AppText from './AppText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

export const SelectableChip = ({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  icon?: keyof typeof mdiGlyphMap | null;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tw`flex flex-row items-center justify-center px-4 py-2 rounded-full border-[1px]`,
          selected
            ? tw`bg-amber-50 border-amber-700 dark:bg-amber-950 dark:border-amber-500`
            : tw`bg-gray-200 dark:bg-gray-800/80 border-transparent`,
        ]}>
        <AppText
          style={[
            tw`text-base font-normal`,
            selected
              ? tw`text-amber-700 dark:text-amber-500`
              : tw`text-slate-900 dark:text-gray-200`,
          ]}>
          {label}
        </AppText>

        {icon && (
          <MaterialCommunityIcons
            color={
              selected
                ? tw.prefixMatch('dark')
                  ? tw.color('amber-500')
                  : tw.color('amber-700')
                : tw.prefixMatch('dark')
                  ? tw.color('gray-400')
                  : tw.color('gray-700')
            }
            name={icon}
            size={20}
            style={tw`ml-1`}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
