import React from 'react';
import { View } from 'react-native';
import { LineGraph, type GraphPoint } from 'react-native-graph';
import tw from 'twrnc';

const MetricsCard = ({ history, color }: { history: GraphPoint[]; color: string }) => {
  return (
    <View
      style={tw`flex flex-row items-end rounded-2xl h-24 overflow-hidden bg-gray-200 dark:bg-gray-900`}>
      <LineGraph
        animated={true}
        color={tw.color(`${color}-700`) as string}
        gradientFillColors={[
          (tw.prefixMatch('dark') ? tw.color(`${color}-900`) : tw.color(`${color}-200`)) as string,
          (tw.prefixMatch('dark') ? tw.color(`gray-900`) : tw.color('white')) as string,
        ]}
        points={history}
        style={tw`h-3/4 w-full`}
      />
    </View>
  );
};

export default MetricsCard;
