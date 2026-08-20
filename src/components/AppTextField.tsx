import { forwardRef, ForwardRefRenderFunction } from 'react';
import { useColorScheme, View } from 'react-native';
import { TextField, TextFieldProps, TextFieldRef } from 'react-native-ui-lib';
import tw from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';

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
      charCounterStyle={tw`mr-3 text-xs text-slate-500 dark:text-neutral-500`}
      color={{
        default: colorScheme === 'dark' ? tw.color('gray-100') : tw.color('gray-900'),
        error: tw.color('red-500'),
        disabled: tw.color('zinc-400'),
      }}
      dynamicFieldStyle={({ isFocused, isValid }) => [
        tw`border-zinc-400 dark:border-zinc-700`,
        isFocused && tw`border-amber-500`,
        !isValid && tw`border-red-600 dark:border-red-700`,
      ]}
      fieldStyle={tw`rounded-xl`}
      labelColor={{
        default: colorScheme === 'dark' ? tw.color('neutral-500') : tw.color('slate-500'),
        focus: tw.color('amber-500'),
        error: colorScheme === 'dark' ? tw.color('red-700') : tw.color('red-600'),
        disabled: tw.color('gray-400'),
      }}
      labelStyle={tw`text-base`}
      placeholderTextColor={
        colorScheme === 'dark' ? tw.color('neutral-500/60') : tw.color('gray-500/60')
      }
      preset="outline"
      validationMessageStyle={tw`ml-3 text-xs`}
      {...(loading && {
        trailingAccessory: (
          <View style={tw`relative size-6 shrink-0`}>
            <HorizontalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
              style={tw`size-full`}
            />
          </View>
        ),
      })}
      {...otherProps}
    />
  );
};

export default forwardRef(AppTextField);
