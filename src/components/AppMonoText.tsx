import { forwardRef, ForwardRefRenderFunction } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';
import tw from 'twrnc';

export type AppMonoTextProps = Omit<TextInputProps, 'value' | 'children'> & {
  children?: string;
  style?: StyleProp<TextStyle>;
};

// a read-only multiline TextInput instead of a Text: RN's Text `selectable` only lets you
// copy the whole block, while a native text input lets you drag the selection handles to
// grab just part of it — needed to copy a snippet out of logs/error output
const AppMonoText: ForwardRefRenderFunction<TextInput, AppMonoTextProps> = (
  { children, style, ...otherProps },
  ref,
) => {
  return (
    <TextInput
      ref={ref}
      multiline
      editable={false}
      style={[tw`p-0 text-left font-mono text-sm text-slate-500 dark:text-neutral-500`, style]}
      value={children}
      {...otherProps}
    />
  );
};

export default forwardRef(AppMonoText);
