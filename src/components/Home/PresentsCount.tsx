import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type ViewProps } from 'react-native';
import AnimatedNumber from 'react-native-animated-number';
import tw from 'twrnc';

const PresentsCount = ({
  count = 0,
  total = 0,
  loading = false,
  style,
  ...props
}: ViewProps & { count?: number; total?: number; loading?: boolean }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={[tw`flex flex-col gap-2 justify-end h-24 overflow-hidden`, style]} {...props}>
        <View style={tw`flex flex-row items-end gap-3`}>
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={56}
            radius={16}
            width={80}
          />
          <Skeleton
            backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
            colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
            height={28}
            width={96}
          />
        </View>

        <Skeleton
          backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
          colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
          height={21}
          width={144}
        />
      </View>
    );
  }

  return (
    <View style={[tw`flex flex-col justify-end h-24 overflow-hidden`, style]} {...props}>
      <View style={tw`flex flex-row w-full items-end`}>
        <View style={tw`flex flex-col h-18 pt-3`}>
          <AnimatedNumber
            style={tw`text-7xl leading-[4.5rem] font-bold text-slate-900 dark:text-gray-200 min-w-[3rem] mb-[-1rem]`}
            time={48} // milliseconds between each step
            value={count}
          />
        </View>
        <Text style={tw`text-4xl font-normal text-slate-500 dark:text-slate-400 h-9 mb-2`}>
          {t('home.people.capacity', { total: total })}
        </Text>
      </View>

      <Text style={tw`text-xl text-slate-500 dark:text-slate-400`}>
        {t('home.people.present', { count: count })}
      </Text>
    </View>
  );
};

export default PresentsCount;
