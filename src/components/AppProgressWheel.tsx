import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import React from 'react';
import { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';

export type AppProgressWheelProps = {
  size: number;
  strokeWidth?: number;
  backgroundColor?: string;
  color?: string | SharedValue<string>;
  progress: SharedValue<number>;
};

const AppProgressWheel = ({
  size,
  color,
  progress,
  strokeWidth = 1,
  backgroundColor = '#E9F3FF',
}: AppProgressWheelProps) => {
  const radius = size / 2 - strokeWidth / 2;

  const path = useMemo(() => {
    const skPath = Skia.Path.Make();

    skPath.addCircle(size / 2, size / 2, radius);

    return skPath;
  }, [radius, size]);

  const style = {
    width: size,
    height: size,
  };

  const origin = {
    x: size / 2,
    y: size / 2,
  };

  const transform = [
    {
      rotate: -Math.PI / 2,
    },
  ];

  return (
    <Canvas style={style}>
      <Group origin={origin} transform={transform}>
        <Path
          color={backgroundColor}
          end={1}
          path={path}
          start={0}
          strokeCap={'round'}
          strokeWidth={strokeWidth}
          // eslint-disable-next-line tailwindcss/no-custom-classname
          style={'stroke'}
        />
        <Path
          color={color ?? '#0090FF'}
          end={progress}
          path={path}
          start={0}
          strokeCap={'round'}
          strokeWidth={strokeWidth}
          // eslint-disable-next-line tailwindcss/no-custom-classname
          style={'stroke'}
        />
      </Group>
    </Canvas>
  );
};

export default AppProgressWheel;
