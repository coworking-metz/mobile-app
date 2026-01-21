import { Skeleton } from 'moti/skeleton';
import { MotiSkeletonProps } from 'node_modules/moti/build/skeleton/types';
import tw from 'twrnc';

const LoadingSkeleton = ({ children, ...otherProps }: Omit<MotiSkeletonProps, 'Gradient'>) => {
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
