import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  MenuAction,
  MenuComponentProps,
  MenuComponentRef,
  MenuView,
} from '@react-native-menu/menu';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { Platform } from 'react-native';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

export type AppMenuAction = MenuAction & {
  onPress?: () => void;
};

export type AppMenuProps = Omit<MenuComponentProps, 'actions'> & {
  actions: AppMenuAction[];
};

const AppMenu: ForwardRefRenderFunction<MenuComponentRef, AppMenuProps> = (
  { actions, style, ...otherProps },
  ref,
) => {
  return (
    <MenuView
      ref={ref}
      actions={actions}
      shouldOpenOnLongPress={false}
      style={style}
      onPressAction={({ nativeEvent: { event: actionId } }) => {
        const action = actions.find(({ id }) => id === actionId);
        action?.onPress?.();
      }}
      {...otherProps}>
      <MaterialCommunityIcons.Button
        backgroundColor="transparent"
        borderRadius={24}
        color={tw.prefixMatch('dark') ? tw.color('gray-400') : theme.charlestonGreen}
        iconStyle={{ marginRight: 0 }}
        name="dots-vertical"
        size={32}
        style={tw`p-1`}
        underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
        onPress={() => {
          if (Platform.OS === 'ios') {
            // only for iOS because Android vibration is too loud
            impactAsync(ImpactFeedbackStyle.Light);
          }
        }}
      />
    </MenuView>
  );
};

export default forwardRef(AppMenu);
