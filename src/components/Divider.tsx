import { View } from 'react-native';
import { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';

const Divider = ({ style }: { style?: StyleProps }) => {
  return <View style={[tw`border-b-gray-200 dark:border-b-gray-700 border-b-[1px]`, style]} />;
};

export default Divider;
