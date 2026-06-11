import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  I18nManager,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import tw from 'twrnc';
import AppText from '@/components/AppText';

/**
 * Copied from https://github.com/kuraydev/react-native-segmented-control-2
 */

type TabItem = string | React.ReactElement;

interface SegmentedControlProps {
  tabs: TabItem[];
  initialIndex?: number;
  activeTextColor?: string;
  activeTabColor?: string;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle> | ((index: number) => StyleProp<ViewStyle>);
  textStyle?: StyleProp<TextStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
  selectedTabStyle?: StyleProp<ViewStyle>;
  onChange: (index: number) => void;
  value?: number;
}

const AppSegmentedControl = ({
  style,
  tabs,
  onChange,
  value,
  tabStyle,
  textStyle,
  activeTextStyle,
  selectedTabStyle,
  initialIndex = 0,
  gap = 2,
  activeTextColor = '#000',
  activeTabColor = '#fff',
}: SegmentedControlProps) => {
  const [slideAnimation] = useState(new Animated.Value(0));
  const [localCurrentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [tabLayouts, setTabLayouts] = useState<{
    [tabIndex: number]: LayoutRectangle;
  }>({});

  const currentIndex = value ?? localCurrentIndex;

  const handleTabPress = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      onChange?.(index);
    },
    [onChange],
  );

  useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: (I18nManager.isRTL ? -1 : 1) * (tabLayouts[currentIndex]?.x || 0),
      stiffness: 180,
      damping: 25,
      mass: 1,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, slideAnimation, tabLayouts]);

  const onLayoutTab = useCallback((index: number, { nativeEvent }: LayoutChangeEvent) => {
    setTabLayouts((prev) => ({ ...prev, [index]: nativeEvent.layout }));
  }, []);

  const tabSpecificStyle = useCallback(
    (tabIndex: number) => {
      if (typeof tabStyle === 'function') {
        return tabStyle(tabIndex);
      }

      return tabStyle;
    },
    [tabStyle],
  );

  const renderSelectedTab = useCallback(
    () => (
      <Animated.View
        style={[
          styles.activeTab(
            tabLayouts[currentIndex]?.width || 0,
            gap,
            activeTabColor,
            slideAnimation,
          ),
          selectedTabStyle,
        ]}
      />
    ),
    [activeTabColor, gap, selectedTabStyle, slideAnimation, tabLayouts, currentIndex],
  );

  const renderTab = (tab: TabItem, index: number) => {
    const isActiveTab = currentIndex === index;
    const isTabText = typeof tab === 'string';
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        key={index}
        style={[
          tw`flex shrink grow basis-0 flex-col items-center justify-center py-2`,
          tabSpecificStyle(index),
        ]}
        onLayout={(e) => onLayoutTab(index, e)}
        onPress={() => handleTabPress(index)}>
        {!isTabText ? (
          tab
        ) : (
          <AppText
            numberOfLines={1}
            style={[
              tw`text-center text-base font-medium`,
              textStyle,
              isActiveTab && activeTextStyle,
              isActiveTab && { color: activeTextColor },
            ]}>
            {tab}
          </AppText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[tw`flex w-[90%] flex-row items-center rounded-xl`, style]}>
      {renderSelectedTab()}
      <View style={[tw`flex shrink grow basis-0 flex-row`, { marginHorizontal: gap }]}>
        {tabs.map((tab, index: number) => renderTab(tab, index))}
      </View>
    </View>
  );
};

const styles = {
  activeTab: (
    tabWidth: number,
    gap: number,
    activeTabColor: string,
    slideAnimation: Animated.Value,
  ) => ({
    ...StyleSheet.absoluteFill,
    width: tabWidth,
    margin: gap,
    backgroundColor: activeTabColor,
    transform: [{ translateX: slideAnimation }],
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
  }),
} as const;

export default AppSegmentedControl;
