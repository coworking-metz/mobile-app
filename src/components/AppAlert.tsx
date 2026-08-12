import { useMemo } from 'react';
import { useColorScheme, ViewProps } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import AppIcon, { MaterialCommunityIconsName } from '@/components/AppIcon';
import AppText from '@/components/AppText';

const AppAlert = ({
  children,
  description,
  type,
  icon,
  iconColor,
  style,
  ...otherProps
}: AnimatedProps<ViewProps> & {
  children?: React.ReactNode;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'critical';
  icon?: MaterialCommunityIconsName;
  iconColor?: string;
}) => {
  const colorScheme = useColorScheme();
  const iconApplied = useMemo(() => {
    if (icon) return icon;
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'alert-octagon';
      case 'critical':
        return 'alert-circle';
      case 'info':
      default:
        return 'information-slab-circle';
    }
  }, [type]);

  const iconColorApplied = useMemo(() => {
    if (iconColor) return iconColor;
    switch (type) {
      case 'success':
        return tw.color('emerald-600');
      case 'info':
        return tw.color('blue-600');
      case 'warning':
        return tw.color('yellow-500');
      case 'critical':
        return colorScheme === 'dark' ? tw.color('red-700') : tw.color('red-600');
      default:
        return tw.color('gray-500');
    }
  }, [type, iconColor, colorScheme]);

  return (
    <Animated.View
      style={[tw`flex flex-row items-start gap-3 overflow-hidden`, style]}
      {...otherProps}>
      <AppIcon color={iconColorApplied} icon={iconApplied} size={24} style={tw`shrink-0 grow-0`} />
      {children ?? (
        <AppText
          style={tw`shrink grow basis-0 text-left text-base font-normal text-slate-500 dark:text-neutral-500`}>
          {description}
        </AppText>
      )}
    </Animated.View>
  );
};

export default AppAlert;
