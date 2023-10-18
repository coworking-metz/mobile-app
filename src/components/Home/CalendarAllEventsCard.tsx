import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { type LayoutChangeEvent, Text, View } from 'react-native';
import { Fader } from 'react-native-ui-lib';
import tw from 'twrnc';

const BalanceCard = ({ loading = false }: { loading?: boolean }) => {
  const { t } = useTranslation();
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  return (
    <View
      style={tw`flex flex-row items-start justify-start gap-2 bg-gray-200 dark:bg-gray-900 rounded-2xl h-24 self-stretch overflow-hidden pl-3`}>
      {loading ? (
        <View style={tw`flex flex-row justify-between items-start grow`}>
          <View style={tw`flex flex-col gap-2 mt-3`}>
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={16}
              width={128}
            />
            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height={28}
              width={192}
            />
          </View>
          <View
            style={[tw`h-full grow relative`]}
            onLayout={({ nativeEvent }: LayoutChangeEvent) =>
              setContainerWidth(nativeEvent.layout.width)
            }>
            <View style={tw`absolute left-0 top-0 bottom-0 z-10`}>
              <Fader
                visible
                position={Fader.position.START}
                size={containerWidth / 4}
                tintColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-200')}
              />
            </View>

            <Skeleton
              backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
              colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
              height="100%"
              radius={'square'}
              width={'100%'}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={tw`flex flex-col shrink-1 mr-auto mt-3`}>
            <Text style={tw`text-base text-slate-500 dark:text-slate-400`}>
              {t('home.calendar.all.description')}
            </Text>
            <Text style={tw`text-2xl text-slate-900 dark:text-gray-200`}>
              {t('home.calendar.all.label')}
            </Text>
          </View>
          <Image
            contentFit="cover"
            contentPosition={{
              top: 8,
              left: 0,
            }}
            source={require('@/assets/images/calendar-outline.svg')}
            style={[tw`h-full grow max-w-[7rem] ml-3 `]}
          />
        </>
      )}
    </View>
  );
};

export default BalanceCard;
