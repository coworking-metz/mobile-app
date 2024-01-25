import ErrorAnimation from './Animations/ErrorAnimation';
import React, { useState, type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type ViewProps } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import Animated, { type AnimateProps, type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { parseErrorText } from '@/helpers/error';

const ErrorState = ({
  title,
  error,
  style,
  children,
  ...props
}: AnimateProps<ViewProps> & {
  title: string;
  error?: Error;
  style?: StyleProps | false;
  children?: ReactNode;
}) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      (async () => {
        const errorMessage = await parseErrorText(error);
        setDescription(errorMessage);
      })();
    }
  }, [error]);

  return (
    <Animated.View style={[tw`flex flex-row gap-3 items-start`, style]} {...props}>
      <ErrorAnimation style={tw`h-12`} />
      <View style={tw`flex flex-col items-start shrink`}>
        <Text style={tw`text-xl font-semibold tracking-tight text-slate-900 dark:text-gray-200`}>
          {title}
        </Text>
        <ReadMore
          numberOfLines={3}
          renderRevealedFooter={(handlePress) => (
            <Text style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
              {t('actions.hide')}
            </Text>
          )}
          renderTruncatedFooter={(handlePress) => (
            <Text style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
              {t('actions.readMore')}
            </Text>
          )}>
          <Text style={tw`text-left text-base font-normal text-slate-500 dark:text-slate-400`}>
            {description}
          </Text>
        </ReadMore>
        {children}
      </View>
    </Animated.View>
  );
};

export default ErrorState;
