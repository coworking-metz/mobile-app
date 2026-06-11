import { StyleProp, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

const Divider = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return <View style={[tw`border-b border-b-gray-200 dark:border-b-zinc-700`, style]} />;
};

export default Divider;
