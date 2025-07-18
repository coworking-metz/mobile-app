import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { forwardRef, type ReactNode, type ForwardRefRenderFunction } from 'react';
import { View, TouchableHighlight, type TouchableHighlightProps } from 'react-native';
import tw from 'twrnc';
import type mdiGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppText from '@/components/AppText';
import Divider from '@/components/Divider';

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

const ServiceRow: ForwardRefRenderFunction<typeof TouchableHighlight, ServiceRowProps> = (
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
      ref={ref as never}
      disabled={disabled || loading || !onPress}
      style={[
        tw`flex flex-col px-2 rounded-xl`,
        selected && tw`bg-gray-200/75 dark:bg-zinc-800/75`,
        style,
      ]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('zinc-800') : tw.color('gray-200')}
      onPress={onPress}>
      <>
        <View style={tw`flex flex-row items-center min-h-14 gap-3 py-2`}>
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
            <AppText
              style={[
                tw`text-base leading-5 font-normal dark:text-gray-200`,
                disabled && tw`opacity-40`,
              ]}
              {...(Boolean(description || renderDescription) && { numberOfLines: 1 })}>
              {label}
            </AppText>
            {renderDescription ? (
              renderDescription(description, disabled)
            ) : description ? (
              <AppText
                style={[
                  tw`text-sm font-normal text-slate-500 dark:text-slate-400`,
                  disabled && tw`opacity-40`,
                ]}>
                {description}
              </AppText>
            ) : null}
          </View>
          <>{children}</>
          {loading ? (
            <View style={tw`relative h-10 w-10 shrink-0`}>
              <HorizontalLoadingAnimation color={iconColor} style={tw`h-full w-full`} />
            </View>
          ) : suffixIcon ? (
            <MaterialCommunityIcons
              color={iconColor}
              iconStyle={{ height: 20, width: 20, marginRight: 0 }}
              name={suffixIcon}
              size={24}
              style={[tw`shrink-0 grow-0`, disabled && tw`opacity-40`]}
            />
          ) : null}
        </View>
        {withBottomDivider ? <Divider /> : null}
      </>
    </TouchableHighlight>
  );
};

export default forwardRef(ServiceRow);
