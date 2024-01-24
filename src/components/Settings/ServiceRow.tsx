import HorizontalLoadingAnimation from '../Animations/HorizontalLoadingAnimation';
import Divider from '../Divider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import React, { forwardRef, type ReactNode, type ForwardRefRenderFunction } from 'react';
import { View, Text, TouchableHighlight, type TouchableHighlightProps } from 'react-native';
import tw from 'twrnc';

export type ServiceRowProps = TouchableHighlightProps & {
  label: string;
  description?: string;
  renderDescription?: (text?: string, disabled?: boolean) => ReactNode;
  prefixIcon?: keyof typeof mdiGlyphMap | null;
  suffixIcon?: keyof typeof mdiGlyphMap | null;
  children?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  selected?: boolean;
  withBottomDivider?: boolean;
};

const ServiceRow: ForwardRefRenderFunction<TouchableHighlight, ServiceRowProps> = (
  {
    label,
    description,
    renderDescription,
    prefixIcon = null,
    suffixIcon = null,
    children,
    loading = false,
    disabled = false,
    selected = false,
    withBottomDivider = false,
    onPress,
    style,
  },
  ref,
) => {
  const iconColor = tw.prefixMatch('dark') ? tw.color('gray-400') : tw.color('gray-700');

  return (
    <TouchableHighlight
      ref={ref}
      disabled={disabled || loading || !onPress}
      style={[
        tw`flex flex-col h-14 px-2 rounded-xl`,
        selected && tw`bg-gray-100 dark:bg-zinc-800`,
        style,
      ]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-950') : tw.color('gray-200')}
      onPress={onPress}>
      <>
        <View style={tw`flex flex-row items-center h-full gap-3 py-2`}>
          {prefixIcon ? (
            <MaterialCommunityIcons
              color={iconColor}
              iconStyle={{ height: 20, width: 20, marginRight: 0 }}
              name={prefixIcon}
              size={24}
              style={[tw`shrink-0`, disabled && tw`opacity-40`]}
            />
          ) : null}
          <View style={tw`flex flex-col shrink grow overflow-hidden`}>
            <Text
              numberOfLines={description ? 1 : 2}
              style={[
                tw`text-base leading-5 font-normal dark:text-gray-200`,
                disabled && tw`opacity-40`,
              ]}>
              {label}
            </Text>
            {renderDescription ? (
              renderDescription(description, disabled)
            ) : description ? (
              <Text
                numberOfLines={1}
                style={[
                  tw`text-sm font-normal text-slate-500 dark:text-slate-400`,
                  disabled && tw`opacity-40`,
                ]}>
                {description}
              </Text>
            ) : null}
          </View>
          <>{children}</>
          {loading ? (
            <View style={tw`relative h-12 w-12 shrink-0`}>
              <HorizontalLoadingAnimation color={iconColor} />
            </View>
          ) : suffixIcon ? (
            <MaterialCommunityIcons
              color={iconColor}
              iconStyle={{ height: 24, width: 24, marginRight: 0 }}
              name={suffixIcon}
              size={28}
              style={[tw`shrink-0`, disabled && tw`opacity-40`]}
            />
          ) : null}
        </View>
        {withBottomDivider ? <Divider /> : null}
      </>
    </TouchableHighlight>
  );
};

export default forwardRef(ServiceRow);
