import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

export type MaterialCommunityIconsName = keyof typeof mdiGlyphMap;

type AppIconProps = Omit<IconProps<MaterialCommunityIconsName>, 'name'> & {
  icon: MaterialCommunityIconsName;
};

const AppIcon = ({ icon, ...props }: AppIconProps) => {
  return <MaterialCommunityIcons {...props} name={icon} />;
};

export default AppIcon;
