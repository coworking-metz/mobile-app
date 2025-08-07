import ServiceRow, { ServiceRowProps } from './ServiceRow';
import { Link } from 'expo-router';
import React, { forwardRef, type ForwardRefRenderFunction } from 'react';
import { TouchableHighlight } from 'react-native';
import tw from 'twrnc';
import AppText from '@/components/AppText';

const ServiceRowLink: ForwardRefRenderFunction<
  typeof TouchableHighlight,
  ServiceRowProps & {
    href: string;
  }
> = ({ href, ...props }, ref) => {
  return (
    <Link asChild href={href}>
      <ServiceRow
        ref={ref}
        {...props}
        description={href.replace('https://', '').replace(/\/$/, '')}
        renderDescription={(d) => (
          <AppText style={tw`text-sm font-normal text-amber-500`}>{d}</AppText>
        )}
        suffixIcon="open-in-new"
      />
    </Link>
  );
};

export default forwardRef(ServiceRowLink);
