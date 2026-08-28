import dayjs from 'dayjs';
import { File, Paths } from 'expo-file-system';
import { useIsFocused, useLocalSearchParams } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollViewRef } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import AppFader from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import AppMonoText from '@/components/AppMonoText';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import useAppState from '@/helpers/app-state';
import { getLogFileName } from '@/helpers/logger';
import { useAppPaddingBottom } from '@/helpers/screen';

const readLogFile = (logDate: string): Promise<string> => {
  const file = new File(Paths.document, getLogFileName(logDate));
  return file.exists ? file.text() : Promise.resolve('');
};

const LogDate = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { logDate } = useLocalSearchParams<{ logDate: string }>();
  const paddingBottom = useAppPaddingBottom();
  const isFocused = useIsFocused();
  const activeSince = useAppState();
  const scrollViewRef = useRef<KeyboardAwareScrollViewRef>(null);
  const [text, setText] = useState('');
  const [isFetching, setFetching] = useState(false);

  const fetchLogs = useCallback(() => {
    setFetching(true);
    return readLogFile(logDate)
      .then(setText)
      .finally(() => setFetching(false));
  }, [logDate]);

  useEffect(() => {
    if (isFocused) {
      fetchLogs();
    }
  }, [isFocused, activeSince, fetchLogs]);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const logLines = useMemo(() => (text ? text.split('\n') : []), [text]);

  return (
    <ServiceLayout
      footer={
        <Animated.View
          entering={FadeInDown.duration(500).delay(300)}
          style={[
            tw`absolute inset-x-0 bottom-0 flex flex-row items-center justify-end px-6`,
            { paddingBottom },
          ]}>
          <AppFader
            position={Fader.position.BOTTOM}
            size={64}
            style={tw`absolute inset-0`}
            tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100')}
          />
          <AppIconButton icon="chevron-down" onPress={scrollToBottom} />
        </Animated.View>
      }
      loading={isFetching}
      scrollViewRef={scrollViewRef}
      title={capitalize(dayjs(logDate, 'YYYY-MM-DD').format('LL'))}
      onRefresh={fetchLogs}>
      {isFetching ? (
        <Animated.View
          exiting={FadeOut.duration(300)}
          style={tw`flex size-full flex-row items-center justify-center`}>
          <VerticalLoadingAnimation
            color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
            style={tw`size-16`}
          />
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[tw`px-6 py-4`, { paddingBottom: paddingBottom }]}>
          {logLines.length ? (
            logLines.map((line, index) => <LogLine key={index} line={line} />)
          ) : (
            <AppMonoText>{t('advanced.logs.empty')}</AppMonoText>
          )}
        </Animated.View>
      )}
    </ServiceLayout>
  );
};

// mirrors logger.ts's consoleTransport `colors` option, so a line reads the same here as in the console
const LOG_LEVEL_REGEX = / \| ([A-Z]+) : /;
const LOG_LEVEL_COLORS: Record<string, { light: string; dark: string }> = {
  INFO: { light: 'blue-600', dark: 'blue-400' },
  WARN: { light: 'amber-600', dark: 'amber-400' },
  ERROR: { light: 'red-600', dark: 'red-400' },
};

const getLineColor = (line: string): string | undefined => {
  const level = line.match(LOG_LEVEL_REGEX)?.[1];
  const colors = level ? LOG_LEVEL_COLORS[level] : undefined;
  return colors && (tw.prefixMatch('dark') ? tw.color(colors.dark) : tw.color(colors.light));
};

const LogLine = ({ line }: { line: string }) => {
  const color = getLineColor(line);
  return <AppMonoText style={color ? { color } : undefined}>{line}</AppMonoText>;
};

export default LogDate;
