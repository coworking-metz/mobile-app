import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

const Divider = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return <View style={[tw`border-b-gray-200 dark:border-b-gray-700 border-b-[1px]`, style]} />;
};

export default Divider;
