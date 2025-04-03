import { MotiSkeletonProps } from 'moti/build/skeleton/types';
import { Skeleton } from 'moti/skeleton';
import tw from 'twrnc';

const LoadingSkeleton = ({ children, ...otherProps }: Omit<MotiSkeletonProps, 'Gradient'>) => {
  return (
    <Skeleton
      backgroundColor={tw.prefixMatch('dark') ? tw.color('gray-900') : tw.color('gray-300')}
      colorMode={tw.prefixMatch('dark') ? 'dark' : 'light'}
      {...otherProps}>
      {children}
    </Skeleton>
  );
};

export default LoadingSkeleton;
