import ErrorAnimation from './Animations/ErrorAnimation';
import AppText from './AppText';
import React, { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle, type ViewProps } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { parseErrorText } from '@/helpers/error';

const ErrorState = ({
  title,
  error,
  style,
  children,
  ...props
}: AnimatedProps<ViewProps> & {
  title: string;
  error?: Error;
  style?: StyleProp<ViewStyle>;
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
    <Animated.View style={[tw`flex flex-col items-center gap-2 p-6`, style]} {...props}>
      <ErrorAnimation style={tw`h-32 w-32 mb-2`} />
      <AppText
        style={tw`text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-200`}>
        {title}
      </AppText>
      <ReadMore
        numberOfLines={3}
        renderRevealedFooter={(handlePress) => (
          <AppText style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
            {t('actions.hide')}
          </AppText>
        )}
        renderTruncatedFooter={(handlePress) => (
          <AppText style={tw`text-base font-normal text-amber-500 text-left`} onPress={handlePress}>
            {t('actions.readMore')}
          </AppText>
        )}>
        <AppText style={tw`text-center text-xl font-normal text-slate-500 dark:text-slate-400`}>
          {description}
        </AppText>
      </ReadMore>
      {children}
    </Animated.View>
  );
};

export default ErrorState;
