import ServiceRow, { ServiceRowProps } from './ServiceRow';
import { Link, WebAnchorProps } from 'expo-router';
import React, { forwardRef, type ForwardRefRenderFunction } from 'react';
import { TouchableHighlight } from 'react-native';
import tw from 'twrnc';
import AppText from '@/components/AppText';

const ServiceRowLink: ForwardRefRenderFunction<
  typeof TouchableHighlight,
  ServiceRowProps & {
    href: string;
    target?: WebAnchorProps['target'];
  }
> = ({ href, target, ...props }, ref) => {
  return (
    <Link asChild href={href} target={target}>
      <ServiceRow
        ref={ref}
        description={href.replace('https://', '').replace(/\/$/, '')}
        renderDescription={(d) => (
          <AppText style={tw`text-sm font-normal text-amber-500`}>{d}</AppText>
        )}
        suffixIcon="open-in-new"
        {...props}
      />
    </Link>
  );
};

export default forwardRef(ServiceRowLink);
