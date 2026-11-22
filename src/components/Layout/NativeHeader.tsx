import { type MenuAction } from '@react-native-menu/menu';
import { Stack, useNavigation, useRoute, useRouter, type Href } from 'expo-router';
import { HeaderHeightContext, useNavigationState } from 'expo-router/react-navigation';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import tw from 'twrnc';
import useAppScreen from '@/helpers/screen';
import { useToolbarIcon } from '@/helpers/toolbar';

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
  const hasSideSystemColumn = useHasSideSystemColumn();
  return (
    <ScrollViewMarker
      // the top bar is empty on the Duo: don't let its scroll edge blur cover our content
      scrollEdgeEffects={hasSideSystemColumn ? { top: 'hidden' } : undefined}
      style={style ?? tw`flex-1`}>
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

// transparent native header owned by the current screen (so it lands in the detail column when wide)
const NativeHeader = ({
  title,
  titleView,
  withBackButton = true,
  menu,
  actions = [],
  rightItems,
}: {
  title?: string;
  // replaces the hidden title in the native bar (e.g. pagination dots)
  titleView?: ReactElement;
  withBackButton?: boolean;
  menu?: ReactElement;
  actions?: HeaderAction[];
  // raw Stack.Toolbar items, takes precedence over menu/actions
  rightItems?: ReactNode;
}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const router = useRouter();
  const section = useContext(SectionContext);
  const { isWide } = useAppScreen();
  const tintColor = useHeaderTintColor();
  const backIcon = useToolbarIcon('chevron.left', 'arrow-left', tintColor);
  const moreIcon = useToolbarIcon('ellipsis', 'dots-vertical', tintColor);
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
          ...(titleView && { headerTitle: () => titleView }),
          headerTintColor: tintColor,
          headerBackButtonDisplayMode: 'minimal',
          headerBackVisible: withBackButton && !isAbovePlaceholder,
        }}
      />
      {withToolbarBack && (
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon={backIcon} tintColor={tintColor} onPress={onBack} />
        </Stack.Toolbar>
      )}
      {rightItems ? (
        <Stack.Toolbar placement="right">{rightItems}</Stack.Toolbar>
      ) : menu ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.View>{menu}</Stack.Toolbar.View>
        </Stack.Toolbar>
      ) : actions.length ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu icon={moreIcon} tintColor={tintColor}>
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
