import VerticalLoadingAnimation from '../Animations/VerticalLoadingAnimation';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import Animated, { type StyleProps } from 'react-native-reanimated';
import tw from 'twrnc';
import { type ApiUserPresenceTimelineItem } from '@/services/api/profile';

const SQUARE_SIZE = 20;
const SQUARE_GAP = 1;
const MINIMUM_SQUARES = 150;

const PresenceGraph = ({
  loading = false,
  timeline = [],
  style,
}: {
  loading?: boolean;
  timeline?: ApiUserPresenceTimelineItem[];
  style?: StyleProps;
}) => {
  const { i18n } = useTranslation();
  const animatedScrollViewRef = useRef<Animated.ScrollView>(null);

  return loading ? (
    <View style={tw`flex flex-row items-center justify-center h-[210px]`}>
      <VerticalLoadingAnimation
        color={tw.prefixMatch('dark') ? tw.color(`gray-200`) : tw.color(`slate-900`)}
        style={tw`h-16`}
      />
    </View>
  ) : (
    <>
      <Animated.ScrollView
        ref={animatedScrollViewRef}
        contentContainerStyle={[tw`flex flex-col justify-end grow`]}
        horizontal={true}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={[style]}
        onContentSizeChange={() => animatedScrollViewRef.current?.scrollToEnd({ animated: true })}>
        <ContributionGraph
          chartConfig={{
            backgroundGradientTo: 'transparent',
            backgroundGradientFromOpacity: 0,
            backgroundGradientFrom: 'transparent',
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => {
              if (opacity > 0.15) {
                return `rgba(234, 178, 52, ${opacity * 1.1})`;
              } else if (tw.prefixMatch('dark')) {
                return `rgba(255, 255, 255, 0.1)`;
              } else {
                return `rgba(128, 128, 128, 0.1)`;
              }
            },
            labelColor: (opacity = 1) =>
              tw.prefixMatch('dark')
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2, // optional, default 3
          }}
          endDate={new Date()}
          getMonthLabel={(month) =>
            new Intl.DateTimeFormat(i18n.language, { month: 'long', timeZone: 'UTC' }).format(
              new Date(`2023-${month < 9 ? `0${month + 1}` : month + 1}-01`),
            )
          }
          height={210}
          numDays={Math.max(timeline.length, MINIMUM_SQUARES)}
          style={tw`w-full`}
          tooltipDataAttrs={({ date }) => ({
            // onPress: (evt) => {
            //   console.log(evt.nativeEvent.pageX, date);
            // },
          })}
          values={timeline.map((item) => ({
            date: item.date,
            count: item.amount,
          }))}
          width={
            Math.ceil(Math.max(timeline.length, MINIMUM_SQUARES) / 7) * (SQUARE_SIZE + SQUARE_GAP) +
            64
          } // magic formula
        />
      </Animated.ScrollView>
    </>
  );
};

export default PresenceGraph;
