import { type MenuAction, MenuView } from '@react-native-menu/menu';
import { Stack, useNavigation, useRoute, useRouter, type Href } from 'expo-router';
import { HeaderHeightContext, useNavigationState } from 'expo-router/react-navigation';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { Platform, type StyleProp, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import tw from 'twrnc';
import AppIconButton from '@/components/AppIconButton';
import useAppScreen from '@/helpers/screen';

export const NAVIGATION_HEIGHT = 48;

export type HeaderAction = MenuAction & { onPress?: () => void };

// provided by master/detail layouts: where the section lives and which route is its root screen
export const SectionContext = createContext<{ href: Href; rootName: string } | null>(null);

// iPhone Duo: status bar and header items live in a side system column (window insets only on the right),
// UIKit still reserves an empty bar on top that we deliberately ignore
export const useHasSideSystemColumn = () => {
  const insets = useSafeAreaInsets();
  return !insets.top && !insets.left && insets.right > 0;
};

// wraps the screen's scroll view (react-native-screens only finds it along the first-child chain otherwise)
export const ScrollEdge = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: NonNullable<ReactNode>;
}) => {
  // edge effects are iOS-only; Android's marker throws when RefreshControl wraps the ScrollView
  if (Platform.OS !== 'ios') return <View style={style ?? tw`flex grow flex-col`}>{children}</View>;
  return (
    <ScrollViewMarker
      // no blur behind the transparent header: our content and AppTopFader handle the top edge
      scrollEdgeEffects={{ top: 'hidden' }}
      style={style ?? tw`flex grow flex-col`}>
      {children}
    </ScrollViewMarker>
  );
};

// top offset for content under the header: the native header height already includes the status bar
export const useNavigationHeight = () => {
  const insets = useSafeAreaInsets();
  const nativeHeaderHeight = useContext(HeaderHeightContext);
  const hasSideSystemColumn = useHasSideSystemColumn();
  if (hasSideSystemColumn) return NAVIGATION_HEIGHT / 2;
  return nativeHeaderHeight || NAVIGATION_HEIGHT + insets.top;
};

export const useHeaderTintColor = () =>
  (tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('slate-900')) ?? 'black';

export const useGoBack = (from?: string) => {
  const router = useRouter();
  return useCallback(() => {
    if (from) router.dismissTo(from);
    else if (router.canGoBack()) router.back();
    else router.replace('/home');
  }, [from, router]);
};

// Android wide master column: it sits outside the Stack, so no native header holds its back button
export const MasterBackButton = ({
  from,
  blurTarget,
}: {
  from: string;
  blurTarget?: RefObject<View | null>;
}) => {
  const insets = useSafeAreaInsets();
  const goBack = useGoBack(from);
  if (Platform.OS !== 'android') return null;
  return (
    <AppIconButton
      blurTarget={blurTarget}
      icon="arrow-left"
      style={[
        tw`absolute z-20 size-10`,
        { top: insets.top + (NAVIGATION_HEIGHT - 40) / 2, left: insets.left + 16 },
      ]}
      onPress={goBack}
    />
  );
};

// transparent native header owned by the current screen (so it lands in the detail column when wide)
const NativeHeader = ({
  title,
  titleView,
  withBackButton = true,
  menu,
  actions = [],
  rightItems,
  blurTarget,
}: {
  title?: string;
  // replaces the hidden title in the native bar (e.g. pagination dots)
  titleView?: ReactElement;
  withBackButton?: boolean;
  menu?: ReactElement;
  actions?: HeaderAction[];
  // raw Stack.Toolbar items, takes precedence over menu/actions
  rightItems?: ReactNode;
  // Android: the screen's BlurTargetView, so our header buttons blur its content
  blurTarget?: RefObject<View | null>;
}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const router = useRouter();
  const section = useContext(SectionContext);
  const { isWide } = useAppScreen();
  const tintColor = useHeaderTintColor();
  const goBack = useGoBack();
  // our own position, not the top index: we may re-render while covered (e.g. folding the iPhone Duo)
  const position = useNavigationState(
    (state) => state?.routes.findIndex(({ key }) => key === route.key) ?? -1,
  );
  const stackRootName = useNavigationState((state) => state?.routes[0]?.name);
  const isSectionRoot = !!section && route.name === section.rootName;
  // opened from the wide master column, it replaced the placeholder; opened folded (e.g. from home) it didn't
  const wasOpenedWide = useRef(isWide).current;
  // wide: the section root is only a placeholder (deep links push over it), back must skip it
  const isAbovePlaceholder =
    isWide && position === 1 && !!section && stackRootName === section.rootName;
  // a nested stack's first screen gets no native back, so we draw one in the toolbar
  const withToolbarBack = withBackButton && (position === 0 || isAbovePlaceholder);

  const onBack = useCallback(() => {
    // folded with a detail as stack root that replaced the placeholder while wide: rebuild the section home
    if (position === 0 && section && !isSectionRoot && !isWide && wasOpenedWide) {
      router.replace(section.href);
    } else if (isAbovePlaceholder) navigation.getParent()?.goBack();
    else goBack();
  }, [
    position,
    section,
    isSectionRoot,
    isWide,
    wasOpenedWide,
    isAbovePlaceholder,
    router,
    navigation,
    goBack,
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          // named for the iOS back long-press history, but hidden: the screen shows its own large title
          title: title ?? '',
          headerTitleStyle: { color: 'transparent' },
          // Android ignores the transparent title color
          ...(Platform.OS === 'android' && { headerTitle: '' }),
          ...(titleView && { headerTitle: () => titleView }),
          headerTintColor: tintColor,
          headerBackButtonDisplayMode: 'minimal',
          headerBackVisible: withBackButton && !withToolbarBack,
          // Android: no Stack.Toolbar, our buttons go in the native header slots (always our own back)
          ...(Platform.OS === 'android' && {
            headerBackVisible: false,
            // wide: the detail column's first screen has nothing to go back to, back lives in the master column
            headerLeft:
              withBackButton && !(isWide && withToolbarBack)
                ? () => (
                    <AppIconButton
                      blurTarget={blurTarget}
                      icon="arrow-left"
                      radius={25}
                      style={tw`size-10`}
                      onPress={onBack}
                    />
                  )
                : undefined,
            headerRight:
              menu || actions.length
                ? () =>
                    menu ?? (
                      <MenuView
                        actions={actions}
                        shouldOpenOnLongPress={false}
                        onPressAction={({ nativeEvent: { event: actionId } }) =>
                          actions.find(({ id }) => id === actionId)?.onPress?.()
                        }>
                        <AppIconButton
                          blurTarget={blurTarget}
                          icon="dots-vertical"
                          radius={25}
                          style={tw`size-10`}
                        />
                      </MenuView>
                    )
                : undefined,
          }),
        }}
      />
      {Platform.OS === 'ios' && withToolbarBack && (
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon="chevron.left" tintColor={tintColor} onPress={onBack} />
        </Stack.Toolbar>
      )}
      {Platform.OS !== 'ios' ? null : rightItems ? (
        <Stack.Toolbar placement="right">{rightItems}</Stack.Toolbar>
      ) : menu ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.View>{menu}</Stack.Toolbar.View>
        </Stack.Toolbar>
      ) : actions.length ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu icon="ellipsis" tintColor={tintColor}>
            {actions.map((action) => (
              <Stack.Toolbar.MenuAction
                destructive={action.attributes?.destructive}
                disabled={action.attributes?.disabled}
                key={action.id}
                onPress={action.onPress}>
                {action.title}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        </Stack.Toolbar>
      ) : null}
    </>
  );
};

export default NativeHeader;
