import AppIcon, { MaterialCommunityIconsName } from '../AppIcon';
import React, { forwardRef, type ForwardRefRenderFunction, type ReactNode } from 'react';
import { TouchableHighlight, View, type TouchableHighlightProps } from 'react-native';
import tw from 'twrnc';
import HorizontalLoadingAnimation from '@/components/Animations/HorizontalLoadingAnimation';
import AppText from '@/components/AppText';
import Divider from '@/components/Divider';

export type ServiceRowProps = TouchableHighlightProps & {
  label: string;
  description?: string;
  renderDescription?: (text?: string, disabled?: boolean) => ReactNode;
  prefixIcon?: MaterialCommunityIconsName | null;
  suffixIcon?: MaterialCommunityIconsName | null;
  prefix?: ReactNode;
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
    prefix,
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
  const iconColor = tw.prefixMatch('dark') ? tw.color('stone-400') : tw.color('gray-700');

  return (
    <TouchableHighlight
      ref={ref as never}
      disabled={disabled || loading || !onPress}
      style={[
        tw`flex flex-col px-2 rounded-2xl`,
        selected && tw`bg-gray-200/75 dark:bg-zinc-800/75`,
        style,
      ]}
      underlayColor={tw.prefixMatch('dark') ? tw.color('neutral-700/30') : tw.color('gray-200')}
      onPress={onPress}>
      <View style={tw`flex flex-col`}>
        <View style={tw`flex flex-row items-start min-h-14 gap-3 py-2`}>
          {prefix ??
            (prefixIcon ? (
              <View style={tw`flex flex-row items-center shrink-0 min-h-10`}>
                <AppIcon
                  color={iconColor}
                  icon={prefixIcon}
                  size={24}
                  style={[tw`shrink-0`, disabled && tw`opacity-40`]}
                />
              </View>
            ) : null)}

          <View style={tw`flex flex-col justify-center shrink grow overflow-hidden min-h-10`}>
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
                  tw`text-sm font-normal text-slate-500 dark:text-neutral-500`,
                  disabled && tw`opacity-40`,
                ]}>
                {description}
              </AppText>
            ) : null}
          </View>

          <View style={tw`flex flex-row items-center shrink-0 grow-0 min-h-10`}>
            {children}
            {loading ? (
              <View style={tw`relative h-10 w-10 shrink-0`}>
                <HorizontalLoadingAnimation color={iconColor} style={tw`h-full w-full`} />
              </View>
            ) : suffixIcon ? (
              <AppIcon
                color={iconColor}
                icon={suffixIcon}
                size={24}
                style={[tw`shrink-0 grow-0`, disabled && tw`opacity-40`]}
              />
            ) : null}
          </View>
        </View>
        {withBottomDivider ? <Divider /> : null}
      </View>
    </TouchableHighlight>
  );
};

export default forwardRef(ServiceRow);
