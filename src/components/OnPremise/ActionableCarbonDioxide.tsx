import React, { useMemo } from 'react';
import { View, useColorScheme } from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { Easing } from 'react-native-reanimated';
import tw from 'twrnc';
import ActionableIcon, { type ActionableIconProps } from '@/components/OnPremise/ActionableIcon';
import { CARBON_DIOXIDE_RANGES } from '@/services/api/services';

const ActionableCarbonDioxide = ({
  level,
  ...props
}: ActionableIconProps & {
  level?: number;
}) => {
  const colorScheme = useColorScheme();
  const levelColor = useMemo(() => {
    if (!level) return tw.color('gray-400/25');
    const [_, normal, high, excessive] = CARBON_DIOXIDE_RANGES;
    if (level < Number(normal)) {
      return colorScheme === 'dark' ? tw.color('emerald-700') : tw.color('emerald-600');
    } else if (level < Number(high)) {
      return colorScheme === 'dark' ? tw.color('lime-700') : tw.color('lime-600');
    } else if (level < Number(excessive)) {
      return colorScheme === 'dark' ? tw.color('yellow-700') : tw.color('yellow-600');
    } else {
      return colorScheme === 'dark' ? tw.color('red-700') : tw.color('red-600');
    }
  }, [colorScheme, level]);

  return (
    <ActionableIcon {...props}>
      <View
        style={tw`z-20 flex items-center justify-center absolute inset-0 -top-2 -left-2 h-12 w-12`}>
        <AnimatedProgressWheel
          rounded
          animateFromValue={0}
          backgroundColor={
            (tw.prefixMatch('dark') ? tw.color(`gray-700`) : tw.color(`gray-400`)) as string
          }
          color={levelColor as string}
          duration={1000}
          easing={Easing.inOut(Easing.ease)}
          max={1600}
          progress={level ? level - 400 : level}
          rotation={'-90deg'}
          size={48}
          width={4}
        />
      </View>
    </ActionableIcon>
  );
};

export default ActionableCarbonDioxide;
