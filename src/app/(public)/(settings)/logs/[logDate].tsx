import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { File, Paths } from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import { capitalize, compact } from 'lodash';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollViewRef } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { Fader } from 'react-native-ui-lib';
import tw, { useDeviceContext } from 'twrnc';
import VerticalLoadingAnimation from '@/components/Animations/VerticalLoadingAnimation';
import AppFader from '@/components/AppFader';
import AppIconButton from '@/components/AppIconButton';
import AppMonoText from '@/components/AppMonoText';
import ErrorState from '@/components/ErrorState';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import { isSilentError } from '@/helpers/error';
import { getLogFileName } from '@/helpers/logger';
import { useAppPaddingBottom } from '@/helpers/screen';

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<LogEntry>);

type LogEntry = {
  time: string;
  level: string;
  tag: string;
  message: string;
};

const LOG_LEVELS = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

// "TIME | [tag] | LEVEL : message", mirroring logger.ts's printDate/printLevel format. Split
// on the literal " | "/" : " separators instead of matching TIME's exact shape with a regex:
// toLocaleTimeString()'s format varies by platform/locale (eg. Android can render 24h time
// with no AM/PM, which a regex expecting "hh:mm:ss AM/PM" would fail to match)
const parseLogEntries = (text: string): LogEntry[] => {
  const lines = text.replace(/\n$/, '').split('\n');
  const entries: LogEntry[] = [];
  for (const line of lines) {
    const [time, tag, ...rest] = line.split(' | ');
    const levelMatch = rest.length ? rest.join(' | ').match(/^([A-Z]+) : (.*)$/) : null;
    const level = levelMatch?.[1];
    if (time && tag?.startsWith('[') && level && LOG_LEVELS.includes(level)) {
      entries.push({ time, level, tag, message: levelMatch![2] });
    } else if (entries.length > 0) {
      const entry = entries[entries.length - 1];
      entry.message = entry.message ? `${entry.message}\n${line}` : line;
    }
  }
  return entries;
};

const readLogFile = async (logDate: string) => {
  const file = new File(Paths.document, getLogFileName(logDate));
  // don't pre-check file.exists: on Android its permission check can silently return false
  // for a file that's actually there and readable, so just attempt the read directly
  try {
    const text = await file.text();
    return parseLogEntries(text);
  } catch {
    return [];
  }
};

const LogDate = () => {
  useDeviceContext(tw);
  const { t } = useTranslation();
  const { logDate } = useLocalSearchParams<{ logDate: string }>();
  const paddingBottom = useAppPaddingBottom();
  const scrollViewRef = useRef<KeyboardAwareScrollViewRef>(null);

  const {
    isPending: isPendingLogLines,
    isFetching: isFetchingLogLines,
    data: logLines,
    error: fetchLogLinesError,
    refetch: refetchLogLines,
  } = useQuery({
    queryKey: ['logLines', logDate],
    queryFn: () => readLogFile(logDate),
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    refetchInterval: 3_000,
  });

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <ServiceLayout
      contentStyle={tw`pb-16 pt-4`}
      footer={
        logLines?.length ? (
          <Animated.View
            entering={FadeInDown.duration(500).delay(300)}
            style={[
              tw`absolute inset-x-0 bottom-0 flex flex-row items-center justify-end px-6`,
              { paddingBottom },
            ]}>
            <AppFader
              position={Fader.position.BOTTOM}
              size={48}
              style={tw`absolute inset-0`}
              tintColor={tw.prefixMatch('dark') ? tw.color('black') : tw.color('gray-100')}
            />
            <AppIconButton icon="chevron-down" onPress={scrollToBottom} />
          </Animated.View>
        ) : null
      }
      loading={isFetchingLogLines}
      scrollViewRef={scrollViewRef}
      title={capitalize(dayjs(logDate, 'YYYY-MM-DD').format('LL'))}
      onRefresh={refetchLogLines}>
      {logLines?.length ? (
        <AnimatedFlashList
          inverted
          contentContainerStyle={tw`px-6`}
          data={logLines}
          decelerationRate="fast"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          horizontal={false}
          keyExtractor={(entry, index) => `${entry.time}-${index}`}
          maxItemsInRecyclePool={10}
          renderItem={({ item: entry }) => <LogLine entry={entry} />}
        />
      ) : isPendingLogLines ? (
        <Animated.View
          exiting={FadeOut.duration(300)}
          style={tw`flex size-full flex-row items-center justify-center`}>
          <VerticalLoadingAnimation
            color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
            style={tw`size-16`}
          />
        </Animated.View>
      ) : fetchLogLinesError && !isSilentError(fetchLogLinesError) ? (
        <ErrorState error={fetchLogLinesError} title={t('advanced.logs.onFetch.fail')} />
      ) : (
        <AppMonoText style={tw`px-6 py-4 text-center text-gray-500`}>
          {t('advanced.logs.empty')}
        </AppMonoText>
      )}
    </ServiceLayout>
  );
};

// mirrors logger.ts's consoleTransport `colors` option, so an entry reads the same here as in the console
const LOG_LEVEL_COLORS: Record<string, { light: string; dark: string }> = {
  INFO: { light: 'blue-600', dark: 'blue-400' },
  WARN: { light: 'amber-600', dark: 'amber-400' },
  ERROR: { light: 'red-600', dark: 'red-400' },
};

const getLevelColor = (level: string): string | undefined => {
  const colors = LOG_LEVEL_COLORS[level];
  return colors && (tw.prefixMatch('dark') ? tw.color(colors.dark) : tw.color(colors.light));
};

const LogLine = ({ entry }: { entry: LogEntry }) => {
  const color = getLevelColor(entry.level);
  return (
    <AppMonoText style={color ? { color } : undefined}>
      {compact([entry.time, entry.tag, entry.message]).join(' | ')}
    </AppMonoText>
  );
};

export default LogDate;
