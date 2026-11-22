import { Stack, useRoute } from 'expo-router';
import { HeaderHeightContext, useNavigationState } from 'expo-router/react-navigation';
import { createContext, useContext, useState, type ReactElement, type ReactNode } from 'react';
import { Platform, type StyleProp, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenStack, ScreenStackItem, type HeaderBarButtonItem } from 'react-native-screens';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import tw from 'twrnc';

const NAVIGATION_HEIGHT = 48;
// no iOS 26+ blur under the bar, on any edge (the Duo's side column included)
const HIDDEN_EDGES = { top: 'hidden', left: 'hidden', right: 'hidden', bottom: 'hidden' } as const;

// iOS: the screen option only reaches the first-child ScrollView, mark nested ones (must be the direct child).
// Android: plain View carrying the style, the marker throws when RefreshControl wraps the ScrollView
export const ScrollEdge = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactElement;
}) =>
  Platform.OS === 'ios' ? (
    <ScrollViewMarker scrollEdgeEffects={HIDDEN_EDGES} style={style ?? tw`flex-1`}>
      {children}
    </ScrollViewMarker>
  ) : (
    <View style={style ?? tw`flex-1`}>{children}</View>
  );

export const useHeaderTintColor = () =>
  (tw.prefixMatch('dark') ? tw.color('gray-200') : tw.color('slate-900')) ?? 'black';

// content offset below the header: native header height (status bar included) or our RN header row
export const useTopBarHeight = (withNativeHeader: boolean) => {
  const insets = useSafeAreaInsets();
  const nativeHeaderHeight = useContext(HeaderHeightContext);
  const isMasterColumn = useContext(MasterColumnContext);
  // iPhone Duo vertical bar: header items live in the side column, yet UIKit still reports a horizontal bar height
  // the left master column only touches a bar on the left edge
  const isInSideColumn = !insets.top && (insets.left > 0 || (!isMasterColumn && insets.right > 0));
  if (withNativeHeader && isInSideColumn) return NAVIGATION_HEIGHT / 2;
  return (withNativeHeader && nativeHeaderHeight) || NAVIGATION_HEIGHT + insets.top;
};

// first screen of its stack: no native back can exist there
export const useIsStackRoot = () => {
  const route = useRoute();
  return useNavigationState((state) => state?.routes[0]?.key === route.key);
};

// iOS only: transparent native header, the screen draws its own large title.
// Pass arrays of Stack.Toolbar items: the toolbar only reads its direct children.
const NativeHeader = ({
  title,
  titleView,
  withBackButton = true,
  onBack,
  left = [],
  right = [],
}: {
  title?: string;
  titleView?: ReactElement;
  withBackButton?: boolean;
  // used when the native back can't exist (first screen of a nested stack)
  onBack?: () => void;
  left?: ReactNode[];
  right?: ReactNode[];
}) => {
  const tintColor = useHeaderTintColor();
  const isStackRoot = useIsStackRoot();
  const withToolbarBack = withBackButton && isStackRoot && !!onBack;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          // kept for the back long-press history, hidden: the screen shows its own large title
          title: title ?? '',
          headerTitleStyle: { color: 'transparent' },
          // always set: options merge, an omitted key would keep the previous titleView (e.g. after unfolding)
          headerTitle: titleView ? () => titleView : undefined,
          headerTintColor: tintColor,
          headerBackButtonDisplayMode: 'minimal',
          headerBackVisible: withBackButton && !isStackRoot,
          scrollEdgeEffects: HIDDEN_EDGES,
        }}
      />
      {(withToolbarBack || !!left.length) && (
        <Stack.Toolbar placement="left">
          {[
            withToolbarBack && (
              <Stack.Toolbar.Button
                icon="chevron.left"
                key="back"
                tintColor={tintColor}
                onPress={onBack}
              />
            ),
            ...left,
          ]}
        </Stack.Toolbar>
      )}
      {!!right.length && <Stack.Toolbar placement="right">{right}</Stack.Toolbar>}
    </>
  );
};

export default NativeHeader;

// set inside MasterColumnNativeHeader: insets are global, the right one belongs to the detail pane
const MasterColumnContext = createContext(false);

// set inside StandaloneNativeHeader: the bar is already there, don't mount NativeHeader (it targets the parent screen)
export const StandaloneHeaderContext = createContext(false);

// iOS: a one-screen native stack gives any view its own transparent bar (outside expo-router stacks: master column, modals)
export const StandaloneNativeHeader = ({
  left,
  children,
}: {
  left: HeaderBarButtonItem[];
  children: ReactElement;
}) => {
  const [headerHeight, setHeaderHeight] = useState<number>();
  if (Platform.OS !== 'ios') return children;

  return (
    <ScreenStack style={tw`flex-1`}>
      <ScreenStackItem
        headerConfig={{
          // what native-stack's headerTransparent sets
          translucent: true,
          backgroundColor: 'transparent',
          hideShadow: true,
          title: '',
          headerLeftBarButtonItems: left,
        }}
        screenId="standalone"
        scrollEdgeEffects={HIDDEN_EDGES}
        style={tw`absolute inset-0`}
        onHeaderHeightChange={({ nativeEvent }) => setHeaderHeight(nativeEvent.headerHeight)}>
        <StandaloneHeaderContext value>
          <HeaderHeightContext value={headerHeight}>{children}</HeaderHeightContext>
        </StandaloneHeaderContext>
      </ScreenStackItem>
    </ScreenStack>
  );
};

// the wide master column sits outside its section's Stack
export const MasterColumnNativeHeader = ({
  onBack,
  children,
}: {
  onBack: () => void;
  children: ReactElement;
}) => {
  const tintColor = useHeaderTintColor();
  return (
    <StandaloneNativeHeader
      left={[
        {
          type: 'button',
          icon: { type: 'sfSymbol', name: 'chevron.left' },
          tintColor,
          onPress: onBack,
        },
      ]}>
      <MasterColumnContext value>{children}</MasterColumnContext>
    </StandaloneNativeHeader>
  );
};
