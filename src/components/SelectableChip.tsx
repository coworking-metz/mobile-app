import { TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import AppIcon, { MaterialCommunityIconsName } from '@/components/AppIcon';
import AppText from '@/components/AppText';

export const SelectableChip = ({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  icon?: MaterialCommunityIconsName | null;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          tw`flex flex-row items-center justify-center rounded-full border px-4 py-2`,
          selected
            ? tw`border-amber-700 bg-amber-50 dark:border-amber-500 dark:bg-amber-950`
            : tw`border-transparent bg-gray-200 dark:bg-zinc-800/80`,
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
          <AppIcon
            color={
              selected
                ? tw.prefixMatch('dark')
                  ? tw.color('amber-500')
                  : tw.color('amber-700')
                : tw.prefixMatch('dark')
                  ? tw.color('gray-400')
                  : tw.color('gray-700')
            }
            icon={icon}
            size={20}
            style={tw`ml-1`}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
