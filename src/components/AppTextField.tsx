import {
  forwardRef,
  ForwardRefRenderFunction,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  StyleProp,
  TextInput,
  TextInputInstance,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import tw from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppText from '@/components/AppText';
import { withAppFontFamily } from '@/helpers/text';

export type AppTextFieldValidator = 'required' | ((value?: string) => boolean);

export type AppTextFieldRef = Pick<TextInputInstance, 'focus' | 'blur' | 'clear' | 'isFocused'> & {
  validate: () => boolean;
};

export type AppTextFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  leadingAccessory?: ReactElement;
  trailingAccessory?: ReactElement;
  validate?: AppTextFieldValidator | AppTextFieldValidator[];
  validationMessage?: string | string[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showCharCounter?: boolean;
  // reserves room under the field for the validation message, even when valid
  enableErrors?: boolean;
};

const runValidators = (
  value: string | undefined,
  validate: AppTextFieldProps['validate'],
): number | undefined => {
  const validators = validate === undefined ? [] : Array.isArray(validate) ? validate : [validate];
  const failingIndex = validators.findIndex((validator) =>
    validator === 'required' ? !value : !validator(value),
  );
  return failingIndex === -1 ? undefined : failingIndex;
};

const AppTextField: ForwardRefRenderFunction<AppTextFieldRef, AppTextFieldProps> = (
  {
    label,
    loading,
    containerStyle,
    style,
    leadingAccessory,
    trailingAccessory,
    validate,
    validationMessage,
    validateOnChange,
    validateOnBlur = true,
    showCharCounter,
    enableErrors = true,
    value,
    maxLength,
    editable,
    onFocus,
    onBlur,
    ...inputProps
  },
  ref,
) => {
  const inputRef = useRef<TextInputInstance>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [failingIndex, setFailingIndex] = useState<number>();
  const [hasValidated, setHasValidated] = useState(false);

  const isValid = !hasValidated || failingIndex === undefined;
  const isDisabled = editable === false;

  const runValidation = (valueToValidate = value) => {
    const index = runValidators(valueToValidate, validate);
    setFailingIndex(index);
    setHasValidated(true);
    return index === undefined;
  };

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => inputRef.current?.clear(),
    isFocused: () => inputRef.current?.isFocused() ?? false,
    validate: () => runValidation(),
  }));

  // validate on value change, skip mount so untouched fields don't start in error
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (validateOnChange) runValidation(value);
  }, [value]);

  const message = Array.isArray(validationMessage)
    ? validationMessage[failingIndex ?? 0]
    : validationMessage;

  const labelColorStyle = isDisabled
    ? tw`text-gray-400`
    : !isValid
      ? tw`text-red-600 dark:text-red-700`
      : isFocused
        ? tw`text-amber-500`
        : tw`text-slate-500 dark:text-neutral-500`;

  const inputColorStyle = isDisabled
    ? tw`text-zinc-400`
    : !isValid
      ? tw`text-red-500`
      : tw`text-gray-900 dark:text-gray-100`;

  return (
    <View style={containerStyle}>
      {label ? <AppText style={[tw`min-h-5 text-base`, labelColorStyle]}>{label}</AppText> : null}
      <View
        style={[
          tw`flex-row items-center rounded-xl border border-zinc-400 px-3 py-2 dark:border-zinc-700`,
          isFocused && tw`border-amber-500`,
          !isValid && tw`border-red-600 dark:border-red-700`,
        ]}>
        {leadingAccessory}
        <TextInput
          ref={inputRef}
          editable={editable}
          hitSlop={{ top: 20, bottom: 20 }}
          maxLength={maxLength}
          placeholderTextColor={
            tw.prefixMatch('dark') ? tw.color('neutral-500/60') : tw.color('gray-500/60')
          }
          style={withAppFontFamily([tw`h-6 grow p-0 text-base`, inputColorStyle, style])}
          value={value}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
            if (validateOnBlur) runValidation();
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          {...inputProps}
        />
        {loading ? (
          <View style={tw`relative size-6 shrink-0`}>
            <HorizontalLoadingAnimation
              color={tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700')}
              style={tw`size-full`}
            />
          </View>
        ) : (
          trailingAccessory
        )}
      </View>
      {enableErrors || (showCharCounter && maxLength !== undefined) ? (
        <View style={tw`flex-row justify-between`}>
          <AppText style={tw`ml-3 min-h-5 shrink text-xs text-red-500`}>
            {enableErrors && !isValid ? message : ''}
          </AppText>
          {showCharCounter && maxLength !== undefined ? (
            <AppText style={tw`mr-3 text-xs text-slate-500 dark:text-neutral-500`}>
              {`${value?.length ?? 0}/${maxLength}`}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default forwardRef(AppTextField);
