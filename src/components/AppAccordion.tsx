import AppIcon from './AppIcon';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type LayoutChangeEvent,
  StyleProp,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';
import { HapticFeedbackType, vibrate } from '@/helpers/haptics';

type AccordionType = 'single' | 'multiple';

type AccordionContextType<T> = {
  openItems: Set<T>;
  toggleItem: (id: T) => void;
};

const AccordionContext = createContext<AccordionContextType<any> | null>(null);
const AccordionItemContext = createContext<{
  value: string;
  isOpen: boolean;
} | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within Accordion');
  return context;
};

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error('Trigger and Content must be within Item');
  return context;
};

const ChevronIcon = ({ isOpen, style }: { isOpen: boolean; style?: StyleProp<ViewStyle> }) => {
  const rotation = useSharedValue<number>(0);

  React.useEffect(() => {
    rotation.value = withTiming<number>(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      <AppIcon
        color={tw.prefixMatch('dark') ? tw.color('neutral-400') : tw.color('gray-700')}
        icon="chevron-down"
        size={20}
      />
    </Animated.View>
  );
};

const Accordion = <T extends string>({
  children,
  type = 'single',
  keepOpen = false,
  initialOpenItems = new Set<T>(),
  style,
  onChange,
}: {
  children: React.ReactNode;
  type?: AccordionType;
  keepOpen?: boolean;
  initialOpenItems?: Set<T>;
  style?: StyleProp<ViewStyle>;
  onChange?: (openItems: Set<T>) => void;
}) => {
  const [openItems, setOpenItems] = useState<Set<T>>(initialOpenItems);

  const toggleItem = (id: T) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (type === 'single') {
        if (newSet.has(id)) {
          if (!keepOpen) {
            newSet.clear();
          }
        } else {
          newSet.clear();
          newSet.add(id);
        }
      } else {
        if (newSet.has(id)) {
          const isLast = newSet.size === 1;
          if (!(keepOpen && isLast)) {
            newSet.delete(id);
          }
        } else {
          newSet.add(id);
        }
      }
      onChange?.(newSet);
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <View style={[tw`w-full overflow-hidden`, style]}>{children}</View>
    </AccordionContext.Provider>
  );
};
const AccordionItem = ({
  children,
  value,
  pop = false,
  popScale = 1.02,
  style,
}: {
  children: React.ReactNode;
  value: string;
  pop?: boolean;
  popScale?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.has(value);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (pop) {
      scale.value = withTiming(isOpen ? popScale : 1, { duration: 200 });
    }
  }, [isOpen, pop]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <Animated.View style={[style, pop && animatedStyle]}>{children}</Animated.View>
    </AccordionItemContext.Provider>
  );
};
const AccordionTrigger = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const { toggleItem } = useAccordionContext();
  const { value, isOpen } = useAccordionItemContext();

  return (
    <TouchableHighlight
      style={[tw`rounded-2xl`, style]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('neutral-700/30') : tw.color('gray-200')}
      onPress={() => {
        toggleItem(value);
        vibrate(HapticFeedbackType.Light);
      }}>
      <View style={[tw`flex flex-row items-center`]}>
        {children}
        <ChevronIcon isOpen={isOpen} style={tw`ml-auto`} />
      </View>
    </TouchableHighlight>
  );
};

const AccordionContent = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const { isOpen } = useAccordionItemContext();
  const height = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(0);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [measured, setMeasured] = useState<boolean>(false);

  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && !measured) {
      setContentHeight(h);
      setMeasured(true);
    }
  };

  useEffect(() => {
    if (measured) {
      if (isOpen) {
        height.value = withTiming(contentHeight, { duration: 200 });
        opacity.value = withTiming(1, { duration: 200 });
      } else {
        height.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 });
      }
    }
  }, [isOpen, measured, contentHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: measured ? opacity.value : 0,
    overflow: 'hidden',
  }));

  return (
    <>
      {!measured && (
        <View style={tw`absolute opacity-0 left-0 right-0`} onLayout={onLayout}>
          <View style={style}>{children}</View>
        </View>
      )}
      <Animated.View style={animatedStyle}>
        <View style={tw`absolute w-full`}>
          <Animated.View style={style}>{children}</Animated.View>
        </View>
      </Animated.View>
    </>
  );
};

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
