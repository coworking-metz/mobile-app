import HorizontalLoadingAnimation from './Animations/HorizontalLoadingAnimation';
import { forwardRef, ForwardRefRenderFunction } from 'react';
import { useColorScheme, View } from 'react-native';
import { TextField, TextFieldProps, TextFieldRef } from 'react-native-ui-lib';
import tw from 'twrnc';

type AppTextFieldProps = TextFieldProps & {
  loading?: boolean;
};

// https://wix.github.io/react-native-ui-lib/docs/components/form/TextField
const AppTextField: ForwardRefRenderFunction<TextFieldRef, AppTextFieldProps> = (
  { loading, ...otherProps },
  ref,
) => {
  const colorScheme = useColorScheme();
  return (
    <TextField
      ref={ref}
      color={{
        default: colorScheme === 'dark' ? tw.color('gray-100') : tw.color('gray-900'),
        error: tw.color('red-500'),
        disabled: tw.color('gray-400'),
      }}
      dynamicFieldStyle={({ isFocused, isValid }) => [
        tw`border-gray-400 dark:border-gray-700`,
        isFocused && tw`border-amber-500`,
        !isValid && tw`border-red-500`,
      ]}
      labelColor={{
        default: colorScheme === 'dark' ? tw.color('gray-200') : tw.color('gray-800'),
        focus: tw.color('amber-500'),
        error: tw.color('red-500'),
        disabled: tw.color('gray-400'),
      }}
      labelStyle={tw`text-base`}
      placeholderTextColor={colorScheme === 'dark' ? tw.color('gray-500') : tw.color('gray-400')}
      preset="outline"
      {...(loading && {
        trailingAccessory: (
          <View style={tw`relative h-6 w-6 shrink-0`}>
            <HorizontalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
              style={tw`h-full w-full`}
            />
          </View>
        ),
      })}
      {...otherProps}
    />
  );
};

export default forwardRef(AppTextField);
