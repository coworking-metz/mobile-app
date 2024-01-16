import React, { type ReactNode } from 'react';
import { type LayoutChangeEvent, View, type ViewProps } from 'react-native';
import Animated, { type AnimateProps } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import tw from 'twrnc';

const HomeCarousel = ({
  elements,
  ...props
}: AnimateProps<ViewProps> & { elements: ReactNode[] }) => {
  const [carouselWidth, setCarouselWidth] = React.useState<number>(0);

  return (
    <Animated.View
      {...props}
      onLayout={({ nativeEvent }: LayoutChangeEvent) => setCarouselWidth(nativeEvent.layout.width)}>
      {carouselWidth && elements.length ? (
        <Carousel
          snapEnabled
          data={elements}
          // height={`100%`}
          loop={false}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={[
                {
                  width:
                    carouselWidth -
                    (elements.length > 1
                      ? 16 + (index > 0 && index !== elements.length - 1 ? 16 : 0)
                      : 0),
                },
                index > 0 && tw`ml-4`,
              ]}>
              {item}
            </View>
          )}
          style={[tw`flex flex-row w-full overflow-visible`]}
          width={elements.length > 1 ? carouselWidth - 16 : carouselWidth}
        />
      ) : (
        <></>
      )}
    </Animated.View>
  );
};

export default HomeCarousel;
