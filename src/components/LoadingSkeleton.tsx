import { Skeleton } from 'moti/skeleton';
import { type ComponentProps } from 'react';
import tw from 'twrnc';

const LoadingSkeleton = ({
  children,
  ...otherProps
}: Omit<ComponentProps<typeof Skeleton>, 'Gradient'>) => {
  return (
    <Skeleton
      backgroundColor={tw.prefixMatch('dark') ? tw.color('zinc-900') : tw.color('gray-300')}
      colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
      {...otherProps}>
      {children}
    </Skeleton>
  );
};

export default LoadingSkeleton;
