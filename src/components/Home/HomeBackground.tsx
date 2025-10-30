import {
  AnimatedProp,
  BlurMask,
  Canvas,
  Circle,
  CircleProps,
  LinearGradient,
  Rect,
  SkPoint,
} from '@shopify/react-native-skia';
import { useEffect, useRef } from 'react';
import { Dimensions, StyleProp, ViewStyle } from 'react-native';
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { theme } from '@/helpers/colors';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const SIZES = {
  HOME: {
    HEADER: 60,
  },
  WINDOW: {
    HEIGHT: windowHeight,
    WIDTH: windowWidth,
  },
};

// const BlurCircleColors = ['#D6D9FA', '#D6F9EE', '#FFF0DC', 'lavender', 'aliceblue', 'lightyellow'];
const BlurCircleColors = [
  theme.miramonYellow,
  theme.charlestonGreen,
  // theme.maizeCrayola,
  // theme.peachYellow,
  // theme.papayaWhip,
  // theme.darkVanilla,
];

const BlurCircle = ({
  delay = 0,
  ...props
}: CircleProps & {
  /** Responsible for the time after which the animation starts in the circle */
  delay?: number;
}) => {
  /** Randomly mixed colors */
  const colors = useRef([...BlurCircleColors].sort(() => Math.random() - 0.5)).current;
  /** Time to animate all colors */
  const colorAnimationDuration = useRef(colors.length * 1500).current;
  /** Parameter responsible for color animation */
  const color = useSharedValue(0);

  /** Parameter responsible for radius animation */
  const radius = useSharedValue(props.r);

  /** Radius of the animated circle */
  const radiusAnimationSize = useRef(props.r + props.r * 0.3).current;

  const animatedColor = useDerivedValue(() =>
    interpolateColor(
      color.value,
      colors.map((_, index) => index / (colors.length - 1)),
      [...colors],
    ),
  );

  useEffect(() => {
    // Change radius after delay and and loop it
    radius.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(radiusAnimationSize, { duration: 2500 }),
          withTiming(props.r, { duration: 2500 }),
        ),
        -1,
      ),
    );
    // Change color after delay and and loop it
    color.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: colorAnimationDuration }),
          withTiming(0, { duration: colorAnimationDuration }),
        ),
        -1,
      ),
    );
  }, [props.r, delay]);

  return <Circle {...props} color={animatedColor} r={radius} />;
};

const HomeBackground = () => {
  /** Radius of circle */
  const r = useRef(SIZES.WINDOW.WIDTH / 2.5).current;
  /** An array responsible for how many circles will be located on the screen */
  const circles = useRef(new Array(2).fill(1)).current;
  /** The distance the elements will be located from each other */
  const step = SIZES.WINDOW.HEIGHT / circles.length;

  return (
    <Canvas style={tw`absolute inset-0`}>
      {circles.map((_, index) => (
        <BlurCircle
          // Arrange elements in a checkerboard pattern
          cx={index % 2 ? SIZES.WINDOW.WIDTH : 0}
          cy={step * index}
          delay={index * 1000}
          key={index}
          r={r}>
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <BlurMask blur={100} style="normal" />
        </BlurCircle>
      ))}
    </Canvas>
  );
};

const BlurEdge = ({
  enabled,
  height,
  style,
  ...props
}: {
  enabled?: boolean;
  height: number;
  colors: string[];
  style: StyleProp<ViewStyle>;
  start: AnimatedProp<SkPoint>;
  end: AnimatedProp<SkPoint>;
}) => {
  if (!enabled) {
    return null;
  }

  return (
    <Canvas style={[style, { height }]}>
      <Rect height={height} width={SIZES.WINDOW.WIDTH} x={0} y={0}>
        <LinearGradient {...props} />
      </Rect>
    </Canvas>
  );
};

BlurEdge.defaultProps = {
  enabled: true,
};

// inspired by https://medium.com/@shusachenko/animated-gradient-background-with-react-native-skia-8c9b091c5337
export default HomeBackground;
